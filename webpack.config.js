/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-nocheck


const path = require('path');
const webpack = require('webpack');
const TSLintPlugin = require('tslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const outdir = path.resolve(__dirname, 'dist');

function getWebviewConfig(env) {
  /** @type webpack.Configuration */
  let webview = {
    name: 'webiew',
    mode: env.production ? 'production' : 'development',
    entry: {
      settingsEditor: './src/views/settings-editor.tsx',
      queryResultsPreviewer: './src/views/query-results-previewer.tsx',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ['babel-loader', 'ts-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.css/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json', '.css', '.scss', '.sass']
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: "initial",
            name: "vendor",
            priority: 10,
            enforce: true
          }
        }
      }
    },
    devtool: !env.production ? 'inline-source-map' : undefined,
    output: {
      filename: 'views/[name].js',
      path: outdir
    },
    plugins: [
      new TSLintPlugin({
        files: ['./src/**/*.ts']
      }),
    ]
  };

  return webview;
}

/**
 *
 * @param {*} env
 * @returns webpack.Configuration
 */
function getExtensionConfig(env) {
  /** @type webpack.Configuration */
  let config = {
    name: 'sqltools',
    mode: env.production ? 'production' : 'development',
    target: 'node',
    entry: {
      sqltools: './src/sqltools.ts',
      languageserver: './src/languageserver/index.ts'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loaders: [
            // {
            //   loader: 'babel-loader',
            //   options: {
            //     presets: ["@babel/env","@babel/preset-react"]
            //   }
            // },
            'ts-loader'
          ],
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new CopyWebpackPlugin([
        { from: path.join(__dirname, 'src', 'resources'), to: outdir }
      ])
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      alias: {
      }
    },
    devtool: !env.production ? 'source-map' : false,
    output: {
      filename: '[name].js',
      path: outdir,
      libraryTarget: "commonjs",
      devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'
    },
    externals: {
      'vscode': 'commonjs vscode',
      'vscode-languageclient': 'vscode-languageclient',
      'vscode-languageserver': 'vscode-languageserver',
      'pg': 'commonjs pg',
    },
    optimization: env.production ? {
      minimize: false,
    } : undefined,
  };

  return config;
}

module.exports = function (env = {}) {
  env.production = !!env.production;
  // return [getExtensionConfig(env)];
  return [getExtensionConfig(env), getWebviewConfig(env)];
};
