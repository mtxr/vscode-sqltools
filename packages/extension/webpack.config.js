const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getWebviewConfig = require('../ui/webpack.config');
const getLanguageServerConfig = require('../language-server/webpack.config');

const extPkgJson = require('./package.json');
const corePkgJson = require('./../core/package.json');
const lsPkgJson = require('./../language-server/package.json');
const uiPkgJson = require('./../ui/package.json');

const dependencies = Object.assign(
  {},
  uiPkgJson.dependencies || {},
  lsPkgJson.dependencies || {},
  corePkgJson.dependencies || {},
  extPkgJson.dependencies || {}
);
const devDependencies = Object.assign(
  {},
  uiPkgJson.devDependencies || {},
  lsPkgJson.devDependencies || {},
  corePkgJson.devDependencies || {},
  extPkgJson.devDependencies || {}
);

// defintions
const EXT_NAME = process.env.PREVIEW ? 'SQLToolsPreview' : 'SQLTools';
const DISPLAY_NAME = process.env.PREVIEW ? 'SQLTools (Beta)' : 'SQLTools';
const EXT_ID = process.env.PREVIEW ? 'sqltools-preview' : 'sqltools';

const rootdir = path.resolve(__dirname, '..', '..');
const outdir = path.resolve(rootdir, '..', 'dist');

function getExtensionConfig() {
  /** @type webpack.Configuration */
  let config = {
    name: 'sqltools',
    target: 'node',
    entry: {
      extension: path.join(__dirname, 'index.ts'),
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loaders: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
          exclude: /node_modules|\.test\..+/i,
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, 'package.json'),
          to: path.join(outdir, 'package.json'),
          transform: (content) => {
            content = JSON.parse(content.toString())
            content.name = EXT_ID;
            content.displayName = DISPLAY_NAME;
            if (process.env.PREVIEW) {
              content.preview = true;
            }
            Object.keys(content.scripts || {}).forEach(k => {
              if (!k.startsWith('tool:') && !k.startsWith('dep:')) {
                delete content.scripts[k];
              }
            });
            content.dependencies = {};
            content.devDependencies = { ...devDependencies, ...dependencies };

            Object.keys(content.devDependencies)
              .filter(k => k.includes('@sqltools'))
              .forEach(k => {
                delete content.devDependencies[k];
              });

            return JSON.stringify(content, null, process.env.NODE_ENV === 'production' ? undefined : 2)
              .replace(/SQLTools\./g, `${EXT_NAME}.`)
              .replace(/SQLTools\//g, `${EXT_NAME}/`);
          },
        },
        { from: path.join(__dirname, 'icons'), to: path.join(outdir, 'icons') },
        { from: path.join(__dirname, '..', '..', 'static/icon.png'), to: path.join(outdir, 'static/icon.png') },
        { from: path.join(__dirname, '..', '..', 'README.md'), to: path.join(outdir, 'README.md') },
        { from: path.join(__dirname, '..', '..', 'LICENSE.md'), to: path.join(outdir, 'LICENSE.md') },
        { from: path.join(__dirname, '..', '..', 'CHANGELOG.md'), to: path.join(outdir, 'CHANGELOG.md') },
      ]),
    ],
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    output: {
      filename: '[name].js',
      path: outdir,
      libraryTarget: 'commonjs2',
    },
    externals: {
      vscode: 'commonjs vscode',
    },
  };

  return config;
}

module.exports = () => {
  const isProduction = process.env.NODE_ENV !== 'development';
  return [getLanguageServerConfig(), getExtensionConfig(), getWebviewConfig()].map(config => {
    config.plugins = [
      new webpack.ProgressPlugin(),
      new webpack.DefinePlugin({
        'process.env.PRODUCT': JSON.stringify(config.name),
        'process.env.VERSION': JSON.stringify(extPkgJson.version),
        'process.env.EXT_NAME': JSON.stringify(EXT_NAME),
        'process.env.DISPLAY_NAME': JSON.stringify(DISPLAY_NAME),
        'process.env.AUTHOR': JSON.stringify(extPkgJson.author),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
      new webpack.SourceMapDevToolPlugin({
        moduleFilenameTemplate: (info) => path.relative(rootdir, info.absoluteResourcePath),
        filename: isProduction ? '[file].map' : undefined,
        sourceRoot: path.relative(outdir, rootdir)}
      )
    ].concat(config.plugins || []);
    config.node = {
      ...(config.node || {}),
      __dirname: false,
    };

    if (isProduction) {
      config.optimization = config.optimization || {};
      config.optimization.minimize = false;
    } else {
      delete config.optimization;
    }
    config.devtool = false;
    config.mode = isProduction ? 'production' : 'development';
    config.output = config.output || {};
    return config;
  });
};
