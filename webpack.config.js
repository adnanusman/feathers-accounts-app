const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
      compress: true,
      disableHostCheck: true
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
    plugins: (function() {
      let plugins = [];

      plugins.push(
        new Dotenv({
          systemvars: true
        }),
        new OptimizeCSSAssetsPlugin()
      )

      if(env.NODE_ENV !== 'development') {
        plugins.push(
          new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            parallel: true,
            terserOptions: {
              mangle: true,
            }
          }),  
          new CompressionPlugin({
            algorithm: 'gzip'
          })  
        )
      }

      return plugins;
    })()
  }
};