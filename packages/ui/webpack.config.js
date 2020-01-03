const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const babelOptions = require(path.join(__dirname, '.babelrc'));

const IS_DEV = process.env.NODE_ENV !== 'production';

module.exports = exports = function getWebviewConfig(outdir) {
  return {
    name: 'ui',
    entry: {
      Settings: path.join(__dirname, 'screens', 'Settings.tsx'),
      Results: path.join(__dirname, 'screens', 'Results.tsx'),
      theme: path.join(__dirname, 'sass', 'theme.scss'),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            { loader: 'babel-loader', options: babelOptions },
            { loader: 'ts-loader', options: { transpileOnly: true } },
          ],
          // exclude: /[\\/]node_modules[\\/]/,
        },
        {
          test: /\.css/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: IS_DEV,
              },
            },
            'css-loader'
          ],
          // exclude: /[\\/]node_modules[\\/]/,
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: IS_DEV,
              },
            },
            'css-loader',
            'sass-loader'
          ],
          // exclude: /[\\/]node_modules[\\/]/,
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader:'file-loader',
              options: {
                outputPath: 'ui',
                name: '[path][name].[ext]',
              },
            }
          ]
        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json', '.css', '.scss', '.sass'],
      modules: ['node_modules', path.join(__dirname, '..', '..', 'node_modules')],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /(?!theme)/,
            name: 'commons',
            chunks (chunk) {
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
      path: outdir,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'ui/[name].css',
        chunkFilename: 'ui/[name].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
    ],
  };
};
