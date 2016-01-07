'use strict';

var HtmlWepbackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;

module.exports = {
  context: '.',
  entry: './src',
  output: {
    path: 'dist',
    filename: '[hash].js',
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /jquery/,
        loader: 'exports-loader?jQuery!script-loader',
      },
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'baggage-loader?[file].styl',
      },
      {
        test: /\.styl/,
        loader: 'style-loader!css-loader!stylus-loader',
      },
      {
        test: /\.png/,
        loader: 'file-loader',
      }
    ],
  },
  plugins: [
    new HtmlWepbackPlugin('index.html'),
    new UglifyJsPlugin(),
  ],
};
