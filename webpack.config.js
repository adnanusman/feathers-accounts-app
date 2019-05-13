const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'client'),
  mode: 'development',
  entry: {
    app: ['@babel/polyfill', './app.js'],
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    port: 9000,
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
};