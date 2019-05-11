const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'client'),
  entry: {
    app: './app.js',
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
        use: [{
          loader: 'babel-loader',
          options: {
            sourceType: 'module',
          }
        }],
      },
    ],
  },
};