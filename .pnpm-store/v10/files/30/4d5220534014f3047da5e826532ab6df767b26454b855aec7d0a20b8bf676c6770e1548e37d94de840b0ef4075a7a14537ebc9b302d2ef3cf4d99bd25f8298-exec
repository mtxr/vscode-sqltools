#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const TS_CONFIG_PATH = path.resolve('tsconfig.json')

const tsconfigDefaults = {
  "target": "es2018",
  "module": "commonjs",
  "lib" :[ "dom", "es2015", "es2017" ],
  "allowJs": true
}

const compilerOptions = (fs.existsSync(TS_CONFIG_PATH) 
  ? require(TS_CONFIG_PATH).compilerOptions:
  {}
)

delete compilerOptions.exclude
delete compilerOptions.include
delete compilerOptions.lib

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    ...compilerOptions,
    ...tsconfigDefaults,
    lib: [ 
      ...tsconfigDefaults.lib, 
      ...(compilerOptions && compilerOptions.lib 
            ? compilerOptions.lib: [])
    ]
  }
})

const pkg = require('../package.json')
require('../aria-build').run(pkg.version)