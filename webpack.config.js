const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = env => {
  return { 
    context: path.join(__dirname, 'client'),
    mode: env.NODE_ENV,
    entry: {
      app: ['@babel/polyfill', './app.js'],
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './public',
      port: process.env.PORT || 9000,
      compress: true
    },
    output: {
      path: path.join(__dirname, 'public/'),
      filename: '[name].bundle.js',
    },
    module: {
      rules: [
        {
          // babelify the js and jsx filetypes.
          test: /\.js|.jsx?$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              sourceType: 'module',
            }
          }],
        },
        {
          // inject css files into the html
          test: /\.css/,
          use: [
            'style-loader',
            'css-loader'
          ]
        }
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'async',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [
      new Dotenv()
    ]
  }
};