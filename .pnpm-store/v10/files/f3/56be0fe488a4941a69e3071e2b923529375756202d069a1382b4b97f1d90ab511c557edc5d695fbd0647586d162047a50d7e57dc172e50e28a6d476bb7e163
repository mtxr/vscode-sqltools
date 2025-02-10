
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
const errors = require('http-errors')
const zlib = require('zlib')

class Encodings {
  constructor (options = {}) {
    this.wildcardAcceptEncoding = options.wildcardAcceptEncoding || Encodings.wildcardAcceptEncoding
    this.preferredEncodings = options.preferredEncodings || Encodings.preferredEncodings
    this.reDirective = options.reDirective || Encodings.reDirective

    this.encodingWeights = new Map()
  }

  parseAcceptEncoding (acceptEncoding = '*') {
    const { encodingWeights, reDirective } = this

    acceptEncoding.split(',').forEach((directive) => {
      const match = reDirective.exec(directive)
      if (!match) return // not a supported encoding above

      const encoding = match[1]

      // weight must be in [0, 1]
      let weight = match[2] && !isNaN(match[2]) ? parseFloat(match[2], 10) : 1
      weight = Math.max(weight, 0)
      weight = Math.min(weight, 1)

      if (encoding === '*') {
        // set the weights for the default encodings
        this.wildcardAcceptEncoding.forEach((enc) => {
          if (!encodingWeights.has(enc)) encodingWeights.set(enc, weight)
        })
        return
      }

      encodingWeights.set(encoding, weight)
    })
  }

  getPreferredContentEncoding () {
    const {
      encodingWeights,
      preferredEncodings
    } = this

    // get ordered list of accepted encodings
    const acceptedEncodings = Array.from(encodingWeights.keys())
      // sort by weight
      .sort((a, b) => encodingWeights.get(b) - encodingWeights.get(a))
      // filter by supported encodings
      .filter((encoding) => encoding === 'identity' || typeof Encodings.encodingMethods[encoding] === 'function')

    // group them by weights
    const weightClasses = new Map()
    acceptedEncodings.forEach((encoding) => {
      const weight = encodingWeights.get(encoding)
      if (!weightClasses.has(weight)) weightClasses.set(weight, new Set())
      weightClasses.get(weight).add(encoding)
    })

    // search by weight, descending
    const weights = Array.from(weightClasses.keys()).sort((a, b) => b - a)
    for (let i = 0; i < weights.length; i++) {
      // encodings at this weight
      const encodings = weightClasses.get(weights[i])
      // return the first encoding in the preferred list
      for (let j = 0; j < preferredEncodings.length; j++) {
        const preferredEncoding = preferredEncodings[j]
        if (encodings.has(preferredEncoding)) return preferredEncoding
      }
    }

    // no encoding matches, check to see if the client set identity, q=0
    if (encodingWeights.get('identity') === 0) throw errors(406, 'Please accept br, gzip, deflate, or identity.')

    // by default, return nothing
    return 'identity'
  }
}

Encodings.encodingMethods = {
  gzip: zlib.createGzip,
  deflate: zlib.createDeflate,
  br: zlib.createBrotliCompress
}

Encodings.encodingMethodDefaultOptions = {
  gzip: {},
  deflate: {},
  br: {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 4
    }
  }
}

// how we treat `Accept-Encoding: *`
Encodings.wildcardAcceptEncoding = ['gzip', 'deflate']
// our preferred encodings
Encodings.preferredEncodings = ['br', 'gzip', 'deflate']
Encodings.reDirective = /^\s*(gzip|compress|deflate|br|identity|\*)\s*(?:;\s*q\s*=\s*(\d(?:\.\d)?))?\s*$/

module.exports = Encodings
