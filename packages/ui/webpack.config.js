const path = require('path');

const outdir = path.resolve(__dirname, '..', '..', '..', 'dist');

const babelOptions = require(path.join(__dirname, '.babelrc'));

module.exports = exports = function getWebviewConfig() {
  return {
    name: 'ui',
    entry: {
      Settings: path.join(__dirname, 'screens', 'Settings.tsx'),
      Results: path.join(__dirname, 'screens', 'Results.tsx'),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            { loader: 'babel-loader', options: babelOptions },
            { loader: 'ts-loader', options: { transpileOnly: true } },
          ],
          exclude: /node_modules|\.test\..+/i,
        },
        {
          test: /\.css/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', {
              loader: 'sass-loader',
              options: {
                  data: '@import "slick.grid.variables.scss";',
                  includePaths: ['node_modules/slickgrid-es6/dist']
              }
          }],
        },
        { test: /\.(png|gif|txt)$/, loader: "url-loader?limit=100000" }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json', '.css', '.scss', '.sass'],
      modules: ['node_modules', path.join(__dirname, '..', '..', 'node_modules'), 'node_modules/slickgrid-es6/dist'],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true,
          },
        },
      },
    },
    output: {
      filename: 'ui/[name].js',
      path: outdir,
    },
  };
};
