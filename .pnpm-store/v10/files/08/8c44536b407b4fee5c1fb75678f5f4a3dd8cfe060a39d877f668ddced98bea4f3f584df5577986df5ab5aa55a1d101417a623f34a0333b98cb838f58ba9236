'use strict'

const tap = require('tap')
const clone = require('rfdc')()
const stringifySafe = require('fast-safe-stringify')
const { internals } = require('../../lib/utils')

tap.test('#joinLinesWithIndentation', t => {
  t.test('joinLinesWithIndentation adds indentation to beginning of subsequent lines', async t => {
    const input = 'foo\nbar\nbaz'
    const result = internals.joinLinesWithIndentation({ input })
    t.is(result, 'foo\n    bar\n    baz')
  })

  t.test('joinLinesWithIndentation accepts custom indentation, line breaks, and eol', async t => {
    const input = 'foo\nbar\r\nbaz'
    const result = internals.joinLinesWithIndentation({ input, ident: '  ', eol: '^' })
    t.is(result, 'foo^  bar^  baz')
  })

  t.end()
})

tap.test('#formatTime', t => {
  const dateStr = '2019-04-06T13:30:00.000-04:00'
  const epoch = new Date(dateStr)
  const epochMS = epoch.getTime()

  t.test('passes through epoch if `translateTime` is `false`', async t => {
    const formattedTime = internals.formatTime(epochMS)
    t.is(formattedTime, epochMS)
  })

  t.test('translates epoch milliseconds if `translateTime` is `true`', async t => {
    const formattedTime = internals.formatTime(epochMS, true)
    t.is(formattedTime, '2019-04-06 17:30:00.000 +0000')
  })

  t.test('translates epoch milliseconds to UTC string given format', async t => {
    const formattedTime = internals.formatTime(epochMS, 'd mmm yyyy H:MM')
    t.is(formattedTime, '6 Apr 2019 17:30')
  })

  t.test('translates epoch milliseconds to SYS:STANDARD', async t => {
    const formattedTime = internals.formatTime(epochMS, 'SYS:STANDARD')
    t.match(formattedTime, /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} [-+]?\d{4}/)
  })

  t.test('translates epoch milliseconds to SYS:<FORMAT>', async t => {
    const formattedTime = internals.formatTime(epochMS, 'SYS:d mmm yyyy H:MM')
    t.match(formattedTime, /\d{1} \w{3} \d{4} \d{1,2}:\d{2}/)
  })

  t.test('passes through date string if `translateTime` is `false`', async t => {
    const formattedTime = internals.formatTime(dateStr)
    t.is(formattedTime, dateStr)
  })

  t.test('translates date string if `translateTime` is `true`', async t => {
    const formattedTime = internals.formatTime(dateStr, true)
    t.is(formattedTime, '2019-04-06 17:30:00.000 +0000')
  })

  t.test('translates date string to UTC string given format', async t => {
    const formattedTime = internals.formatTime(dateStr, 'd mmm yyyy H:MM')
    t.is(formattedTime, '6 Apr 2019 17:30')
  })

  t.test('translates date string to SYS:STANDARD', async t => {
    const formattedTime = internals.formatTime(dateStr, 'SYS:STANDARD')
    t.match(formattedTime, /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} [-+]?\d{4}/)
  })

  t.test('translates date string to UTC:<FORMAT>', async t => {
    const formattedTime = internals.formatTime(dateStr, 'UTC:d mmm yyyy H:MM')
    t.is(formattedTime, '6 Apr 2019 17:30')
  })

  t.test('translates date string to SYS:<FORMAT>', async t => {
    const formattedTime = internals.formatTime(dateStr, 'SYS:d mmm yyyy H:MM')
    t.match(formattedTime, /\d{1} \w{3} \d{4} \d{1,2}:\d{2}/)
  })

  t.end()
})

tap.test('#prettifyError', t => {
  t.test('prettifies error', t => {
    const error = Error('Bad error!')
    const lines = stringifySafe(error, Object.getOwnPropertyNames(error), 2)

    const prettyError = internals.prettifyError({ keyName: 'errorKey', lines, ident: '    ', eol: '\n' })
    t.match(prettyError, /\s*errorKey: {\n\s*"stack":[\s\S]*"message": "Bad error!"/)
    t.end()
  })

  t.end()
})

tap.test('#deleteLogProperty', t => {
  const logData = {
    level: 30,
    data1: {
      data2: { 'data-3': 'bar' }
    }
  }

  t.test('deleteLogProperty deletes property of depth 1', async t => {
    const log = clone(logData)
    internals.deleteLogProperty(log, 'data1')
    t.same(log, { level: 30 })
  })

  t.test('deleteLogProperty deletes property of depth 2', async t => {
    const log = clone(logData)
    internals.deleteLogProperty(log, 'data1.data2')
    t.same(log, { level: 30, data1: { } })
  })

  t.test('deleteLogProperty deletes property of depth 3', async t => {
    const log = clone(logData)
    internals.deleteLogProperty(log, 'data1.data2.data-3')
    t.same(log, { level: 30, data1: { data2: { } } })
  })

  t.end()
})
