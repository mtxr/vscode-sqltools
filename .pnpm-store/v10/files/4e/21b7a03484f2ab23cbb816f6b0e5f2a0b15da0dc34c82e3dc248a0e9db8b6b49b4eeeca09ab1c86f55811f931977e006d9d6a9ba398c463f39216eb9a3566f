'use strict'

const path = require('path')
const spawn = require('child_process').spawn
const test = require('tap').test
const fs = require('fs')
const rimraf = require('rimraf')

const bin = require.resolve('../bin')
const logLine = '{"level":30,"time":1522431328992,"msg":"hello world","pid":42,"hostname":"foo"}\n'
const noop = () => {}

test('cli', (t) => {
  const tmpDir = path.join(__dirname, '.tmp_' + Date.now())
  fs.mkdirSync(tmpDir)

  t.tearDown(() => rimraf(tmpDir, noop))

  t.test('loads and applies default config file: pino-pretty.config.js', (t) => {
    t.plan(1)
    // Set translateTime: true on run configuration
    const configFile = path.join(tmpDir, 'pino-pretty.config.js')
    fs.writeFileSync(configFile, 'module.exports = { translateTime: true }')
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin], { env, cwd: tmpDir })
    // Validate that the time has been translated
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), '[2018-03-30 17:35:28.992 +0000] INFO (42 on foo): hello world\n')
    })
    child.stdin.write(logLine)
    t.tearDown(() => {
      fs.unlinkSync(configFile)
      child.kill()
    })
  })

  t.test('loads and applies default config file: .pino-prettyrc', (t) => {
    t.plan(1)
    // Set translateTime: true on run configuration
    const configFile = path.join(tmpDir, '.pino-prettyrc')
    fs.writeFileSync(configFile, JSON.stringify({ translateTime: true }, null, 4))
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin], { env, cwd: tmpDir })
    // Validate that the time has been translated
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), '[2018-03-30 17:35:28.992 +0000] INFO (42 on foo): hello world\n')
    })
    child.stdin.write(logLine)
    t.tearDown(() => {
      fs.unlinkSync(configFile)
      child.kill()
    })
  })

  t.test('loads and applies default config file: .pino-prettyrc.json', (t) => {
    t.plan(1)
    // Set translateTime: true on run configuration
    const configFile = path.join(tmpDir, '.pino-prettyrc.json')
    fs.writeFileSync(configFile, JSON.stringify({ translateTime: true }, null, 4))
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin], { env, cwd: tmpDir })
    // Validate that the time has been translated
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), '[2018-03-30 17:35:28.992 +0000] INFO (42 on foo): hello world\n')
    })
    child.stdin.write(logLine)
    t.tearDown(() => {
      fs.unlinkSync(configFile)
      child.kill()
    })
  })

  t.test('loads and applies custom config file: pino-pretty.config.test.json', (t) => {
    t.plan(1)
    // Set translateTime: true on run configuration
    const configFile = path.join(tmpDir, 'pino-pretty.config.test.json')
    fs.writeFileSync(configFile, JSON.stringify({ translateTime: true }, null, 4))
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin, '--config', configFile], { env, cwd: tmpDir })
    // Validate that the time has been translated
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), '[2018-03-30 17:35:28.992 +0000] INFO (42 on foo): hello world\n')
    })
    child.stdin.write(logLine)
    t.tearDown(() => child.kill())
  })

  t.test('loads and applies custom config file: pino-pretty.config.test.js', (t) => {
    t.plan(1)
    // Set translateTime: true on run configuration
    const configFile = path.join(tmpDir, 'pino-pretty.config.test.js')
    fs.writeFileSync(configFile, 'module.exports = { translateTime: true }')
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin, '--config', configFile], { env, cwd: tmpDir })
    // Validate that the time has been translated
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), '[2018-03-30 17:35:28.992 +0000] INFO (42 on foo): hello world\n')
    })
    child.stdin.write(logLine)
    t.tearDown(() => child.kill())
  })

  t.test('cli options override config options', (t) => {
    t.plan(1)
    // Set translateTime: true on run configuration
    const configFile = path.join(tmpDir, 'pino-pretty.config.js')
    fs.writeFileSync(configFile, `
      module.exports = {
        translateTime: true,
        messageKey: 'custom_msg'
      }
    `.trim())
    // Set messageKey: 'new_msg' using command line option
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin, '--messageKey', 'new_msg'], { env, cwd: tmpDir })
    // Validate that the time has been translated and correct message key has been used
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), '[2018-03-30 17:35:28.992 +0000] INFO (42 on foo): hello world\n')
    })
    child.stdin.write(logLine.replace(/"msg"/, '"new_msg"'))
    t.tearDown(() => {
      fs.unlinkSync(configFile)
      child.kill()
    })
  })

  t.test('cli options with defaults can be overridden by config', (t) => {
    t.plan(1)
    // Set errorProps: '*' on run configuration
    const configFile = path.join(tmpDir, 'pino-pretty.config.js')
    fs.writeFileSync(configFile, `
      module.exports = {
          errorProps: '*'
      }
    `.trim())
    // Set messageKey: 'new_msg' using command line option
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin], { env, cwd: tmpDir })
    // Validate that the time has been translated and correct message key has been used
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.is(data.toString(), '[1594416696006] FATAL: There was an error starting the process.\n    QueryError: Error during sql query: syntax error at or near SELECTT\n        at /home/me/projects/example/sql.js\n        at /home/me/projects/example/index.js\nquerySql: SELECTT * FROM "test" WHERE id = $1;\nqueryArgs: 12\n')
    })
    child.stdin.write('{"level":60,"time":1594416696006,"msg":"There was an error starting the process.","type":"Error","stack":"QueryError: Error during sql query: syntax error at or near SELECTT\\n    at /home/me/projects/example/sql.js\\n    at /home/me/projects/example/index.js","querySql":"SELECTT * FROM \\"test\\" WHERE id = $1;","queryArgs":[12]}\n')
    t.tearDown(() => {
      fs.unlinkSync(configFile)
      child.kill()
    })
  })

  t.test('throws on missing config file', (t) => {
    t.plan(2)
    const args = [bin, '--config', 'pino-pretty.config.missing.json']
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], args, { env, cwd: tmpDir })
    child.on('close', (code) => t.is(code, 1))
    child.stderr.on('data', (data) => {
      t.contains(data.toString(), 'Error: Failed to load runtime configuration file: pino-pretty.config.missing.json\n')
    })
    t.tearDown(() => child.kill())
  })

  t.test('throws on invalid default config file', (t) => {
    t.plan(2)
    const configFile = path.join(tmpDir, 'pino-pretty.config.js')
    fs.writeFileSync(configFile, 'module.exports = () => {}')
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], [bin], { env, cwd: tmpDir })
    child.on('close', (code) => t.is(code, 1))
    child.stderr.on('data', (data) => {
      t.contains(data.toString(), 'Error: Invalid runtime configuration file: pino-pretty.config.js\n')
    })
    t.tearDown(() => child.kill())
  })

  t.test('throws on invalid custom config file', (t) => {
    t.plan(2)
    const configFile = path.join(tmpDir, 'pino-pretty.config.invalid.js')
    fs.writeFileSync(configFile, 'module.exports = () => {}')
    const args = [bin, '--config', path.relative(tmpDir, configFile)]
    const env = { TERM: 'dumb' }
    const child = spawn(process.argv[0], args, { env, cwd: tmpDir })
    child.on('close', (code) => t.is(code, 1))
    child.stderr.on('data', (data) => {
      t.contains(data.toString(), 'Error: Invalid runtime configuration file: pino-pretty.config.invalid.js\n')
    })
    t.tearDown(() => child.kill())
  })

  t.end()
})
