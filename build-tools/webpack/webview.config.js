const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const setDefaults = require('./../common/set-defaults');
const webpack = require('webpack');
const parseEntries = require('./../common/parse-entries');

const { rootdir, IS_PRODUCTION } = require('../constants');

/**
 *
 * @param {object} entries
 * @param {string} packagePath
 * @returns {webpack.Configuration['plugins']}
 */

module.exports = exports = function getWebviewConfig({ entries, packagePath }) {
  const { entry, outDir, babelOptions } = parseEntries(entries, packagePath);

  /** @type webpack.Configuration */
  const config = {
    name: 'ui',
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
          test: /\.tsx?$/,
          use: [
            { loader: 'babel-loader', options: babelOptions },
            { loader: 'ts-loader', options: { transpileOnly: true } },
          ],
        },
        {
          test: /\.css/,
          use: [
            minCssExtract,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          exclude: /\.m\.scss$/,
          use: [
            minCssExtract,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3,
              },
            },
            'resolve-url-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(m|module)\.scss$/,
          use: [
            minCssExtract,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3,
                modules: {
                  localIdentName: IS_PRODUCTION ? '[hash:base64]' : '[path][name]__[local]-[hash:base64]',
                  exportLocalsConvention: 'camelCaseOnly',
                },
              },
            },
            'resolve-url-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'ui',
                name: '[path][name].[ext]',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json', '.css', '.scss', '.sass'],
      modules: ['node_modules', path.join(rootdir, 'node_modules')],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /(?!theme)/,
            name: 'commons',
            chunks(chunk) {
              return chunk.name !== 'theme';
            },
            enforce: true,
          },
          vendor: {
            test: /node_modules/,
            chunks: 'all',
            name: 'vendor',
            priority: 10,
            enforce: true,
          },
        },
      },
    },
    output: {
      chunkFilename: 'ui/[name].js',
      filename: 'ui/[name].js',
      ...(outDir
        ? {
            path: outDir,
          }
        : {}),
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'ui/[name].css',
        chunkFilename: 'ui/[name].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
    ],
  };

  return setDefaults(config);
};

const minCssExtract = {
  loader: MiniCssExtractPlugin.loader,
  options: {
  },
};
