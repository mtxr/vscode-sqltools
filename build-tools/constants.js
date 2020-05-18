const path = require('path');

const { author, version } = require('../package.json');

exports.rootdir = path.resolve(__dirname, '..');
exports.outdir = path.resolve(exports.rootdir, 'dist');
exports.packagesDir = path.resolve(exports.rootdir, 'packages');

exports.DISPLAY_NAME = process.env.DISPLAY_NAME || 'SQLTools';
exports.EXT_NAMESPACE = exports.DISPLAY_NAME.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) { return index == 0 ? word.toLowerCase() : word.toUpperCase(); }).replace(/\s+/g, '');
exports.EXT_CONFIG_NAMESPACE = 'sqltools';

exports.IS_PRODUCTION = process.env.NODE_ENV !== 'development';

exports.author = author;
exports.version = version;