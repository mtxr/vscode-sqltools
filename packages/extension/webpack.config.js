const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getWebviewConfig = require('../ui/webpack.config');
const getLanguageServerConfig = require('../language-server/webpack.config');

const extPkgJson = require('./package.json');
const corePkgJson = require('./../core/package.json');
const lsPkgJson = require('./../language-server/package.json');
const uiPkgJson = require('./../ui/package.json');

const dependencies = Object.assign({}, uiPkgJson.dependencies || {}, lsPkgJson.dependencies || {}, corePkgJson.dependencies || {}, extPkgJson.dependencies || {});
const devDependencies = Object.assign({}, uiPkgJson.devDependencies || {}, lsPkgJson.devDependencies || {}, corePkgJson.devDependencies || {}, extPkgJson.devDependencies || {});

// defintions
extPkgJson.name = process.env.PREVIEW ? 'sqltools-preview' : 'sqltools'; // vscode marketplace name

const outdir = path.resolve(__dirname, '..', '..', '..', 'dist');
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
      extension: path.join(__dirname, 'index.ts'),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loaders: [
            { loader: 'ts-loader', options: { transpileOnly: true } }
          ],
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, 'package.json'),
          to: path.join(outdir, 'package.json'),
          transform: (content, filepath) => {
            content = extPkgJson;
            if (process.env.PREVIEW) {
              content.preview = true;
              content.displayName = `${extPkgJson.displayName} - Preview`;
            }
            Object.keys(content.scripts || {}).forEach(k => {
              if (!k.startsWith('tool:') && !k.startsWith('dep:')) {
                delete content.scripts[k];
              }
            });
            content.dependencies = {};
            content.devDependencies = { ...devDependencies, ...dependencies };

            Object.keys(content.devDependencies).filter(k => k.includes('@sqltools')).forEach(k => {
              delete content.devDependencies[k];
            });

            return JSON.stringify(content, null, env.production ? undefined : 2).replace(/SQLTools\./g, `${extPkgJson.name}.`);
          }
        },
        { from: path.join(__dirname, 'icons'), to: path.join(outdir, 'icons') },
        { from: path.join(__dirname, '..', '..', 'static/icon.png'), to: path.join(outdir, 'static/icon.png') },
        { from: path.join(__dirname, '..', '..', 'README.md'), to: path.join(outdir, 'README.md') },
        { from: path.join(__dirname, '..', '..', 'LICENSE.md'), to: path.join(outdir, 'LICENSE.md') },
        { from: path.join(__dirname, '..', '..', 'CHANGELOG.md'), to: path.join(outdir, 'CHANGELOG.md') }
      ])
    ],
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    output: {
      filename: '[name].js',
      path: outdir,
      libraryTarget: "commonjs",
      devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'
    },
    externals: {
      'vscode': 'commonjs vscode',
    },
  };

  return config;
}

module.exports = function (env = {}) {
  env.production = !!env.production;
  return [getLanguageServerConfig(env), getExtensionConfig(env), getWebviewConfig(env)].map((config) => {
    config.plugins = [
      new webpack.ProgressPlugin(),
      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(extPkgJson.version),
        'process.env.EXT_NAME': JSON.stringify(extPkgJson.name),
        'process.env.AUTHOR': JSON.stringify(extPkgJson.author),
        'process.env.ENV': JSON.stringify(env.production ? 'production' : 'development'),
      })
    ].concat(config.plugins || []);
    config.node = {
      ...(config.node || {}),
      __dirname: false
    };
    config.devtool = !env.production ? 'inline-source-map' : 'source-map';
    config.optimization = config.optimization || {};
    config.optimization.minimize = false;
    return config;
  });
};
