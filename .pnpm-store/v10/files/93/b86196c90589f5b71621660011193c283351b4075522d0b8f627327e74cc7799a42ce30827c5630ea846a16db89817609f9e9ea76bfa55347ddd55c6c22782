[![Coverage Status](https://coveralls.io/repos/github/aelbore/aria-fs/badge.svg?branch=master&service=github)](https://coveralls.io/github/aelbore/aria-fs?branch=master)
[![Build Status](https://travis-ci.org/aelbore/aria-fs.svg?branch=master)](https://travis-ci.org/aelbore/aria-fs)
[![npm version](https://badge.fury.io/js/aria-fs.svg)](https://www.npmjs.com/package/aria-fs)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# aria-fs

Installation
------------
  ```
    npm install --save aria-fs
  ```


Usage
-----

* `globFiles` - return promise of string array of file paths matching one or more globs.
  - `globFiles(<globs>): Promise<string>`
  <br />
  
  ```js
  import { globFiles } from 'aria-fs';

  (async function(){
    const files = await globFiles('src/**/*.ts');
  })();
  ```
* `clean` - remove/delete directory and files matching the dir path.
  - `clean(<dir>): Promise<void>`
  <br />
  
  ```js
  import { clean } from 'aria-fs';

  (async function(){
    await clean('dist');
  })();
  ```
* `mkdirp` - recursively create directory.
  - `mkdirp(<dir>): void`
  <br />

  ```js
  import { mkdirp } from 'aria-fs';

  mkdirp('dist');
  ```
* `copyFiles` - copy list of files matching the globs.
  - `copyFiles(<globs>, <destRootDir>): Promise<void>`
  <br />
  
  ```js
  import { copyFiles } from 'aria-fs';

  (async function(){
    await copyFiles('src/**/*.ts', 'temp');
  })()
  ```
