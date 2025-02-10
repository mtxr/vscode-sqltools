# i18next-scanner [![build status](https://travis-ci.org/i18next/i18next-scanner.svg?branch=master)](https://travis-ci.org/i18next/i18next-scanner) [![Coverage Status](https://coveralls.io/repos/i18next/i18next-scanner/badge.svg?branch=master&service=github)](https://coveralls.io/github/i18next/i18next-scanner?branch=master)

[![NPM](https://nodei.co/npm/i18next-scanner.png?downloads=true&stars=true)](https://www.npmjs.com/package/i18next-scanner)

Scan your code, extract translation keys/values, and merge them into i18n resource files.

Turns your code
```js
i18n._('Loading...');
i18n._('Backslashes in single quote: \' \\ \'');
i18n._('This is \
a multiline \
string');

i18n.t('car', { context: 'blue', count: 1 }); // output: 'One blue car'
i18n.t('car', { context: 'blue', count: 2 }); // output: '2 blue cars'

<Trans i18nKey="some.key">Default text</Trans>
```

into resource files
```js
{
  "Loading...": "Wird geladen...", // uses existing translation
  "Backslashes in single quote: ' \\ '": "__NOT_TRANSLATED__", // returns a custom string
  "This is a multiline string": "this is a multiline string", // returns the key as the default value
  "car": "car",
  "car_blue": "One blue car",
  "car_blue_plural": "{{count}} blue cars",
  "some": {
    "key": "Default text"
  }
}
```


## Notice
There is a major breaking change since v1.0, and the API interface and options are not compatible with v0.x.

Checkout [Migration Guide](https://github.com/i18next/i18next-scanner/wiki/Migration-Guide) while upgrading from earlier versions.

## Features
* Fully compatible with [i18next](https://github.com/i18next/i18next) - a full-featured i18n javascript library for translating your webapplication.
* Support [react-i18next](https://github.com/i18next/react-i18next) for parsing the <b>Trans</b> component
* Support [Key Based Fallback](https://www.i18next.com/principles/fallback#key-fallback/) to write your code without the need to maintain i18n keys. This feature is available since [i18next@^2.1.0](https://github.com/i18next/i18next/blob/master/CHANGELOG.md#210)
* A standalone parser API
* A transform stream that works with both Gulp and Grunt task runner.
* Support custom transform and flush functions.

## Installation

```sh
npm install --save-dev i18next-scanner
```

or

```sh
npm install -g i18next-scanner
```

## Usage

### CLI Usage

```sh
$ i18next-scanner

  Usage: i18next-scanner [options] <file ...>


  Options:

    -V, --version      output the version number
    --config <config>  Path to the config file (default: i18next-scanner.config.js)
    --output <path>    Path to the output directory (default: .)
    -h, --help         output usage information

  Examples:

    $ i18next-scanner --config i18next-scanner.config.js --output /path/to/output 'src/**/*.{js,jsx}'
    $ i18next-scanner --config i18next-scanner.config.js 'src/**/*.{js,jsx}'
    $ i18next-scanner '/path/to/src/app.js' '/path/to/assets/index.html'
```

Globbing patterns are supported for specifying file paths:
* `*` matches any number of characters, but not `/`
* `?` matches a single character, but not `/`
* `**` matches any number of characters, including `/`, as long as it's the only thing in a path part
* `{}` allows for a comma-separated list of "or" expressions
* `!` at the beginning of a pattern will negate the match

_Note: Globbing patterns should be wrapped in single quotes._

#### Examples

* [examples/i18next-scanner.config.js](https://github.com/i18next/i18next-scanner/blob/master/examples/i18next-scanner.config.js)

```js
const fs = require('fs');
const chalk = require('chalk');

module.exports = {
    input: [
        'app/**/*.{js,jsx}',
        // Use ! to filter out files or directories
        '!app/**/*.spec.{js,jsx}',
        '!app/i18n/**',
        '!**/node_modules/**',
    ],
    output: './',
    options: {
        debug: true,
        func: {
            list: ['i18next.t', 'i18n.t'],
            extensions: ['.js', '.jsx']
        },
        trans: {
            component: 'Trans',
            i18nKey: 'i18nKey',
            defaultsKey: 'defaults',
            extensions: ['.js', '.jsx'],
            fallbackKey: function(ns, value) {
                return value;
            },

            // https://react.i18next.com/latest/trans-component#usage-with-simple-html-elements-like-less-than-br-greater-than-and-others-v10.4.0
            supportBasicHtmlNodes: true, // Enables keeping the name of simple nodes (e.g. <br/>) in translations instead of indexed keys.
            keepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'], // Which nodes are allowed to be kept in translations during defaultValue generation of <Trans>.

            // https://github.com/acornjs/acorn/tree/master/acorn#interface
            acorn: {
                ecmaVersion: 2020,
                sourceType: 'module', // defaults to 'module'
            }
        },
        lngs: ['en','de'],
        ns: [
            'locale',
            'resource'
        ],
        defaultLng: 'en',
        defaultNs: 'resource',
        defaultValue: '__STRING_NOT_TRANSLATED__',
        resource: {
            loadPath: 'i18n/{{lng}}/{{ns}}.json',
            savePath: 'i18n/{{lng}}/{{ns}}.json',
            jsonIndent: 2,
            lineEnding: '\n'
        },
        nsSeparator: false, // namespace separator
        keySeparator: false, // key separator
        interpolation: {
            prefix: '{{',
            suffix: '}}'
        },
        metadata: {},
        allowDynamicKeys: false,
    },
    transform: function customTransform(file, enc, done) {
        "use strict";
        const parser = this.parser;
        const content = fs.readFileSync(file.path, enc);
        let count = 0;

        parser.parseFuncFromString(content, { list: ['i18next._', 'i18next.__'] }, (key, options) => {
            parser.set(key, Object.assign({}, options, {
                nsSeparator: false,
                keySeparator: false
            }));
            ++count;
        });

        if (count > 0) {
            console.log(`i18next-scanner: count=${chalk.cyan(count)}, file=${chalk.yellow(JSON.stringify(file.relative))}`);
        }

        done();
    }
};
```

### Standard API
```js
const fs = require('fs');
const Parser = require('i18next-scanner').Parser;

const customHandler = function(key) {
    parser.set(key, '__TRANSLATION__');
};

const parser = new Parser();
let content = '';

// Parse Translation Function
// i18next.t('key');
content = fs.readFileSync('/path/to/app.js', 'utf-8');
parser
    .parseFuncFromString(content, customHandler) // pass a custom handler
    .parseFuncFromString(content, { list: ['i18next.t']}) // override `func.list`
    .parseFuncFromString(content, { list: ['i18next.t']}, customHandler)
    .parseFuncFromString(content); // use default options and handler

// Parse Trans component
content = fs.readFileSync('/path/to/app.jsx', 'utf-8');
parser
    .parseTransFromString(content, customHandler) // pass a custom handler
    .parseTransFromString(content, { component: 'Trans', i18nKey: 'i18nKey', defaultsKey: 'defaults' })
    .parseTransFromString(content, { fallbackKey: true }) // Uses defaultValue as the fallback key when the i18nKey attribute is missing
    .parseTransFromString(content); // use default options and handler

// Parse HTML Attribute
// <div data-i18n="key"></div>
content = fs.readFileSync('/path/to/index.html', 'utf-8');
parser
    .parseAttrFromString(content, customHandler) // pass a custom handler
    .parseAttrFromString(content, { list: ['data-i18n'] }) // override `attr.list`
    .parseAttrFromString(content, { list: ['data-i18n'] }, customHandler)
    .parseAttrFromString(content); // using default options and handler

console.log(parser.get());
console.log(parser.get({ sort: true }));
console.log(parser.get('translation:key', { lng: 'en'}));
```

### Transform Stream API
The main entry function of [i18next-scanner](https://github.com/i18next/i18next-scanner) is a transform stream. You can use [vinyl-fs](https://github.com/wearefractal/vinyl) to create a readable stream, pipe the stream through [i18next-scanner](https://github.com/i18next/i18next-scanner) to transform your code into an i18n resource object, and write to a destination folder.

Here is a simple example showing how that works:
```js
const scanner = require('i18next-scanner');
const vfs = require('vinyl-fs');
const sort = require('gulp-sort');
const options = {
    // See options at https://github.com/i18next/i18next-scanner#options
};
vfs.src(['/path/to/src'])
    .pipe(sort()) // Sort files in stream by path
    .pipe(scanner(options))
    .pipe(vfs.dest('/path/to/dest'));
```

Alternatively, you can get a transform stream by calling createStream() as show below:
```js
vfs.src(['/path/to/src'])
    .pipe(sort()) // Sort files in stream by path
    .pipe(scanner.createStream(options))
    .pipe(vfs.dest('/path/to/dest'));
```

### Gulp
Now you are ready to set up a minimal configuration, and get started with Gulp. For example:
```js
const gulp = require('gulp');
const sort = require('gulp-sort');
const scanner = require('i18next-scanner');

gulp.task('i18next', function() {
    return gulp.src(['src/**/*.{js,html}'])
        .pipe(sort()) // Sort files in stream by path
        .pipe(scanner({
            lngs: ['en', 'de'], // supported languages
            resource: {
                // the source path is relative to current working directory
                loadPath: 'assets/i18n/{{lng}}/{{ns}}.json',

                // the destination path is relative to your `gulp.dest()` path
                savePath: 'i18n/{{lng}}/{{ns}}.json'
            }
        }))
        .pipe(gulp.dest('assets'));
});
```

### Grunt
Once you've finished the installation, add this line to your project's Gruntfile:
```js
grunt.loadNpmTasks('i18next-scanner');
```

In your project's Gruntfile, add a section named `i18next` to the data object passed into `grunt.initConfig()`, like so:
```js
grunt.initConfig({
    i18next: {
        dev: {
            src: 'src/**/*.{js,html}',
            dest: 'assets',
            options: {
                lngs: ['en', 'de'],
                resource: {
                    loadPath: 'assets/i18n/{{lng}}/{{ns}}.json',
                    savePath: 'i18n/{{lng}}/{{ns}}.json'
                }
            }
        }
    }
});
```

## API

There are two ways to use i18next-scanner:

### Standard API
```js
const Parser = require('i18next-scanner').Parser;
const parser = new Parser(options);

const code = "i18next.t('key'); ...";
parser.parseFuncFromString(code);

const jsx = '<Trans i18nKey="some.key">Default text</Trans>';
parser.parseTransFromString(jsx);

const html = '<div data-i18n="key"></div>';
parser.parseAttrFromString(html);

parser.get();
```

#### parser.parseFuncFromString
Parse translation key from JS function
```js
parser.parseFuncFromString(content)

parser.parseFuncFromString(content, { list: ['_t'] });

parser.parseFuncFromString(content, function(key, options) {
    options.defaultValue = key; // use key as the value
    parser.set(key, options);
});

parser.parseFuncFromString(content, { list: ['_t'] }, function(key, options) {
    parser.set(key, options); // use defaultValue
});
```

#### parser.parseTransFromString
Parse translation key from the [Trans component](https://github.com/i18next/react-i18next)
```js
parser.parseTransFromString(content);

parser.parseTransFromString(context, { component: 'Trans', i18nKey: 'i18nKey' });

// Uses defaultValue as the fallback key when the i18nKey attribute is missing
parser.parseTransFromString(content, { fallbackKey: true });

parser.parseTransFromString(content, {
    fallbackKey: function(ns, value) {
        // Returns a hash value as the fallback key
        return sha1(value);
    }
});

parser.parseTransFromString(content, function(key, options) {
    options.defaultValue = key; // use key as the value
    parser.set(key, options);
});
```

#### parser.parseAttrFromString
Parse translation key from HTML attribute
```js
parser.parseAttrFromString(content)

parser.parseAttrFromString(content, { list: ['data-i18n'] });

parser.parseAttrFromString(content, function(key) {
    const defaultValue = key; // use key as the value
    parser.set(key, defaultValue);
});

parser.parseAttrFromString(content, { list: ['data-i18n'] }, function(key) {
    parser.set(key); // use defaultValue
});
```

#### parser.get
Get the value of a translation key or the whole i18n resource store
```js
// Returns the whole i18n resource store
parser.get();

// Returns the resource store with the top-level keys sorted by alphabetical order
parser.get({ sort: true });

// Returns a value in fallback language (@see options.fallbackLng) with namespace and key
parser.get('ns:key');

// Returns a value with namespace, key, and lng
parser.get('ns:key', { lng: 'en' });
```

#### parser.set
Set a translation key with an optional defaultValue to i18n resource store

```js
// Set a translation key
parser.set(key);

// Set a translation key with default value
parser.set(key, defaultValue);

// Set a translation key with default value using options
parser.set(key, {
    defaultValue: defaultValue
});
```

### Transform Stream API
```js
const scanner = require('i18next-scanner');
scanner.createStream(options, customTransform /* optional */, customFlush /* optional */);
```

#### customTransform
The optional `customTransform` function is provided as the 2nd argument for the transform stream API. It must have the following signature: `function (file, encoding, done) {}`. A minimal implementation should call the `done()` function to indicate that the transformation is done, even if that transformation means discarding the file.
For example:
```js
const scanner = require('i18next-scanner');
const vfs = require('vinyl-fs');
const customTransform = function _transform(file, enc, done) {
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);

    // add your code
    done();
};

vfs.src(['/path/to/src'])
    .pipe(scanner(options, customTransform))
    .pipe(vfs.dest('path/to/dest'));
```

To parse a translation key, call `parser.set(key, defaultValue)` to assign the key with an optional `defaultValue`.
For example:
```js
const customTransform = function _transform(file, enc, done) {
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);

    parser.parseFuncFromString(content, { list: ['i18n.t'] }, function(key) {
        const defaultValue = '__L10N__';
        parser.set(key, defaultValue);
    });

    done();
};
```

Alternatively, you may call `parser.set(defaultKey, value)` to assign the value with a default key. The `defaultKey` should be unique string and can never be `null`, `undefined`, or empty.
For example:
```js
const hash = require('sha1');
const customTransform = function _transform(file, enc, done) {
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);

    parser.parseFuncFromString(content, { list: ['i18n._'] }, function(key) {
        const value = key;
        const defaultKey = hash(value);
        parser.set(defaultKey, value);
    });

    done();
};
```

#### customFlush
The optional `customFlush` function is provided as the last argument for the transform stream API, it is called just prior to the stream ending. You can implement your `customFlush` function to override the default `flush` function. When everything's done, call the `done()` function to indicate the stream is finished.
For example:
```js
const scanner = require('i18next-scanner');
const vfs = require('vinyl-fs');
const customFlush = function _flush(done) {
    const parser = this.parser;
    const resStore = parser.getResourceStore();

    // loop over the resStore
    Object.keys(resStore).forEach(function(lng) {
        const namespaces = resStore[lng];
        Object.keys(namespaces).forEach(function(ns) {
            const obj = namespaces[ns];
            // add your code
        });
    });

    done();
};

vfs.src(['/path/to/src'])
    .pipe(scanner(options, customTransform, customFlush))
    .pipe(vfs.dest('/path/to/dest'));
```


## Default Options

Below are the configuration options with their default values:

```javascript
{
    compatibilityJSON: 'v3', // One of: 'v1', 'v2', 'v3', 'v4
    debug: false,
    removeUnusedKeys: false,
    sort: false,
    attr: {
        list: ['data-i18n'],
        extensions: ['.html', '.htm'],
    },
    func: {
        list: ['i18next.t', 'i18n.t'],
        extensions: ['.js', '.jsx'],
    },
    trans: {
        component: 'Trans',
        i18nKey: 'i18nKey',
        defaultsKey: 'defaults',
        extensions: ['.js', '.jsx'],
        fallbackKey: false,

        // https://react.i18next.com/latest/trans-component#usage-with-simple-html-elements-like-less-than-br-greater-than-and-others-v10.4.0
        supportBasicHtmlNodes: true, // Enables keeping the name of simple nodes (e.g. <br/>) in translations instead of indexed keys.
        keepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'], // Which nodes are allowed to be kept in translations during defaultValue generation of <Trans>.

        // https://github.com/acornjs/acorn/tree/master/acorn#interface
        acorn: {
            ecmaVersion: 2020,
            sourceType: 'module', // defaults to 'module'
        },
    },
    lngs: ['en'],
    ns: ['translation'],
    defaultLng: 'en',
    defaultNs: 'translation',
    defaultValue: '',
    resource: {
        loadPath: 'i18n/{{lng}}/{{ns}}.json',
        savePath: 'i18n/{{lng}}/{{ns}}.json',
        jsonIndent: 2,
        lineEnding: '\n',
    },
    nsSeparator: ':',
    keySeparator: '.',
    pluralSeparator: '_',
    contextSeparator: '_',
    contextDefaultValues: [],
    interpolation: {
        prefix: '{{',
        suffix: '}}',
    },
    metadata: {},
    allowDynamicKeys: false,
}
```

#### compatibilityJSON

Type: `String` Default: `'v3'`

The `compatibilityJSON` version to use for plural suffixes.

See https://www.i18next.com/misc/json-format for details.

#### debug

Type: `Boolean` Default: `false`

Set to `true` to turn on debug output.

#### removeUnusedKeys

Type: `Boolean` or `Function` Default: `false`

Set to `true` to remove unused translation keys from i18n resource files. By default, this is set to `false`.
```js
{ // Default
    removeUnusedKeys: false,
}
```

If a function is provided, it will be used to decide whether an unused translation key should be removed.
```js
// Available since 4.6.0
//
// @param {string} lng The language of the unused translation key.
// @param {string} ns The namespace of the unused translation key.
// @param {array} key The translation key in its array form.
// @return {boolean} Returns true if the unused translation key should be removed.
removeUnusedKeys: function(lng, ns, key) {
  if (ns === 'resource') {
    return true;
  }
  return false;
}
```

#### sort

Type: `Boolean` Default: `false`

Set to `true` if you want to sort translation keys in ascending order.

#### attr

Type: `Object` or `false`

If an `Object` is supplied, you can either specify a list of attributes and extensions, or override the default.
```js
{ // Default
    attr: {
        list: ['data-i18n'],
        extensions: ['.html', '.htm']
    }
}
```

You can set `attr` to `false` to disable parsing attribute as below:
```js
{
    attr: false
}
```

#### func

Type: `Object` or `false`

If an `Object` is supplied, you can either specify a list of translation functions and extensions, or override the default.
```js
{ // Default
    func: {
        list: ['i18next.t', 'i18n.t'],
        extensions: ['.js', '.jsx']
    }
}
```

You can set `func` to `false` to disable parsing translation function as below:
```js
{
    func: false
}
```

#### trans

Type: `Object` or `false`

If an `Object` is supplied, you can specify a list of extensions, or override the default.
```js
{ // Default
    trans: {
        component: 'Trans',
        i18nKey: 'i18nKey',
        defaultsKey: 'defaults',
        extensions: ['.js', '.jsx'],
        fallbackKey: false,

        // https://react.i18next.com/latest/trans-component#usage-with-simple-html-elements-like-less-than-br-greater-than-and-others-v10.4.0
        supportBasicHtmlNodes: true, // Enables keeping the name of simple nodes (e.g. <br/>) in translations instead of indexed keys.
        keepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'], // Which nodes are allowed to be kept in translations during defaultValue generation of <Trans>.

        // https://github.com/acornjs/acorn/tree/master/acorn#interface
        acorn: {
            ecmaVersion: 2020,
            sourceType: 'module', // defaults to 'module'
        },
    }
}
```

You can set `trans` to `false` to disable parsing Trans component as below:
```js
{
    trans: false
}
```

The `fallbackKey` can either be a boolean value, or a function like so:
```js
fallbackKey: function(ns, value) {
    // Returns a hash value as the fallback key
    return sha1(value);
}
```

You can pass RexExp to `trans.component` in case you want to match multiple things:
```js
component: /Trans$/
```

#### lngs

Type: `Array` Default: `['en']`

An array of supported languages.

#### ns

Type: `String` or `Array` Default: `['translation']`

A namespace string or an array of namespaces.

#### defaultLng

Type: `String` Default: `'en'`

The default language used for checking default values.

#### defaultNs

Type: `String` Default: `'translation'`

The default namespace used if not passed to translation function.

#### defaultValue

Type: `String` or `Function` Default: `''`

The default value used if not passed to `parser.set`.

##### Examples
Provides the default value with a string:
```js
{
    defaultValue: '__NOT_TRANSLATED__'
}
```

Provides the default value as a callback function:
```js
{
    // @param {string} lng The language currently used.
    // @param {string} ns The namespace currently used.
    // @param {string} key The translation key.
    // @return {string} Returns a default value for the translation key.
    defaultValue: function(lng, ns, key) {
        if (lng === 'en') {
            // Return key as the default value for English language
            return key;
        }
        // Return the string '__NOT_TRANSLATED__' for other languages
        return '__NOT_TRANSLATED__';
    }
}
```

#### resource

Type: `Object`

Resource options:
```js
{ // Default
    resource: {
        // The path where resources get loaded from. Relative to current working directory.
        loadPath: 'i18n/{{lng}}/{{ns}}.json',

        // The path to store resources. Relative to the path specified by `gulp.dest(path)`.
        savePath: 'i18n/{{lng}}/{{ns}}.json',

        // Specify the number of space characters to use as white space to insert into the output JSON string for readability purpose.
        jsonIndent: 2,

        // Normalize line endings to '\r\n', '\r', '\n', or 'auto' for the current operating system. Defaults to '\n'.
        // Aliases: 'CRLF', 'CR', 'LF', 'crlf', 'cr', 'lf'
        lineEnding: '\n'
    }
}
```

`loadPath` and `savePath` can be both be defined as `Function` with parameters `lng` and `ns`

```js
{ // Default
    resource: {
        // The path where resources get loaded from. Relative to current working directory.
        loadPath: function(lng, ns) {
            return 'i18n/'+lng+'/'+ns+'.json';
        },

        // The path to store resources. Relative to the path specified by `gulp.dest(path)`.
        savePath: function(lng, ns) {
            return 'i18n/'+lng+'/'+ns+'.json';
        },

        // Specify the number of space characters to use as white space to insert into the output JSON string for readability purpose.
        jsonIndent: 2,

        // Normalize line endings to '\r\n', '\r', '\n', or 'auto' for the current operating system. Defaults to '\n'.
        // Aliases: 'CRLF', 'CR', 'LF', 'crlf', 'cr', 'lf'
        lineEnding: '\n'
    }
}
```

#### keySeparator

Type: `String` or `false` Default: `'.'`

Key separator used in translation keys.

Set to `false` to disable key separator if you prefer having keys as the fallback for translation (e.g. gettext). This feature is supported by [i18next@2.1.0](https://github.com/i18next/i18next/blob/master/CHANGELOG.md#210). Also see <strong>Key based fallback</strong> at https://www.i18next.com/principles/fallback#key-fallback.

#### nsSeparator

Type: `String` or `false` Default: `':'`

Namespace separator used in translation keys.

Set to `false` to disable namespace separator if you prefer having keys as the fallback for translation (e.g. gettext). This feature is supported by [i18next@2.1.0](https://github.com/i18next/i18next/blob/master/CHANGELOG.md#210). Also see <strong>Key based fallback</strong> at https://www.i18next.com/principles/fallback#key-fallback.

#### context

Type: `Boolean` or `Function` Default: `true`

Whether to add context form key.

```js
context: function(lng, ns, key, options) {
    return true;
}
```

#### contextFallback

Type: `Boolean` Default: `true`

Whether to add a fallback key as well as the context form key.

#### contextSeparator

Type: `String` Default: `'_'`

The character to split context from key.

#### contextDefaultValues

Type: `Array` Default: `[]`

A list of default context values, used when the scanner encounters dynamic value as a `context`.
For a list of `['male', 'female']` the scanner will generate an entry for each value.

#### plural

Type: `Boolean` or `Function` Default: `true`

Whether to add plural form key.

```js
plural: function(lng, ns, key, options) {
    return true;
}
```

#### pluralFallback

Type: `Boolean` Default: `true`

Whether to add a fallback key as well as the plural form key.

#### pluralSeparator

Type: `String` Default: `'_'`

The character to split plural from key.

#### interpolation

Type: `Object`

interpolation options
```js
{ // Default
    interpolation: {
        // The prefix for variables
        prefix: '{{',

        // The suffix for variables
        suffix: '}}'
    }
}
```

#### metadata

Type: `Object` Default: `{}`

This can be used to pass any additional information regarding the string.

#### allowDynamicKeys

Type: `Boolean` Default: `false`

This can be used to allow dynamic keys e.g. `friend${DynamicValue}`

Example Usage:

```
  transform: function customTransform(file, enc, done) {
    'use strict';
    const parser = this.parser;

    const contexts = {
      compact: ['compact'],
      max: ['Max'],
    };

    const keys = {
        difficulty: { list: ['Normal', 'Hard'] },
        minMax: { list: ['Min', 'Max'] },
    };

    const content = fs.readFileSync(file.path, enc);

    parser.parseFuncFromString(content, { list: ['i18next.t', 'i18n.t'] }, (key, options) => {
      // Add context based on metadata
      if (options.metadata?.context) {
        delete options.context;
        const context = contexts[options.metadata?.context];
        parser.set(key, options);
        for (let i = 0; i < context?.length; i++) {
          parser.set(`${key}${parser.options.contextSeparator}${context[i]}`, options);
        }
      }

      // Add keys based on metadata (dynamic or otherwise)
      if (options.metadata?.keys) {
        const list = keys[options.metadata?.keys].list;
        for (let i = 0; i < list?.length; i++) {
          parser.set(`${key}${list[i]}`, options);
        }
      }

      // Add all other non-metadata related keys
      if (!options.metadata) {
        parser.set(key, options);
      }
    });

    done();
```

## Integration Guide
Checkout [Integration Guide](https://github.com/i18next/i18next-scanner/wiki/Integration-Guide) to learn how to integrate with [React](https://github.com/i18next/i18next-scanner/wiki/Integration-Guide#react), [Gettext Style I18n](https://github.com/i18next/i18next-scanner/wiki/Integration-Guide#gettext-style-i18n), and [Handlebars](https://github.com/i18next/i18next-scanner/wiki/Integration-Guide#handlebars).

## License

MIT
