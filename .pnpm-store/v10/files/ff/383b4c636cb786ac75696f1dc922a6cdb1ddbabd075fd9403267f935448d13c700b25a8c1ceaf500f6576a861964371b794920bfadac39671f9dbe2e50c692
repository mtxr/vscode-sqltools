'use strict'

/**
 * Module dependencies.
 */

const compressible = require('compressible')
const isJSON = require('koa-is-json')
const Stream = require('stream')
const bytes = require('bytes')

const Encodings = require('./encodings')

/**
* Regex to match no-transform directive in a cache-control header
*/
const NO_TRANSFORM_REGEX = /(?:^|,)\s*?no-transform\s*?(?:,|$)/

/**
 * empty body statues.
 */
const emptyBodyStatues = new Set([204, 205, 304])

/**
 * Compress middleware.
 *
 * @param {Object} [options]
 * @return {Function}
 * @api public
 */

module.exports = (options = {}) => {
  let { filter = compressible, threshold = 1024, defaultEncoding = 'identity' } = options
  if (typeof threshold === 'string') threshold = bytes(threshold)

  // `options.br = false` would remove it as a preferred encoding
  const preferredEncodings = Encodings.preferredEncodings.filter((encoding) => options[encoding] !== false && options[encoding] !== null)
  const encodingOptions = {}
  preferredEncodings.forEach((encoding) => {
    encodingOptions[encoding] = {
      ...Encodings.encodingMethodDefaultOptions[encoding],
      ...(options[encoding] || {})
    }
  })

  Object.assign(compressMiddleware, {
    preferredEncodings,
    encodingOptions
  })

  return compressMiddleware

  async function compressMiddleware (ctx, next) {
    ctx.vary('Accept-Encoding')

    await next()

    let { body } = ctx
    if (
      // early exit if there's no content body or the body is already encoded
      !body ||
      ctx.res.headersSent || !ctx.writable ||
      ctx.compress === false ||
      ctx.request.method === 'HEAD' ||
      emptyBodyStatues.has(+ctx.response.status) ||
      ctx.response.get('Content-Encoding') ||
      // forced compression or implied
      !(ctx.compress === true || filter(ctx.response.type)) ||
      // don't compress for Cache-Control: no-transform
      // https://tools.ietf.org/html/rfc7234#section-5.2.1.6
      NO_TRANSFORM_REGEX.test(ctx.response.get('Cache-Control')) ||
      // don't compress if the current response is below the threshold
      (threshold && ctx.response.length < threshold)
    ) return

    // get the preferred content encoding
    const encodings = new Encodings({ preferredEncodings })
    encodings.parseAcceptEncoding(ctx.request.headers['accept-encoding'] || defaultEncoding)
    const encoding = encodings.getPreferredContentEncoding()

    // identity === no compression
    if (encoding === 'identity') return

    /** begin compression logic **/

    // json
    if (isJSON(body)) body = ctx.body = JSON.stringify(body)

    ctx.set('Content-Encoding', encoding)
    ctx.res.removeHeader('Content-Length')

    const compress = Encodings.encodingMethods[encoding]
    const stream = ctx.body = compress(encodingOptions[encoding])

    if (body instanceof Stream) return body.pipe(stream)
    stream.end(body)
  }
}
