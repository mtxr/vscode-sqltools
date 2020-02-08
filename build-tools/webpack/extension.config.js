const path = require('path');
const webpack = require('webpack');
const setDefaults = require('./../common/set-defaults');
/**
 *
 * @param {object} entries
 * @param {string} packagePath
 * @returns {webpack.Configuration['plugins']}
 */
module.exports = function getExtensionConfig(entries, packagePath) {
  /** @type webpack.Configuration */
  let config = {
    name: 'ext',
    target: 'node',
    entry: Object.keys(entries).reduce((agg, name) => ({
      ...agg,
      [name]: path.resolve(packagePath, entries[name]),
    }), {}),
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loaders: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
          exclude: /node_modules|\.test\..+/i,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    externals: {
      vscode: 'commonjs vscode',
    },
  };

  return setDefaults(config);
}