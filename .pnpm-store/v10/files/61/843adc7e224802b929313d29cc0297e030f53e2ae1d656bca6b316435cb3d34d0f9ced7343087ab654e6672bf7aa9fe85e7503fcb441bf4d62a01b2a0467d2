'use strict'

const { Writable } = require('readable-stream')
const os = require('os')
const test = require('tap').test
const pino = require('pino')
const dateformat = require('dateformat')
const _prettyFactory = require('../')

function prettyFactory (opts) {
  if (!opts) {
    opts = { colorize: false }
  } else if (!Object.prototype.hasOwnProperty.call(opts, 'colorize')) {
    opts.colorize = false
  }
  return _prettyFactory(opts)
}

// All dates are computed from 'Fri, 30 Mar 2018 17:35:28 GMT'
const epoch = 1522431328992
const pid = process.pid
const hostname = os.hostname()

test('basic prettifier tests', (t) => {
  t.beforeEach((done) => {
    Date.originalNow = Date.now
    Date.now = () => epoch

    done()
  })
  t.afterEach((done) => {
    Date.now = Date.originalNow
    delete Date.originalNow
    done()
  })

  t.test('preserves output if not valid JSON', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const formatted = pretty('this is not json\nit\'s just regular output\n')
    t.is(formatted, 'this is not json\nit\'s just regular output\n\n')
  })

  t.test('formats a line without any extra options', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(
          formatted,
          `[${epoch}] INFO (${pid} on ${hostname}): foo\n`
        )
        cb()
      }
    }))
    log.info('foo')
  })

  t.test('will add color codes', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ colorize: true })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(
          formatted,
          `[${epoch}] \u001B[32mINFO\u001B[39m (${pid} on ${hostname}): \u001B[36mfoo\u001B[39m\n`
        )
        cb()
      }
    }))
    log.info('foo')
  })

  t.test('can swap date and level position', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ levelFirst: true })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(
          formatted,
          `INFO [${epoch}] (${pid} on ${hostname}): foo\n`
        )
        cb()
      }
    }))
    log.info('foo')
  })

  t.test('can use different message keys', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ messageKey: 'bar' })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(
          formatted,
          `[${epoch}] INFO (${pid} on ${hostname}): baz\n`
        )
        cb()
      }
    }))
    log.info({ bar: 'baz' })
  })

  t.test('can use different level keys', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ levelKey: 'bar' })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(
          formatted,
          `[${epoch}] WARN (${pid} on ${hostname}): foo\n`
        )
        cb()
      }
    }))
    log.info({ msg: 'foo', bar: 'warn' })
  })

  t.test('will format time to UTC', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ translateTime: true })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(
          formatted,
          `[2018-03-30 17:35:28.992 +0000] INFO (${pid} on ${hostname}): foo\n`
        )
        cb()
      }
    }))
    log.info('foo')
  })

  t.test('will format time to UTC in custom format', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ translateTime: 'HH:MM:ss o' })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        const utcHour = dateformat(epoch, 'UTC:' + 'HH')
        const offset = dateformat(epoch, 'UTC:' + 'o')
        t.is(
          formatted,
          `[${utcHour}:35:28 ${offset}] INFO (${pid} on ${hostname}): foo\n`
        )
        cb()
      }
    }))
    log.info('foo')
  })

  t.test('will format time to local systemzone in ISO 8601 format', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ translateTime: 'sys:standard' })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        const localHour = dateformat(epoch, 'HH')
        const localDate = dateformat(epoch, 'yyyy-mm-dd')
        const offset = dateformat(epoch, 'o')
        t.is(
          formatted,
          `[${localDate} ${localHour}:35:28.992 ${offset}] INFO (${pid} on ${hostname}): foo\n`
        )
        cb()
      }
    }))
    log.info('foo')
  })

  t.test('will format time to local systemzone in custom format', (t) => {
    t.plan(1)
    const pretty = prettyFactory({
      translateTime: 'SYS:yyyy/mm/dd HH:MM:ss o'
    })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        const localHour = dateformat(epoch, 'HH')
        const localDate = dateformat(epoch, 'yyyy/mm/dd')
        const offset = dateformat(epoch, 'o')
        t.is(
          formatted,
          `[${localDate} ${localHour}:35:28 ${offset}] INFO (${pid} on ${hostname}): foo\n`
        )
        cb()
      }
    }))
    log.info('foo')
  })

  // TODO: 2019-03-30 -- We don't really want the indentation in this case? Or at least some better formatting.
  t.test('handles missing time', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const formatted = pretty('{"hello":"world"}')
    t.is(formatted, '    hello: "world"\n')
  })

  t.test('handles missing pid, hostname and name', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const log = pino({ base: null }, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.match(formatted, /\[.*\] INFO: hello world/)
        cb()
      }
    }))
    log.info('hello world')
  })

  t.test('handles missing pid', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const name = 'test'
    const msg = 'hello world'
    const regex = new RegExp('\\[.*\\] INFO \\(' + name + ' on ' + hostname + '\\): ' + msg)

    const opts = {
      base: {
        name: name,
        hostname: hostname
      }
    }
    const log = pino(opts, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.match(formatted, regex)
        cb()
      }
    }))

    log.info(msg)
  })

  t.test('handles missing hostname', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const name = 'test'
    const msg = 'hello world'
    const regex = new RegExp('\\[.*\\] INFO \\(' + name + '/' + pid + '\\): ' + msg)

    const opts = {
      base: {
        name: name,
        pid: process.pid
      }
    }
    const log = pino(opts, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.match(formatted, regex)
        cb()
      }
    }))

    log.info(msg)
  })

  t.test('handles missing name', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const msg = 'hello world'
    const regex = new RegExp('\\[.*\\] INFO \\(' + process.pid + ' on ' + hostname + '\\): ' + msg)

    const opts = {
      base: {
        hostname: hostname,
        pid: process.pid
      }
    }
    const log = pino(opts, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.match(formatted, regex)
        cb()
      }
    }))

    log.info(msg)
  })

  t.test('works without time', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const log = pino({ timestamp: null }, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(formatted, `INFO (${pid} on ${hostname}): hello world\n`)
        cb()
      }
    }))
    log.info('hello world')
  })

  t.test('prettifies properties', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.match(formatted, '    a: "b"')
        cb()
      }
    }))
    log.info({ a: 'b' }, 'hello world')
  })

  t.test('prettifies nested properties', (t) => {
    t.plan(6)
    const expectedLines = [
      '    a: {',
      '      "b": {',
      '        "c": "d"',
      '      }',
      '    }'
    ]
    const pretty = prettyFactory()
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        const lines = formatted.split('\n')
        t.is(lines.length, expectedLines.length + 2)
        lines.shift(); lines.pop()
        for (let i = 0; i < lines.length; i += 1) {
          t.is(lines[i], expectedLines[i])
        }
        cb()
      }
    }))
    log.info({ a: { b: { c: 'd' } } }, 'hello world')
  })

  t.test('treats the name with care', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const log = pino({ name: 'matteo' }, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(formatted, `[${epoch}] INFO (matteo/${pid} on ${hostname}): hello world\n`)
        cb()
      }
    }))
    log.info('hello world')
  })

  t.test('handles spec allowed primitives', (t) => {
    const pretty = prettyFactory()
    let formatted = pretty(null)
    t.is(formatted, 'null\n')

    formatted = pretty(true)
    t.is(formatted, 'true\n')

    formatted = pretty(false)
    t.is(formatted, 'false\n')

    t.end()
  })

  t.test('handles numbers', (t) => {
    const pretty = prettyFactory()
    let formatted = pretty(2)
    t.is(formatted, '2\n')

    formatted = pretty(-2)
    t.is(formatted, '-2\n')

    formatted = pretty(0.2)
    t.is(formatted, '0.2\n')

    formatted = pretty(Infinity)
    t.is(formatted, 'Infinity\n')

    formatted = pretty(NaN)
    t.is(formatted, 'NaN\n')

    t.end()
  })

  t.test('handles `undefined` input', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const formatted = pretty(undefined)
    t.is(formatted, 'undefined\n')
  })

  t.test('handles customLogLevel', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const log = pino({ customLevels: { testCustom: 35 } }, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.match(formatted, /USERLVL/)
        cb()
      }
    }))
    log.testCustom('test message')
  })

  t.test('supports pino metadata API', (t) => {
    t.plan(1)
    const dest = new Writable({
      write (chunk, enc, cb) {
        t.is(
          chunk.toString(),
          `[${epoch}] INFO (${pid} on ${hostname}): foo\n`
        )
        cb()
      }
    })
    const log = pino({
      prettifier: prettyFactory,
      prettyPrint: true
    }, dest)
    log.info('foo')
  })

  t.test('can swap date and level position through meta stream', (t) => {
    t.plan(1)

    const dest = new Writable({
      objectMode: true,
      write (formatted, enc, cb) {
        t.is(
          formatted,
          `INFO [${epoch}] (${pid} on ${hostname}): foo\n`
        )
        cb()
      }
    })
    const log = pino({
      prettifier: prettyFactory,
      prettyPrint: {
        levelFirst: true
      }
    }, dest)
    log.info('foo')
  })

  t.test('filter some lines based on jmespath', (t) => {
    t.plan(3)
    const pretty = prettyFactory({ search: 'foo.bar' })
    const expected = [
      undefined,
      undefined,
      `[${epoch}] INFO (${pid} on ${hostname}): foo\n    foo: {\n      "bar": true\n    }\n`
    ]
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(
          formatted,
          expected.shift()
        )
        cb()
      }
    }))
    log.info('foo')
    log.info({ something: 'else' }, 'foo')
    // only this line will be formatted
    log.info({ foo: { bar: true } }, 'foo')
  })

  t.test('handles `undefined` return values', (t) => {
    t.plan(2)
    const pretty = prettyFactory({ search: 'msg == \'hello world\'' })
    let formatted = pretty(`{"msg":"nope", "time":${epoch}, "level":30}`)
    t.is(formatted, undefined)
    formatted = pretty(`{"msg":"hello world", "time":${epoch}, "level":30}`)
    t.is(formatted, `[${epoch}] INFO: hello world\n`)
  })

  t.test('formats a line with an undefined field', (t) => {
    t.plan(1)
    const pretty = prettyFactory()
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const obj = JSON.parse(chunk.toString())
        // weird hack, but we should not crash
        obj.a = undefined
        const formatted = pretty(obj)
        t.is(
          formatted,
          `[${epoch}] INFO (${pid} on ${hostname}): foo\n`
        )
        cb()
      }
    }))
    log.info('foo')
  })

  t.test('prettifies msg object', (t) => {
    t.plan(6)
    const expectedLines = [
      '    msg: {',
      '      "b": {',
      '        "c": "d"',
      '      }',
      '    }'
    ]
    const pretty = prettyFactory()
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        const lines = formatted.split('\n')
        t.is(lines.length, expectedLines.length + 2)
        lines.shift(); lines.pop()
        for (let i = 0; i < lines.length; i += 1) {
          t.is(lines[i], expectedLines[i])
        }
        cb()
      }
    }))
    log.info({ msg: { b: { c: 'd' } } })
  })

  t.test('prettifies msg object with circular references', (t) => {
    t.plan(7)
    const expectedLines = [
      '    msg: {',
      '      "b": {',
      '        "c": "d"',
      '      },',
      '      "a": "[Circular]"',
      '    }'
    ]
    const pretty = prettyFactory()
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        const lines = formatted.split('\n')
        t.is(lines.length, expectedLines.length + 2)
        lines.shift(); lines.pop()
        for (let i = 0; i < lines.length; i += 1) {
          t.is(lines[i], expectedLines[i])
        }
        cb()
      }
    }))

    const msg = { b: { c: 'd' } }
    msg.a = msg
    log.info({ msg })
  })

  t.test('prettifies custom key', (t) => {
    t.plan(1)
    const pretty = prettyFactory({
      customPrettifiers: {
        foo: val => `${val}_baz\nmultiline`,
        cow: val => val.toUpperCase()
      }
    })
    const arst = pretty('{"msg":"hello world", "foo": "bar", "cow": "moo", "level":30}')
    t.is(arst, 'INFO: hello world\n    foo: bar_baz\n    multiline\n    cow: MOO\n')
  })

  t.test('does not prettify custom key that does not exists', (t) => {
    t.plan(1)
    const pretty = prettyFactory({
      customPrettifiers: {
        foo: val => `${val}_baz`,
        cow: val => val.toUpperCase()
      }
    })
    const arst = pretty('{"msg":"hello world", "foo": "bar", "level":30}')
    t.is(arst, 'INFO: hello world\n    foo: bar_baz\n')
  })

  t.test('prettifies object with some undefined values', (t) => {
    t.plan(1)
    const dest = new Writable({
      write (chunk, _, cb) {
        t.is(
          chunk + '',
          `[${epoch}] INFO (${pid} on ${hostname}):\n    a: {\n      "b": "c"\n    }\n    n: null\n`
        )
        cb()
      }
    })
    const log = pino({
      prettifier: prettyFactory,
      prettyPrint: true
    }, dest)
    log.info({
      a: { b: 'c' },
      s: Symbol.for('s'),
      f: f => f,
      c: class C {},
      n: null,
      err: { toJSON () {} }
    })
  })

  t.test('ignores multiple keys', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ ignore: 'pid,hostname' })
    const arst = pretty(`{"msg":"hello world", "pid":"${pid}", "hostname":"${hostname}", "time":${epoch}, "level":30}`)
    t.is(arst, `[${epoch}] INFO: hello world\n`)
  })

  t.test('ignores a single key', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ ignore: 'pid' })
    const arst = pretty(`{"msg":"hello world", "pid":"${pid}", "hostname":"${hostname}", "time":${epoch}, "level":30}`)
    t.is(arst, `[${epoch}] INFO (on ${hostname}): hello world\n`)
  })

  t.test('ignores time', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ ignore: 'time' })
    const arst = pretty(`{"msg":"hello world", "pid":"${pid}", "hostname":"${hostname}", "time":${epoch}, "level":30}`)
    t.is(arst, `INFO (${pid} on ${hostname}): hello world\n`)
  })

  t.test('ignores time and level', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ ignore: 'time,level' })
    const arst = pretty(`{"msg":"hello world", "pid":"${pid}", "hostname":"${hostname}", "time":${epoch}, "level":30}`)
    t.is(arst, `(${pid} on ${hostname}): hello world\n`)
  })

  t.test('ignores all keys but message', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ ignore: 'time,level,name,pid,hostname' })
    const arst = pretty(`{"msg":"hello world", "pid":"${pid}", "hostname":"${hostname}", "time":${epoch}, "level":30}`)
    t.is(arst, 'hello world\n')
  })

  t.test('prettifies trace caller', (t) => {
    t.plan(1)
    const traceCaller = (instance) => {
      const { symbols: { asJsonSym } } = pino
      const get = (target, name) => name === asJsonSym ? asJson : target[name]

      function asJson (...args) {
        args[0] = args[0] || {}
        args[0].caller = '/tmp/script.js'
        return instance[asJsonSym].apply(this, args)
      }

      return new Proxy(instance, { get })
    }

    const pretty = prettyFactory()
    const log = traceCaller(pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(
          formatted,
          `[${epoch}] INFO (${pid} on ${hostname}) </tmp/script.js>: foo\n`
        )
        cb()
      }
    })))
    log.info('foo')
  })

  t.test('handles specified timestampKey', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ timestampKey: '@timestamp' })
    const arst = pretty(`{"msg":"hello world", "@timestamp":${epoch}, "level":30}`)
    t.is(arst, `[${epoch}] INFO: hello world\n`)
  })

  t.test('keeps "v" key in log', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ ignore: 'time' })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(formatted, `INFO (${pid} on ${hostname}):\n    v: 1\n`)
        cb()
      }
    }))
    log.info({ v: 1 })
  })

  t.test('Hide object `{ key: "value" }` from output when flag `hideObject` is set', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ hideObject: true })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(formatted, `[${epoch}] INFO (${pid} on ${hostname}): hello world\n`)
        cb()
      }
    }))
    log.info({ key: 'value' }, 'hello world')
  })

  t.test('Prints extra objects on one line with singleLine=true', (t) => {
    t.plan(1)
    const pretty = prettyFactory({
      singleLine: true,
      colorize: false,
      customPrettifiers: {
        upper: val => val.toUpperCase(),
        undef: () => undefined
      }
    })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(formatted, `[${epoch}] INFO (${pid} on ${hostname}): message {"extra":{"foo":"bar","number":42},"upper":"FOOBAR"}\n`)

        cb()
      }
    }))
    log.info({ msg: 'message', extra: { foo: 'bar', number: 42 }, upper: 'foobar', undef: 'this will not show up' })
  })

  t.test('Does not print empty object with singleLine=true', (t) => {
    t.plan(1)
    const pretty = prettyFactory({ singleLine: true, colorize: false })
    const log = pino({}, new Writable({
      write (chunk, enc, cb) {
        const formatted = pretty(chunk.toString())
        t.is(formatted, `[${epoch}] INFO (${pid} on ${hostname}): message\n`)
        cb()
      }
    }))
    log.info({ msg: 'message' })
  })

  t.end()
})
