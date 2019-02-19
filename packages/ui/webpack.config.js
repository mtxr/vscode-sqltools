const path = require('path');

const outdir = path.resolve(__dirname, '..', '..', '..', 'dist');

module.exports = exports = function getWebviewConfig(env) {
  return {
    name: 'webiew',
    mode: env.production ? 'production' : 'development',
    entry: {
      Settings: path.join(__dirname, 'screens', 'Settings.tsx'),
      Results: path.join(__dirname, 'screens', 'Results.tsx'),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            'babel-loader',
            { loader: 'ts-loader', options: { transpileOnly: true } }
        ],
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
    output: {
      filename: 'ui/[name].js',
      path: outdir
    },
    plugins: [
    ]
  };
}
