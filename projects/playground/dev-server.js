const handler = require('serve-handler')
const http = require('http')
const { startServer, loadConfiguration } = require('snowpack')
const path = require('path')

loadConfiguration(
	{ mode: 'development', devOptions: { hmr: true, port: 8001 } },
	path.resolve(__dirname, 'snowpack.config.js'),
)
	.then((config) => startServer({ config }))
	.then((snowpack) => {
		const server = http.createServer(async (request, response) => {
			try {
				const buildResult = await snowpack.loadUrl(request.url)
				if (buildResult.contentType) {
					response.setHeader('Content-Type', buildResult.contentType)
				}
				response.end(buildResult.contents)
			} catch (err) {
				return handler(request, response, { public: 'src/public' })
			}
		})

		server.listen(8000, () => {
			console.log('Trivialspace Dev Server Running at http://localhost:8000')
		})
	})
