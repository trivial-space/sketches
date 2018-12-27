const {
	resolve
} = require('path')

module.exports = {
	entry: {
		'boilerplate': ['./boilerplate/index.ts'],
		'homage': ['./homage/index.ts'],
		'tiles': ['./tiles/index.ts'],
		'colorwalls': ['./colorwalls/index.ts'],
		'aquarell': ['./aquarell/index.ts'],
		'experiments/area-light': ['./experiments/area-light/index.ts'],
		'experiments/graph-sort': ['./experiments/graph-sort/index.ts'],
		'experiments/convex-hull': ['./experiments/convex-hull/index.ts'],
		'experiments/game-of-life': ['./experiments/game-of-life/index.ts'],
		'experiments/textures': ['./experiments/textures/index.ts']
	},

	mode: 'production',

	context: resolve(__dirname, 'src'),

	output: {
		path: resolve(__dirname, 'public'),
		publicPath: '/',
		filename: '[name]/main.js'
	},

	module: {
		rules: [{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader?modules',
					'postcss-loader',
				],
			},
			{
				test: /\.ts$/,
				use: ['ts-loader', 'webpack-module-hot-accept'],
				exclude: /node_modules/
			},
			{
				test: /\.(glsl|frag|vert)$/,
				use: ['raw-loader', 'glslify-loader'],
				exclude: /node_modules/
			},
		]
	},

	resolve: {
		modules: [
			'node_modules',
			'src'
		],
		extensions: ['.ts', '.js']
	},

	devtool: 'source-map'
}
