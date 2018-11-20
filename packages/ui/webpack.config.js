const path = require('path');

const outdir = path.resolve(__dirname, '..', '..', 'dist');

module.exports = exports = function getWebviewConfig(env) {
  return {
    name: 'webiew',
    mode: env.production ? 'production' : 'development',
    entry: {
      settingsEditor: path.join(__dirname, 'settings-editor.tsx'),
      queryResultsPreviewer: path.join(__dirname, 'query-results-previewer.tsx'),
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
    ]
  };
}
