import http from 'http';
import SQLToolsLanguageServer from '..';
import { DatabaseInterface } from '@sqltools/core/interface';
import { CreateNewConnectionRequest } from '@sqltools/core/contracts/connection-requests';

let Logger = console;
interface ExtendedIncommingMessage extends http.IncomingMessage {
  body?: string;
}

interface ExtendedServerResponse extends http.ServerResponse {
  sendJson(data: object | any[] | Buffer, code?: number);
}
type HTTPFunction = (req: ExtendedIncommingMessage, res: ExtendedServerResponse, next?: Function) => void;

interface QueryResultsState {
  isLoading: boolean;
  error: any;
  queries: string[];
  resultMap: { [id: string]: DatabaseInterface.QueryResults };
}

namespace HTTPServer {
  const bodyParse: HTTPFunction = (req, res, next) => {
    req.body = '';
    req.on('data', (data) => {
      req.body += data.toString();
    });

    req.on('end', (a, b) => {
      try {
        req.body = JSON.parse(req.body);
      } catch (error) { /**/ }
      return next();
    });
    req.on('error', (e)  => {
      return next(e);
    });
  };

  const endPoints: { [s: string]: { data: any, handler: HTTPFunction[] | HTTPFunction } } = {};
  const queryResultsState: QueryResultsState = {
    isLoading: false,
    error: null,
    queries: [],
    resultMap: {},
  };

  function reqHandler(req: http.IncomingMessage, res: ExtendedServerResponse) {
    if ((req.headers as any).origin || (req.headers as any).Origin)
      res.setHeader('Access-Control-Allow-Origin', (req.headers as any).origin || (req.headers as any).Origin);

    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', 86400000);

    if (req.method.toUpperCase() === 'OPTIONS') {
      // webview is always sending pre-flight requests
      res.writeHead(200);
      return res.end();
    }
    Logger.log(`Request came: ${req.method.toUpperCase()} ${req.url}`);
    return handleRoute(req, res);
  }

  function handleRoute(req: http.IncomingMessage, res: any) {
    res.sendJson = (data, code = 200) => {
      if (typeof data !== 'string' && !(data instanceof Buffer)) {
        data = JSON.stringify(data || { error: `${req.url} not found` }) as any;
      }
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.write(data);
      res.end();
    };
    const handlers = endPoints[`${req.method.toUpperCase()} ${req.url}`];
    if (!handlers) {
      return res.sendJson({ message: 'Invalid request' }, 404);
    }
    if (typeof handlers.handler !== 'function' || handlers.handler.length === 0 && handlers.data) {
      return res.sendJson(handlers.data);
    }

    const handlersArray: HTTPFunction[] = [bodyParse]
      .concat(Array.isArray(handlers.handler) ? handlers.handler : [handlers.handler]) as HTTPFunction[];
    try {
      let counter = 0;
      const next = (err) => {
        if (err) throw err;
        if (!handlersArray[counter + 1]) return;
        handlersArray[++counter](req, res, next);
      };
      handlersArray[0](req, res, next);
    } catch (error) {
      res.json({ error });
    }
  }

  export function use(method: 'GET' | 'POST', url: string, r: HTTPFunction | HTTPFunction[]) {
    Logger.log(`Defining method ${method} for ${url}`);
    const key = `${method.toUpperCase()} ${url}`;
    endPoints[key] = endPoints[key] || { data: null, handler: null };
    endPoints[key].handler = r;
  }

  export function get(url, r: HTTPFunction | HTTPFunction[]) {
    return use('GET', url, r);
  }

  export function post(url, r: HTTPFunction | HTTPFunction[]) {
    return use('POST', url, r);
  }

  export function set(url, data) {
    endPoints[url] = endPoints[url] || { data: null, handler: null };
    endPoints[url].data = data;
  }

  export function queryResultStatus(status, error?: any) {
    queryResultsState.isLoading = status;
    queryResultsState.error = error;
  }

  export function queryResult(query: string, data: DatabaseInterface.QueryResults) {
    queryResultsState.isLoading = false;
    if (!query) return;
    const index = queryResultsState.queries.indexOf(query);
    if (index > -1) {
      queryResultsState.queries.splice(index, 1);
    }
    if (!data) {
      delete queryResultsState.resultMap[query];

    } else {
      queryResultsState.resultMap[query] = data;
      queryResultsState.queries = [query].concat(queryResultsState.queries);
    }
    queryResultsState.isLoading = false;
  }

  const httpServer: http.Server = http.createServer(reqHandler);
  export function server(logger: any, port: number = 5123): http.Server {
    Logger = logger;
    if (!httpServer.listening) {
      httpServer.listen(port, () => {
        Logger.log(`SQLTools http server is listening on port ${port}`);
      });
    }
    return httpServer;
  }

  HTTPServer.get('/', (req, res) => res.sendJson({ endpoints: Object.keys(endPoints) }));
  HTTPServer.get('/api/query-results', (req, res) => res.sendJson(queryResultsState));
  HTTPServer.set('GET /api/statistics', {});
  HTTPServer.get('/api/status', (req, res) => void res.sendJson(SQLToolsLanguageServer.getStatus()));
  HTTPServer.post('/api/create-connection', (req, res) => {
    SQLToolsLanguageServer.getServer().sendRequest(CreateNewConnectionRequest.method, req.body)
      .then((result) => {
        return res.sendJson({ data: req.body, success: true });
      }, (err) => {
        Logger.error('LS: Create connection error: ' + err.toString());
        return res.sendJson({ data: req.body, success: false, error: err.message || err.toString() });
      });
  });
}

export default HTTPServer;
