# stage 3 proposal support for Acorn

[![NPM version](https://img.shields.io/npm/v/acorn-stage3.svg)](https://www.npmjs.org/package/acorn-stage3)

This is a plugin for [Acorn](http://marijnhaverbeke.nl/acorn/) - a tiny, fast JavaScript parser, written completely in JavaScript.

It implements support for all missing [ECMAScript stage 3 proposals](https://github.com/tc39/proposals/blob/master/README.md#stage-3). Neither loose mode nor walk are currently supported.

- [Numeric Separators](https://github.com/tc39/proposal-numeric-separator) via [acorn-numeric-separator](https://www.npmjs.org/package/acorn-numeric-separator)
- [Class field declarations](https://github.com/tc39/proposal-class-fields) via [acorn-class-fields](https://www.npmjs.org/package/acorn-class-fields)
- [Private methods and getter/setters for JavaScript classes](https://github.com/tc39/proposal-private-methods) via [acorn-private-methods](https://www.npmjs.org/package/acorn-private-methods)
- [Static class features](https://github.com/tc39/proposal-static-class-features) via [acorn-static-class-features](https://www.npmjs.org/package/acorn-static-class-features)
- [Logical assignments](https://github.com/tc39/proposal-logical-assignment) via [acorn-logical-assignment](https://github.com/acornjs/acorn-logical-assignment)

## Usage

This module provides a plugin that can be used to extend the Acorn `Parser` class:

```javascript
const {Parser} = require('acorn');
const stage3 = require('acorn-stage3');
Parser.extend(stage3).parse('100_000n');
```

## License

This plugin is released under an [MIT License](./LICENSE).
