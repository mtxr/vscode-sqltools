"use strict"

const fs = require("fs")
const path = require("path")
const run = require("test262-parser-runner")
const acorn = require("acorn")
const stage3 = require(".")
const Parser = acorn.Parser.extend(stage3)

const unsupportedFeatures = [
]

run(
  (content, options) => Parser.parse(content, {sourceType: options.sourceType, ecmaVersion: 12, allowHashBang: true, allowAwaitOutsideFunction: true}),
  {
    testsDirectory: path.dirname(require.resolve("test262/package.json")),
    skip: test => (test.attrs.features && unsupportedFeatures.some(f => test.attrs.features.includes(f))),
    whitelist: fs.readFileSync("./test262.whitelist", "utf8").split("\n").filter(v => v && v[0] !== "#")
  }
)
