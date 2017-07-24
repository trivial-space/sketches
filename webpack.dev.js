const { resolve } = require('path')
const webpack = require('webpack')
const config = require('./webpack.config')


const hotCodeEntry = [
	'webpack-dev-server/client?http://localhost:8080',
	'webpack/hot/only-dev-server'
]

const entry = Object.keys(config.entry).reduce((entries, key) => {
	entries[key] = hotCodeEntry.concat(config.entry[key])
	return entries
}, {})

module.exports = {
	context: config.context,
	module: config.module,
	resolve: config.resolve,

	entry: entry,

	output: Object.assign({}, config.output, {
		hotUpdateChunkFilename: "[id].[hash].hot-update.js",
		hotUpdateMainFilename: "[hash].hot-update.json"
	}),

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
}
