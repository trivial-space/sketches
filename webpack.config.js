const { resolve } = require('path');
const webpack = require('webpack');

const hotCodeEntry = [
  'webpack-dev-server/client?http://localhost:8080',
  'webpack/hot/only-dev-server'
]

module.exports = {
  entry: {
    'homage': [...hotCodeEntry, './homage/index.ts'],
    'tiles': [...hotCodeEntry, './tiles/index.ts']
  },

  context: resolve(__dirname, 'src'),

  output: {
    path: resolve(__dirname, 'public'),
    filename: '[name]/main.js'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?modules',
          'postcss-loader',
        ],
      },
      { test: /\.ts$/, use: 'ts-loader' },
      { test: /\.(glsl|frag|vert)$/, use: ['raw-loader', 'glslify-loader'], exclude: /node_modules/ },
    ]
  },

  resolve: {
    modules: [
      'node_modules',
      resolve(__dirname, 'src')
    ],
    extensions: ['.ts', '.js']
  },

  devtool: 'inline-source-map',

  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: resolve(__dirname, 'public'),
    // match the output path

    publicPath: '/'
    // match the output `publicPath`
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates
  ],
};
