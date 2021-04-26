const handler = require('serve-handler')
const http = require('http')
const { startServer, loadConfiguration } = require('snowpack')
const path = require('path')

loadConfiguration(
	{ mode: 'development', devOptions: { hmr: true } },
	path.resolve(__dirname, 'snowpack.config.js'),
)
	.then((config) => startServer({ config }))
	.then((snowpack) => {
		const server = http.createServer(async (request, response) => {
			try {
				const buildResult = await snowpack.loadUrl(request.url)
				response.setHeader('Content-Type', buildResult.contentType)
				response.end(buildResult.contents)
			} catch (err) {
				return handler(request, response, { public: 'src/public' })
			}
		})

		server.listen(3000, () => {
			console.log('Running at http://localhost:3000')
		})
	})
