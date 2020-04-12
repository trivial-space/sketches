const { resolve } = require('path')
const webpack = require('webpack')
const config = require('./webpack.config')

module.exports = {
	mode: 'development',

	context: config.context,
	module: config.module,
	resolve: config.resolve,
	entry: config.entry,

	output: Object.assign(config.output, {
		hotUpdateChunkFilename: '[id].[hash].hot-update.js',
		hotUpdateMainFilename: '[hash].hot-update.json',
	}),

	devtool: 'cheap-eval-source-map',
	// devtool: 'eval',

	devServer: {
		hot: true,
		// enable HMR on the server

		contentBase: resolve(__dirname, 'public'),
		// match the output path

		publicPath: '/',
		// match the output `publicPath`
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		// enable HMR globally
	],
}
