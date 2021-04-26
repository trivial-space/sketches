/** @type {import("snowpack").SnowpackUserConfig } */
const path = require('path')

module.exports = {
	root: './src/public',
	workspaceRoot: '../..',
	plugins: ['snowpack-plugin-glslify'],
	buildOptions: { out: path.resolve(__dirname, 'public') },
}
