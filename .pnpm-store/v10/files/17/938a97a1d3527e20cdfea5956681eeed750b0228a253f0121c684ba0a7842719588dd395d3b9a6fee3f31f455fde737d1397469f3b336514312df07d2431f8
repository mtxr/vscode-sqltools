# @koa/cors

[![NPM version][npm-image]][npm-url]
[![Node.js CI](https://github.com/koajs/cors/actions/workflows/nodejs.yml/badge.svg)](https://github.com/koajs/cors/actions/workflows/nodejs.yml)
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@koa/cors.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@koa/cors
[codecov-image]: https://codecov.io/github/koajs/cors/coverage.svg?branch=v2.x
[codecov-url]: https://codecov.io/github/koajs/cors?branch=v2.x
[download-image]: https://img.shields.io/npm/dm/@koa/cors.svg?style=flat-square
[download-url]: https://npmjs.org/package/@koa/cors

[Cross-Origin Resource Sharing(CORS)](https://developer.mozilla.org/en/docs/Web/HTTP/Access_control_CORS) for koa

## Installation

```bash
$ npm install @koa/cors --save
```

## Quick start

Enable cors with default options:

- origin: request Origin header
- allowMethods: GET,HEAD,PUT,POST,DELETE,PATCH

```js
const Koa = require('koa');
const cors = require('@koa/cors');

const app = new Koa();
app.use(cors());
```

## cors(options)

```js
/**
 * CORS middleware
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is '*'
 *    If `credentials` set and return `true, the `origin` default value will set to the request `Origin` header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean|Function(ctx)} credentials `Access-Control-Allow-Credentials`, default is false.
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 *  - {Boolean} secureContext `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy` headers.', default is false
 *  - {Boolean} privateNetworkAccess handle `Access-Control-Request-Private-Network` request by return `Access-Control-Allow-Private-Network`, default to false
 * @return {Function} cors middleware
 * @api public
 */
```

## Breaking change between 5.0 and 4.0

The default `origin` is set to `*`, if you want to keep the 4.0 behavior, you can set the `origin` handler like this:

```js
app.use(cors({
  origin(ctx) {
    return ctx.get('Origin') || '*';
  },
}));
```

## License

[MIT](./LICENSE)

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/156269?v=4" width="100px;"/><br/><sub><b>fengmk2</b></sub>](https://github.com/fengmk2)<br/>|[<img src="https://avatars.githubusercontent.com/u/985607?v=4" width="100px;"/><br/><sub><b>dead-horse</b></sub>](https://github.com/dead-horse)<br/>|[<img src="https://avatars.githubusercontent.com/u/1127384?v=4" width="100px;"/><br/><sub><b>omsmith</b></sub>](https://github.com/omsmith)<br/>|[<img src="https://avatars.githubusercontent.com/u/643505?v=4" width="100px;"/><br/><sub><b>jonathanong</b></sub>](https://github.com/jonathanong)<br/>|[<img src="https://avatars.githubusercontent.com/u/5622516?v=4" width="100px;"/><br/><sub><b>AlphaWong</b></sub>](https://github.com/AlphaWong)<br/>|[<img src="https://avatars.githubusercontent.com/u/55783048?v=4" width="100px;"/><br/><sub><b>cma-skedulo</b></sub>](https://github.com/cma-skedulo)<br/>|
| :---: | :---: | :---: | :---: | :---: | :---: |
|[<img src="https://avatars.githubusercontent.com/u/6992588?v=4" width="100px;"/><br/><sub><b>CleberRossi</b></sub>](https://github.com/CleberRossi)<br/>|[<img src="https://avatars.githubusercontent.com/u/178720?v=4" width="100px;"/><br/><sub><b>erikfried</b></sub>](https://github.com/erikfried)<br/>|[<img src="https://avatars.githubusercontent.com/u/1217939?v=4" width="100px;"/><br/><sub><b>j-waaang</b></sub>](https://github.com/j-waaang)<br/>|[<img src="https://avatars.githubusercontent.com/u/4184677?v=4" width="100px;"/><br/><sub><b>ltomes</b></sub>](https://github.com/ltomes)<br/>|[<img src="https://avatars.githubusercontent.com/u/372420?v=4" width="100px;"/><br/><sub><b>lfreneda</b></sub>](https://github.com/lfreneda)<br/>|[<img src="https://avatars.githubusercontent.com/u/170299?v=4" width="100px;"/><br/><sub><b>matthewmueller</b></sub>](https://github.com/matthewmueller)<br/>|
[<img src="https://avatars.githubusercontent.com/u/6006498?v=4" width="100px;"/><br/><sub><b>PlasmaPower</b></sub>](https://github.com/PlasmaPower)<br/>|[<img src="https://avatars.githubusercontent.com/u/14932834?v=4" width="100px;"/><br/><sub><b>swain</b></sub>](https://github.com/swain)<br/>|[<img src="https://avatars.githubusercontent.com/u/49938086?v=4" width="100px;"/><br/><sub><b>TyrealHu</b></sub>](https://github.com/TyrealHu)<br/>|[<img src="https://avatars.githubusercontent.com/u/8369011?v=4" width="100px;"/><br/><sub><b>xg-wang</b></sub>](https://github.com/xg-wang)<br/>|[<img src="https://avatars.githubusercontent.com/u/12003270?v=4" width="100px;"/><br/><sub><b>lishengzxc</b></sub>](https://github.com/lishengzxc)<br/>|[<img src="https://avatars.githubusercontent.com/u/514097?v=4" width="100px;"/><br/><sub><b>mcohen75</b></sub>](https://github.com/mcohen75)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Sat Oct 08 2022 21:35:10 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->
