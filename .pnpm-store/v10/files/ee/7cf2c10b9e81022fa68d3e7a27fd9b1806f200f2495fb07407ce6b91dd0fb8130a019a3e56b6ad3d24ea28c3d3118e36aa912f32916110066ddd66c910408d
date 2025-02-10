'use strict'

const path = require('path')
const spawn = require('child_process').spawn
const test = require('tap').test

const bin = require.resolve(path.join(__dirname, '..', 'bin.js'))
const epoch = 1522431328992
const logLine = '{"level":30,"time":1522431328992,"msg":"hello world","pid":42,"hostname":"foo"}\n'

test('cli', (t) => {
  t.test('does basic reformatting', (t) => {
    t.plan(1)
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin], { env })
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), `[${epoch}] INFO (42 on foo): hello world\n`)
    })
    child.stdin.write(logLine)
    t.tearDown(() => child.kill())
  })

  t.test('flips epoch and level', (t) => {
    t.plan(1)
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin, '-l'], { env })
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), `INFO [${epoch}] (42 on foo): hello world\n`)
    })
    child.stdin.write(logLine)
    t.tearDown(() => child.kill())
  })

  t.test('translates time to default format', (t) => {
    t.plan(1)
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin, '-t'], { env })
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), '[2018-03-30 17:35:28.992 +0000] INFO (42 on foo): hello world\n')
    })
    child.stdin.write(logLine)
    t.tearDown(() => child.kill())
  })

  t.test('does search', (t) => {
    t.plan(1)
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin, '-s', 'msg == `hello world`'], { env })
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), `[${epoch}] INFO (42 on foo): hello world\n`)
    })
    child.stdin.write(logLine)
    t.tearDown(() => child.kill())
  })

  t.test('does search but finds only 1 out of 2', (t) => {
    t.plan(1)
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin, '-s', 'msg == `hello world`'], { env })
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), `[${epoch}] INFO (42 on foo): hello world\n`)
    })
    child.stdin.write(logLine.replace('hello world', 'hello universe'))
    child.stdin.write(logLine)
    t.tearDown(() => child.kill())
  })

  t.test('does ignore multiple keys', (t) => {
    t.plan(1)
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin, '-i', 'pid,hostname'], { env })
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), '[1522431328992] INFO: hello world\n')
    })
    child.stdin.write(logLine)
    t.tearDown(() => child.kill())
  })

  t.test('passes through stringified date as string', (t) => {
    t.plan(1)
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin], { env })
    child.on('error', t.threw)

    const date = JSON.stringify(new Date(epoch))

    child.stdout.on('data', (data) => {
      t.is(data.toString(), date + '\n')
    })

    child.stdin.write(date)
    child.stdin.write('\n')

    t.tearDown(() => child.kill())
  })

  t.test('uses specified timestampKey', (t) => {
    t.plan(1)
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin, '--timestampKey', '@timestamp'], { env })
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), '[1522431328992] INFO: hello world\n')
    })
    const logLine = '{"level":30,"@timestamp":1522431328992,"msg":"hello world"}\n'
    child.stdin.write(logLine)
    t.tearDown(() => child.kill())
  })

  t.test('singleLine=true', (t) => {
    t.plan(1)

    const logLineWithExtra = JSON.stringify(Object.assign(JSON.parse(logLine), {
      extra: {
        foo: 'bar',
        number: 42
      }
    })) + '\n'

    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin, '--singleLine'], { env })
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), `[${epoch}] INFO (42 on foo): hello world {"extra":{"foo":"bar","number":42}}\n`)
    })
    child.stdin.write(logLineWithExtra)
    t.tearDown(() => child.kill())
  })

  t.test('does ignore nested keys', (t) => {
    t.plan(1)

    const logLineNested = JSON.stringify(Object.assign(JSON.parse(logLine), {
      extra: {
        foo: 'bar',
        number: 42,
        nested: {
          foo2: 'bar2'
        }
      }
    })) + '\n'

    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin, '-S', '-i', 'extra.foo,extra.nested,extra.nested.miss'], { env })
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), `[${epoch}] INFO (42 on foo): hello world {"extra":{"number":42}}\n`)
    })
    child.stdin.write(logLineNested)
    t.tearDown(() => child.kill())
  })

  t.end()
})
