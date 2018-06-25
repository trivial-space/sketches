const { resolve } = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')



module.exports = {
	entry: {
		'boilerplate': ['./boilerplate/index.ts'],
		// 'homage': ['./homage/index.ts'],
		// 'tiles': ['./tiles/index.ts'],
		'colorwalls': ['./colorwalls/index.ts'],
		'experiments/area-light': ['./experiments/area-light/index.ts'],
		'experiments/graph-sort': ['./experiments/graph-sort/index.ts'],
		'experiments/convex-hull': ['./experiments/convex-hull/index.ts']
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
			'src'
		],
		extensions: ['.ts', '.js']
	},

	devtool: 'source-map',

	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"',
		}),
		new UglifyJSPlugin({
			sourceMap: true
		})
	],
}
