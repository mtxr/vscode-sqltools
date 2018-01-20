import fs = require('fs');
import http = require('http');
import path = require('path');
import { IConnection } from 'vscode-languageserver';
import SQLToolsLanguageServer from '..';
import { CreateNewConnectionRequest } from '../../contracts/connection-requests';
import Logger from '../utils/logger';

const viewsPath = path.join(__dirname, 'views');

interface ExtendedIncommingMessage extends http.IncomingMessage {
  body?: string;
}

interface ExtendedServerResponse extends http.ServerResponse {
  sendJson(data: object | any[] | Buffer, code?: number);
}
type HTTPFunction = (req: ExtendedIncommingMessage, res: ExtendedServerResponse, next?: Function) => void;

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

  function reqHandler(req: http.IncomingMessage, res: ExtendedServerResponse) {
    Logger.log(`Request came: ${req.method.toUpperCase()} ${req.url}`);
    const ext = path.extname(req.url);
    // serve static
    if (ext !== '') return sendStatic(req.url, getContentType(ext), res);
    // serve home
    if (req.url === '/') return sendStatic('index.html', 'text/html', res);
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
      return res.sendJson({ message: 'Server starting...' });
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

  function sendStatic(url, contentType, res) {
    const file = path.join(viewsPath, url);
    fs.readFile(file, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.write(`File '${url}' Not Found!`);
        res.end();
        Logger.error(`Response: 404 ${url}`, err);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(content);
        res.end();
        Logger.log(`Response: 200 ${url}`);
      }
    });
  }

  function getContentType(ext: string): string {
    switch (ext) {
      case '':
      case '.json':
        return 'application/json';
      case '.html':
        return 'text/html';
      case '.css':
        return 'text/css';
      case '.js':
        return 'text/javascript';
      default:
        return 'application/octate-stream';
    }
  }

  export function use(method: 'GET' | 'POST', url: string, r: HTTPFunction | HTTPFunction[]) {
    Logger.log(`Defining data for ${url}`);
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

  const httpServer: http.Server = http.createServer(reqHandler);
  export function server(port: number = 5123): http.Server {
    if (!httpServer.listening) {
      httpServer.listen(port, () => {
        Logger.log(`SQLTools http server is listening on port ${port}`);
      });
    }
    return httpServer;
  }
}

export default HTTPServer;

HTTPServer.set('GET /api/query-results', []);
HTTPServer.set('GET /api/statistics', {});
HTTPServer.get('/api/status', (req, res) => void res.sendJson(SQLToolsLanguageServer.getStatus()));
HTTPServer.post('/api/create-connection', (req, res) => {
  SQLToolsLanguageServer.getServer().sendRequest(CreateNewConnectionRequest.method, req.body)
    .then((result) => {
      return res.sendJson({ data: req.body, success: true });
    }, (err) => {
      Logger.error('err', err);
      return res.sendJson({ data: req.body, success: false, error: err.message || err.toString() });
    });
});
