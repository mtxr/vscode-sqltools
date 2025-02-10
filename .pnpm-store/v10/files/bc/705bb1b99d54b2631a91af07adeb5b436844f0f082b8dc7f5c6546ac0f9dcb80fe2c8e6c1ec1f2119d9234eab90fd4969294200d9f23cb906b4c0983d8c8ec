[![Coverage Status](https://coveralls.io/repos/github/aelbore/aria-build/badge.svg?branch=master&service=github)](https://coveralls.io/github/aelbore/aria-build?branch=master)
[![Build Status](https://travis-ci.org/aelbore/aria-build.svg?branch=master)](https://travis-ci.org/aelbore/aria-build)
[![npm version](https://badge.fury.io/js/aria-build.svg)](https://www.npmjs.com/package/aria-build)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# aria-build
Zero configuration CLI bundler or packager for typescript and javascript

Installation
------------
  ```
    npm install --save-dev aria-build aria-fs
  ```

### Usage
```
aria-build -d -f es --compress
```

### CLI Options
```
  Usage
    $ aria-build [options]

  For more info, run any command with the `--help` flag
    $ aria-build --help

  Options
    -d, --declaration    Generates corresponding .d.ts file  (default false)
    -f, --format         build specified formats  (default es,cjs)
    -i, --entry          Entry module(s)
    -o, --output         Directory to place build files into  (default dist)
    -c, --config         config file of aria-build. i.e aria.config.ts
    --swc                Enabled swc plugin to transform ts,js,jsx,tsx
    --esbuild            Enabled esbuild plugin to use transform ts,js,jsx,tsx
    --external           Specify external dependencies
    --resolve            Resolve dependencies
    --clean              Clean the dist folder default  (default dist)
    --globals            Specify globals dependencies
    --sourcemap          Generate source map  (default false)
    --name               Specify name exposed in UMD builds
    --compress           Compress or minify the output  (default false)
    -v, --version        Displays current version
    -h, --help           Displays this message
```

### API Setup
```javascript
import { bundle, TSRollupConfig, clean } from 'aria-build'

(async function() {
  const pkg = require('./package.json')

  const external = [
    ...Object.keys(pkg.dependencies)
  ]

  const config: TSRollupConfig = {
    input: './src/index.ts',
    external,
    output: [
      {
        file: './dist/aria-build.es.js',
        format: 'es'
      },
      {
        file: './dist/aria-build.js',
        format: 'cjs'
      }
    ],
    tsconfig: {
      compilerOptions: {
        declaration: true
      }
    }
  }
  
  await clean('dist')
  await bundle({ config, esbuild: true, write: true })
})()
```
