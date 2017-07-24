const { resolve } = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')



module.exports = {
  entry: {
    'homage': ['./homage/index.ts'],
    'tiles': ['./tiles/index.ts'],
    'experiments/area-light': ['./experiments/area-light/index.ts']
  },

  context: resolve(__dirname, 'src'),

  output: {
    path: resolve(__dirname, 'public'),
    publicPath: '/',
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
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, use: ['raw-loader', 'glslify-loader'], exclude: /node_modules/ },
    ]
  },

  resolve: {
    modules: [
      'node_modules',
      resolve(__dirname, 'libs'),
      resolve(__dirname, 'src')
    ],
    extensions: ['.ts', '.js']
  },

  devtool: 'source-map',

  plugins: [
		// build optimization plugins
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'shared.min.js',
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"',
		}),
		new UglifyJSPlugin({
			sourceMap: true
		})
  ],
}
