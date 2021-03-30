const path = require('path');

const { author, version } = require('../package.json');

exports.rootdir = path.resolve(__dirname, '..');
exports.packagesDir = path.resolve(exports.rootdir, 'packages');
exports.outdir = path.resolve(exports.packagesDir, 'extension/dist');

exports.DISPLAY_NAME = process.env.DISPLAY_NAME || 'SQLTools';
exports.EXT_NAMESPACE = 'sqltools';
exports.EXT_CONFIG_NAMESPACE = exports.EXT_NAMESPACE;

exports.IS_PRODUCTION = process.env.NODE_ENV !== 'development';

exports.author = author;
exports.version = version;
