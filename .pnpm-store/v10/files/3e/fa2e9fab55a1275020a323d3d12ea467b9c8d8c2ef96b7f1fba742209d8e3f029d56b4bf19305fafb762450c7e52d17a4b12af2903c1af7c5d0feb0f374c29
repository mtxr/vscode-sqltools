'use strict'

const tap = require('tap')
const getColorizer = require('../../lib/colors')
const utils = require('../../lib/utils')

tap.test('prettifyErrorLog', t => {
  const { prettifyErrorLog } = utils

  t.test('returns string with default settings', async t => {
    const err = Error('Something went wrong')
    const str = prettifyErrorLog({ log: err })
    t.true(str.startsWith('    Error: Something went wrong'))
  })

  t.test('returns string with custom ident', async t => {
    const err = Error('Something went wrong')
    const str = prettifyErrorLog({ log: err, ident: '  ' })
    t.true(str.startsWith('  Error: Something went wrong'))
  })

  t.test('returns string with custom eol', async t => {
    const err = Error('Something went wrong')
    const str = prettifyErrorLog({ log: err, eol: '\r\n' })
    t.true(str.startsWith('    Error: Something went wrong\r\n'))
  })

  t.end()
})

tap.test('prettifyLevel', t => {
  const { prettifyLevel } = utils

  t.test('returns `undefined` for unknown level', async t => {
    const colorized = prettifyLevel({ log: {} })
    t.is(colorized, undefined)
  })

  t.test('returns non-colorized value for default colorizer', async t => {
    const log = {
      level: 30
    }
    const colorized = prettifyLevel({ log })
    t.is(colorized, 'INFO')
  })

  t.test('returns colorized value for color colorizer', async t => {
    const log = {
      level: 30
    }
    const colorizer = getColorizer(true)
    const colorized = prettifyLevel({ log, colorizer })
    t.is(colorized, '\u001B[32mINFO\u001B[39m')
  })

  t.end()
})

tap.test('prettifyMessage', t => {
  const { prettifyMessage } = utils

  t.test('returns `undefined` if `messageKey` not found', async t => {
    const str = prettifyMessage({ log: {} })
    t.is(str, undefined)
  })

  t.test('returns `undefined` if `messageKey` not string', async t => {
    const str = prettifyMessage({ log: { msg: {} } })
    t.is(str, undefined)
  })

  t.test('returns non-colorized value for default colorizer', async t => {
    const str = prettifyMessage({ log: { msg: 'foo' } })
    t.is(str, 'foo')
  })

  t.test('returns non-colorized value for alternate `messageKey`', async t => {
    const str = prettifyMessage({ log: { message: 'foo' }, messageKey: 'message' })
    t.is(str, 'foo')
  })

  t.test('returns colorized value for color colorizer', async t => {
    const colorizer = getColorizer(true)
    const str = prettifyMessage({ log: { msg: 'foo' }, colorizer })
    t.is(str, '\u001B[36mfoo\u001B[39m')
  })

  t.test('returns colorized value for color colorizer for alternate `messageKey`', async t => {
    const colorizer = getColorizer(true)
    const str = prettifyMessage({ log: { message: 'foo' }, messageKey: 'message', colorizer })
    t.is(str, '\u001B[36mfoo\u001B[39m')
  })

  t.test('returns message formatted by `messageFormat` option', async t => {
    const str = prettifyMessage({ log: { msg: 'foo', context: 'appModule' }, messageFormat: '{context} - {msg}' })
    t.is(str, 'appModule - foo')
  })

  t.test('returns message formatted by `messageFormat` option - missing prop', async t => {
    const str = prettifyMessage({ log: { context: 'appModule' }, messageFormat: '{context} - {msg}' })
    t.is(str, 'appModule - ')
  })

  t.test('returns message formatted by `messageFormat` option - levelLabel', async t => {
    const str = prettifyMessage({ log: { msg: 'foo', context: 'appModule', level: 30 }, messageFormat: '[{level}] {levelLabel} {context} - {msg}' })
    t.is(str, '[30] INFO appModule - foo')
  })

  t.test('`messageFormat` supports nested curly brackets', async t => {
    const str = prettifyMessage({ log: { level: 30 }, messageFormat: '{{level}}-{level}-{{level}-{level}}' })
    t.is(str, '{30}-30-{30-30}')
  })

  t.test('`messageFormat` supports nested object', async t => {
    const str = prettifyMessage({ log: { level: 30, request: { url: 'localhost/test' }, msg: 'foo' }, messageFormat: '{request.url} - param: {request.params.process} - {msg}' })
    t.is(str, 'localhost/test - param:  - foo')
  })

  t.test('`messageFormat` supports function definition', async t => {
    const str = prettifyMessage({
      log: { level: 30, request: { url: 'localhost/test' }, msg: 'incoming request' },
      messageFormat: (log, messageKey, levelLabel) => {
        let msg = log[messageKey]
        if (msg === 'incoming request') msg = `--> ${log.request.url}`
        return msg
      }
    })
    t.is(str, '--> localhost/test')
  })

  t.end()
})

