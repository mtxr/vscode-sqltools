const path = require('path');
const setDefaults = require('./../common/set-defaults');
const parseEntries = require('./../common/parse-entries');
const webpack = require('webpack');

/**
 *
 * @param {object} entries
 * @param {string} packagePath
 * @returns {webpack.Configuration['plugins']}
 */
module.exports = function getNodeConfig({ entries, packagePath, externals = {} }) {
  const { entry, outDir, babelOptions } = parseEntries(entries, packagePath);

  /** @type webpack.Configuration */
  let config = {
    name: 'ls',
    target: 'node',
    entry,
    module: {
      rules: [
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false, // disable the behaviour
          },
        },
        {
          test: /\.ts$/,
          use: [{ loader: 'ts-loader', options: { transpileOnly: true } }].filter(Boolean),
          exclude: /node_modules|\.test\..+/i,
        },
        process.env.NODE_ENV !== 'development' && {
          test: /\.m?js$/,
          use: [{ loader: 'babel-loader', options: babelOptions }],
          exclude: /\.test\..+/i,
        },
      ].filter(Boolean),
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      modules: ['node_modules', path.join(packagePath, '..', '..', 'node_modules')],
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
      ...(outDir
        ? {
            path: outDir,
          }
        : {}),
    },
  };

  return setDefaults(config);
};
