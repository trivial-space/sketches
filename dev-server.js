const handler = require('serve-handler')
const http = require('http')
const { createServer } = require('vite')

createServer().then((vite) => {
	const server = http.createServer(async (request, response) => {
		try {
			if (await vite.transformRequest(request.url)) {
				return vite.middlewares(request, response)
			} else {
				throw 'error'
			}
		} catch (err) {
			return handler(request, response, { public: 'src/public' })
		}
	})

	server.listen(8000, () => {
		console.log('Trivialspace Dev Server Running at http://localhost:8000')
	})
	vite.listen(8001)
})
