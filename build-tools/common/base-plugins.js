const path = require('path');
const webpack = require('webpack');

const { EXT_NAMESPACE, EXT_CONFIG_NAMESPACE, DISPLAY_NAME, rootdir, IS_PRODUCTION, outdir, author, version } = require('../constants');

/**
 *
 * @param {string} name
 * @returns {webpack.Configuration['plugins']}
 */
const basePlugins = (name) => [
  new webpack.ProgressPlugin(),
  new webpack.DefinePlugin({
    'process.env.PRODUCT': JSON.stringify(name),
    'process.env.DSN_KEY': JSON.stringify((name === 'ext' ? process.env.EXT_DSN_KEY : process.env.LS_DSN_KEY) || ''),
    'process.env.VERSION': JSON.stringify(version),
    'process.env.EXT_NAMESPACE': JSON.stringify(EXT_NAMESPACE),
    'process.env.EXT_CONFIG_NAMESPACE': JSON.stringify(EXT_CONFIG_NAMESPACE),
    'process.env.DISPLAY_NAME': JSON.stringify(DISPLAY_NAME),
    'process.env.AUTHOR': JSON.stringify(author),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  }),
  // new webpack.SourceMapDevToolPlugin({
  //   moduleFilenameTemplate: (info) => path.relative(rootdir, info.absoluteResourcePath),
  //   filename: IS_PRODUCTION ? '[file].map' : undefined,
  //   sourceRoot: path.relative(outdir, rootdir)
  // }),
];

module.exports = basePlugins;