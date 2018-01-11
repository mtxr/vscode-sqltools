import fs = require('fs');
import http = require('http');
import path = require('path');
import { IConnection } from 'vscode-languageserver';
import { createNewConnection } from '../requests/connection-requests';
import Logger from '../utils/logger';

let languageServerInstance: IConnection = null;
const viewsPath = path.join(__dirname, '..', '..', 'views');

function bodyParse(req, res, next) {
  req.body = '';
  req.on('data', (data) => {
    req.body += data.toString();
  });

  req.on('end', (a, b) => {
    req.body = JSON.parse(req.body);
    next(req, res);
  });
  req.on('error', (e)  => {
    return res.sendJson({ error: e.stack || e.toString() }, 400);
  });
}

const apiData = {
  'GET /api/query-results': [],
  'GET /api/statistics': {},
  'POST /api/create-connection': (req: any, res: any) => {
    languageServerInstance.sendRequest(createNewConnection.method, req.body)
      .then((result) => {
        Logger.log('result', result);
        return res.sendJson({ data: req.body, success: true });
      }, (err) => {
        Logger.error('err', err);
        return res.sendJson({ data: req.body, success: false, error: err.message || err.toString() });
      });
  },
};

function handler(req: http.IncomingMessage, res: http.ServerResponse) {
  Object.defineProperty(res, 'sendJson', {
    value(data, code = 200) {
      if (typeof data !== 'string' && !(data instanceof Buffer)) {
        data = JSON.stringify(data || { error: `${req.url} not found` });
      }
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.write(data);
      res.end();
    },
  });
  Logger.log(`Request came: ${req.method.toUpperCase()} ${req.url}`);
  const ext = path.extname(req.url);
  // serve static
  if (ext !== '') return sendStatic(req.url, getContentType(ext), res);
  // serve home
  if (req.url === '/') return sendStatic('index.html', 'text/html', res);
  return handleRoute(req, res);
}

function handleRoute(req: http.IncomingMessage, res: any) {
  const result = apiData[`${req.method.toUpperCase()} ${req.url}`];
  if (typeof result !== 'function') {
    return res.sendJson(result);
  }
  return bodyParse(req, res, result);

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

function setData(url: string, data: any | any[]) {
  apiData[url] = data;
}

const httpServer: http.Server = http.createServer(handler);
export default function server(port: number = 5123, languageServer: IConnection): http.Server {
  if (!httpServer.listening) {
    languageServerInstance = languageServer;
    httpServer.listen(port, () => {
      Object.defineProperties(httpServer, {
        port: { value: port },
        setData: { value: setData, writable: false },
      });
      Logger.log(`SQLTools http server is listening on port ${port}`);
    });
  }
  return httpServer;
}
