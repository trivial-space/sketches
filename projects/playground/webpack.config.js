const { resolve } = require('path')

module.exports = {
	entry: {
		boilerplate: ['./boilerplate/index.ts'],
		homage: ['./homage/index.ts'],
		tiles: ['./tiles/index.ts'],
		colorwalls: ['./colorwalls/index.ts'],
		aquarell: ['./aquarell/index.ts'],
		stroke: ['./stroke/index.ts'],
		squeegee: ['./squeegee/index.ts'],
		'experiments/area-light': ['./experiments/area-light/index.ts'],
		'experiments/graph-sort': ['./experiments/graph-sort/index.ts'],
		'experiments/convex-hull': ['./experiments/convex-hull/index.ts'],
		'experiments/game-of-life': ['./experiments/game-of-life/index.ts'],
		'experiments/textures': ['./experiments/textures/index.ts'],
		'experiments/pointer-events': ['./experiments/pointer-events/index.ts'],
		'experiments/lines': ['./experiments/lines/index.ts'],
	},

	mode: 'production',

	context: resolve(__dirname, 'src'),

	output: {
		path: resolve(__dirname, 'public'),
		publicPath: '/',
		filename: '[name]/main.js',
	},

	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader?modules', 'postcss-loader'],
			},
			{
				test: /\.ts$/,
				use: ['ts-loader'],
				exclude: /node_modules/,
			},
			{
				test: /\.(glsl|frag|vert)$/,
				type: 'asset/source',
				use: 'glslify-loader',
				exclude: /node_modules/,
			},
		],
	},

	resolve: {
		extensions: ['.ts', '.js'],
	},

	devtool: 'source-map',
}