tap.test('prettifyMetadata', t => {
  const { prettifyMetadata } = utils

  t.test('returns `undefined` if no metadata present', async t => {
    const str = prettifyMetadata({ log: {} })
    t.is(str, undefined)
  })

  t.test('works with only `name` present', async t => {
    const str = prettifyMetadata({ log: { name: 'foo' } })
    t.is(str, '(foo)')
  })

  t.test('works with only `pid` present', async t => {
    const str = prettifyMetadata({ log: { pid: '1234' } })
    t.is(str, '(1234)')
  })

  t.test('works with only `hostname` present', async t => {
    const str = prettifyMetadata({ log: { hostname: 'bar' } })
    t.is(str, '(on bar)')
  })

  t.test('works with only `name` & `pid` present', async t => {
    const str = prettifyMetadata({ log: { name: 'foo', pid: '1234' } })
    t.is(str, '(foo/1234)')
  })

  t.test('works with only `name` & `hostname` present', async t => {
    const str = prettifyMetadata({ log: { name: 'foo', hostname: 'bar' } })
    t.is(str, '(foo on bar)')
  })

  t.test('works with only `pid` & `hostname` present', async t => {
    const str = prettifyMetadata({ log: { pid: '1234', hostname: 'bar' } })
    t.is(str, '(1234 on bar)')
  })

  t.test('works with only `name`, `pid`, & `hostname` present', async t => {
    const str = prettifyMetadata({ log: { name: 'foo', pid: '1234', hostname: 'bar' } })
    t.is(str, '(foo/1234 on bar)')
  })

  t.test('works with only `name` & `caller` present', async t => {
    const str = prettifyMetadata({ log: { name: 'foo', caller: 'baz' } })
    t.is(str, '(foo) <baz>')
  })

  t.test('works with only `pid` & `caller` present', async t => {
    const str = prettifyMetadata({ log: { pid: '1234', caller: 'baz' } })
    t.is(str, '(1234) <baz>')
  })

  t.test('works with only `hostname` & `caller` present', async t => {
    const str = prettifyMetadata({ log: { hostname: 'bar', caller: 'baz' } })
    t.is(str, '(on bar) <baz>')
  })

  t.test('works with only `name`, `pid`, & `caller` present', async t => {
    const str = prettifyMetadata({ log: { name: 'foo', pid: '1234', caller: 'baz' } })
    t.is(str, '(foo/1234) <baz>')
  })

  t.test('works with only `name`, `hostname`, & `caller` present', async t => {
    const str = prettifyMetadata({ log: { name: 'foo', hostname: 'bar', caller: 'baz' } })
    t.is(str, '(foo on bar) <baz>')
  })

  t.test('works with only `caller` present', async t => {
    const str = prettifyMetadata({ log: { caller: 'baz' } })
    t.is(str, '<baz>')
  })

  t.test('works with only `pid`, `hostname`, & `caller` present', async t => {
    const str = prettifyMetadata({ log: { pid: '1234', hostname: 'bar', caller: 'baz' } })
    t.is(str, '(1234 on bar) <baz>')
  })

  t.test('works with all four present', async t => {
    const str = prettifyMetadata({ log: { name: 'foo', pid: '1234', hostname: 'bar', caller: 'baz' } })
    t.is(str, '(foo/1234 on bar) <baz>')
  })

  t.end()
})

