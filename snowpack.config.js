const path = require('path')

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	root: './src/public',
	workspaceRoot: '.',
	plugins: ['snowpack-plugin-glslify'],
	buildOptions: { out: path.resolve(__dirname, 'public') },
}
