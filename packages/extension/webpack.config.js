require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getWebviewConfig = require('../ui/webpack.config');
const getLanguageServerConfig = require('../language-server/webpack.config');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const extPkgJson = require('./package.json');
const { dependencies, devDependencies } = require('fs').readdirSync('../').reduce((deps, pkg) => {
  console.log(`Reading dependencies from @sqltools/${pkg}`);
  const pkgJson = require(`./../${pkg}/package.json`);
  deps.dependencies = {
    ...deps.dependencies,
    ...pkgJson.dependencies,
  };
  deps.devDependencies = {
    ...deps.devDependencies,
    ...pkgJson.devDependencies,
  };
  return deps;
}, { dependencies: {}, devDependencies: {} });
console.log(`Total dependencies: ${Object.keys(dependencies).length}`);
console.log(`Total devDependencies: ${Object.keys(devDependencies).length}`);

// defintions
const DISPLAY_NAME = process.env.DISPLAY_NAME || 'SQLTools';
const EXT_NAMESPACE = DISPLAY_NAME.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {return index == 0 ? word.toLowerCase() : word.toUpperCase();}).replace(/\s+/g, '');
const EXT_CONFIG_NAMESPACE = 'sqltools';
const isPreview = !!(process.env.DISPLAY_NAME || false);

const rootdir = path.resolve(__dirname, '..', '..');
const outdir = path.resolve(rootdir, 'dist');

function getExtensionConfig(outdir) {
  /** @type webpack.Configuration */
  let config = {
    name: 'ext',
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
            content = JSON.parse(content.toString());
            const configurationOriginal = content.contributes.configuration;
            delete content.contributes.configuration;
            content.name = EXT_NAMESPACE;
            if (isPreview) {
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
            content = JSON.parse(JSON.stringify(content)
              .replace(/sqltools([\/\.\-])/g, `${EXT_NAMESPACE}$1`)
              .replace(/SQLTools/g, `${DISPLAY_NAME}`));

            content.contributes.configuration = configurationOriginal;

            return JSON.stringify(content, null, process.env.NODE_ENV === 'production' ? undefined : 2);
          },
        },
        {
          from: path.join(__dirname, '..', '..', 'README.md'),
          to: path.join(outdir, 'README.md'),
          transform: (content) => {
            content = content.toString();
            const hrPos = content.indexOf('<hr');
            content = `# ${EXT_NAMESPACE} extension for Visual Studio Code\n${content.substring(hrPos).replace(/^<hr * \/>/, '')}`;
            return content;
          },
        },
        { from: path.join(__dirname, 'icons'), to: path.join(outdir, 'icons') },
        { from: path.join(__dirname, '..', 'drivers', 'icons'), to: path.join(outdir, 'icons', 'driver') },
        { from: path.join(__dirname, 'language'), to: path.join(outdir, 'language') },
        { from: path.join(__dirname, '..', '..', 'static/icon.png'), to: path.join(outdir, 'static/icon.png') },
        { from: path.join(__dirname, '..', '..', '.vscodeignore'), to: path.join(outdir, '.vscodeignore'), toType: 'file' },
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
  return [getLanguageServerConfig(outdir), getExtensionConfig(outdir), getWebviewConfig(outdir)].map(config => {
    config.plugins = [
      new webpack.ProgressPlugin(),
      new webpack.DefinePlugin({
        'process.env.PRODUCT': JSON.stringify(config.name),
        'process.env.DSN_KEY': JSON.stringify((config.name === 'ext' ? process.env.EXT_DSN_KEY : process.env.LS_DSN_KEY) || ''),
        'process.env.VERSION': JSON.stringify(extPkgJson.version),
        'process.env.EXT_NAMESPACE': JSON.stringify(EXT_NAMESPACE),
        'process.env.EXT_CONFIG_NAMESPACE': JSON.stringify(EXT_CONFIG_NAMESPACE),
        'process.env.DISPLAY_NAME': JSON.stringify(DISPLAY_NAME),
        'process.env.AUTHOR': JSON.stringify(extPkgJson.author),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
      new webpack.SourceMapDevToolPlugin({
        moduleFilenameTemplate: (info) => path.relative(rootdir, info.absoluteResourcePath),
        filename: isProduction ? '[file].map' : undefined,
        sourceRoot: path.relative(outdir, rootdir)
      }
      )
    ].concat(config.plugins || []);
    config.node = {
      __dirname: false,
      __filename: false,
      fs: 'empty',
      net: 'empty',
      child_process: 'empty',
      ...(config.node || {}),
    };

    config.optimization = config.optimization || {};
    if (isProduction) {
      config.optimization.minimize = true;
      config.optimization.minimizer = [
        new TerserJSPlugin({ terserOptions: { mangle: false, keep_classnames: true } }), // mangle false else mysql blow ups with "PROTOCOL_INCORRECT_PACKET_SEQUENCE"
        new OptimizeCSSAssetsPlugin({})
      ]
    } else {
      config.optimization.minimize = false;
    }
    config.devtool = false;
    config.mode = isProduction ? 'production' : 'development';
    config.output = config.output || {};
    config.stats = 'minimal';
    return config;
  });
};
