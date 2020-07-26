# generator-sqltools-driver [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> SQLTools driver generator

## Installation

First, install [Yeoman](http://yeoman.io) and `generator-sqltools-driver` using `npm` or `yarn`.

```shellscript
npm install -g yo
npm install -g generator-sqltools-driver
```

Then generate your new project:

```shellscript
yo sqltools-driver
```

Open your newly created driver directory on VScode.

Launch debug `Run Driver Ext and Attach LS` session and add breakpoints where you need.

If you need, you can also use `Attach SQLTools LS` to attach to SQLTools core extension language server, but it shouldn't be needed if you use the the compose started mentioned before.

## CHANGELOG

### v0.1.5

- Added debug configuration to attach to Language Server as well.

### v0.1.4

- Added missed .gitignore. Thanks to [@daimor](https://github.com/daimor)


## License

MIT © [Matheus Teixeira](https://mteixeira.dev)


[npm-image]: https://badge.fury.io/js/generator-sqltools-driver.svg
[npm-url]: https://npmjs.org/package/generator-sqltools-driver
[travis-image]: https://travis-ci.com/mtxr/generator-sqltools-driver.svg?branch=master
[travis-url]: https://travis-ci.com/mtxr/generator-sqltools-driver
[daviddm-image]: https://david-dm.org/mtxr/generator-sqltools-driver.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/mtxr/generator-sqltools-driver