tap.test('prettifyObject', t => {
  const { prettifyObject } = utils

  t.test('returns empty string if no properties present', async t => {
    const str = prettifyObject({ input: {} })
    t.is(str, '')
  })

  t.test('works with single level properties', async t => {
    const str = prettifyObject({ input: { foo: 'bar' } })
    t.is(str, '    foo: "bar"\n')
  })

  t.test('works with multiple level properties', async t => {
    const str = prettifyObject({ input: { foo: { bar: 'baz' } } })
    t.is(str, '    foo: {\n      "bar": "baz"\n    }\n')
  })

  t.test('skips specified keys', async t => {
    const str = prettifyObject({ input: { foo: 'bar', hello: 'world' }, skipKeys: ['foo'] })
    t.is(str, '    hello: "world"\n')
  })

  t.test('ignores predefined keys', async t => {
    const str = prettifyObject({ input: { foo: 'bar', pid: 12345 } })
    t.is(str, '    foo: "bar"\n')
  })

  t.test('works with error props', async t => {
    const err = Error('Something went wrong')
    const serializedError = {
      message: err.message,
      stack: err.stack
    }
    const str = prettifyObject({ input: { error: serializedError } })
    t.true(str.startsWith('    error:'))
    t.true(str.includes('     "message": "Something went wrong",'))
    t.true(str.includes('         Error: Something went wrong'))
  })

  t.end()
})

tap.test('prettifyTime', t => {
  const { prettifyTime } = utils

  t.test('returns `undefined` if `time` or `timestamp` not in log', async t => {
    const str = prettifyTime({ log: {} })
    t.is(str, undefined)
  })

  t.test('returns prettified formatted time from custom field', async t => {
    const log = { customtime: 1554642900000 }
    let str = prettifyTime({ log, translateFormat: true, timestampKey: 'customtime' })
    t.is(str, '[2019-04-07 13:15:00.000 +0000]')

    str = prettifyTime({ log, translateFormat: false, timestampKey: 'customtime' })
    t.is(str, '[1554642900000]')
  })

  t.test('returns prettified formatted time', async t => {
    let log = { time: 1554642900000 }
    let str = prettifyTime({ log, translateFormat: true })
    t.is(str, '[2019-04-07 13:15:00.000 +0000]')

    log = { timestamp: 1554642900000 }
    str = prettifyTime({ log, translateFormat: true })
    t.is(str, '[2019-04-07 13:15:00.000 +0000]')

    log = { time: '2019-04-07T09:15:00.000-04:00' }
    str = prettifyTime({ log, translateFormat: true })
    t.is(str, '[2019-04-07 13:15:00.000 +0000]')

    log = { timestamp: '2019-04-07T09:15:00.000-04:00' }
    str = prettifyTime({ log, translateFormat: true })
    t.is(str, '[2019-04-07 13:15:00.000 +0000]')

    log = { time: 1554642900000 }
    str = prettifyTime({ log, translateFormat: 'd mmm yyyy H:MM' })
    t.is(str, '[7 Apr 2019 13:15]')

    log = { timestamp: 1554642900000 }
    str = prettifyTime({ log, translateFormat: 'd mmm yyyy H:MM' })
    t.is(str, '[7 Apr 2019 13:15]')

    log = { time: '2019-04-07T09:15:00.000-04:00' }
    str = prettifyTime({ log, translateFormat: 'd mmm yyyy H:MM' })
    t.is(str, '[7 Apr 2019 13:15]')

    log = { timestamp: '2019-04-07T09:15:00.000-04:00' }
    str = prettifyTime({ log, translateFormat: 'd mmm yyyy H:MM' })
    t.is(str, '[7 Apr 2019 13:15]')
  })

  t.test('passes through value', async t => {
    let log = { time: 1554642900000 }
    let str = prettifyTime({ log })
    t.is(str, '[1554642900000]')

    log = { timestamp: 1554642900000 }
    str = prettifyTime({ log })
    t.is(str, '[1554642900000]')

    log = { time: '2019-04-07T09:15:00.000-04:00' }
    str = prettifyTime({ log })
    t.is(str, '[2019-04-07T09:15:00.000-04:00]')

    log = { timestamp: '2019-04-07T09:15:00.000-04:00' }
    str = prettifyTime({ log })
    t.is(str, '[2019-04-07T09:15:00.000-04:00]')
  })

  t.test('handles the 0 timestamp', async t => {
    let log = { time: 0 }
    let str = prettifyTime({ log })
    t.is(str, '[0]')

    log = { timestamp: 0 }
    str = prettifyTime({ log })
    t.is(str, '[0]')
  })

  t.end()
})

tap.test('#filterLog', t => {
  const { filterLog } = utils
  const logData = {
    level: 30,
    time: 1522431328992,
    data1: {
      data2: { 'data-3': 'bar' }
    }
  }

  t.test('filterLog removes single entry', async t => {
    const result = filterLog(logData, ['data1.data2.data-3'])
    t.same(result, { level: 30, time: 1522431328992, data1: { data2: { } } })
  })

  t.test('filterLog removes multiple entries', async t => {
    const result = filterLog(logData, ['time', 'data1'])
    t.same(result, { level: 30 })
  })

  t.end()
})
