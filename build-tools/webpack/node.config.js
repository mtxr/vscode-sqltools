const path = require('path');
const setDefaults = require('./../common/set-defaults');
const webpack = require('webpack');

/**
 *
 * @param {object} entries
 * @param {string} packagePath
 * @returns {webpack.Configuration['plugins']}
 */
module.exports = function getNodeConfig(entries, packagePath) {
  const babelOptions = require(path.join(packagePath, '.babelrc'));
  /** @type webpack.Configuration */
  let config = {
    name: 'ls',
    target: 'node',
    entry: Object.keys(entries).reduce((agg, name) => ({
      ...agg,
      [name]: path.resolve(packagePath, entries[name]),
    }), {}),
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            { loader: 'babel-loader', options: babelOptions },
            { loader: 'ts-loader', options: { transpileOnly: true } },
          ],
          exclude: /node_modules|\.test\..+/i,
        },
        {
          test: /\.js$/,
          use: [{ loader: 'babel-loader', options: babelOptions }],
          exclude: /\.test\..+/i,

        }
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        'pg-native': path.join(packagePath, '../../', 'node_modules/pg/lib/native/index.js'),
      },
      modules: ['node_modules', path.join(packagePath, '..', '..', 'node_modules')],
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    externals: {
      ibm_db: 'commonjs ibm_db',
      sqlite3: 'commonjs sqlite3',
      oracledb: 'commonjs oracledb',
      '@sap/hana-client': 'commonjs @sap/hana-client'
    },
  };

  return setDefaults(config);
};
