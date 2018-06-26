const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: { main: './src/index.js' },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
};
