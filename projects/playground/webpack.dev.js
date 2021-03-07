const { resolve } = require('path')
const webpack = require('webpack')
const config = require('./webpack.config')

module.exports = {
	entry: config.entry,
	output: config.output,
	context: config.context,
	module: config.module,
	resolve: config.resolve,

	mode: 'development',

	devtool: 'eval-cheap-module-source-map',
	// devtool: 'eval',

	devServer: {
		hotOnly: true,
		// enable HMR on the server

		contentBase: resolve(__dirname, 'public'),
		// match the output path

		publicPath: '/',
		// match the output `publicPath`
	},
}
