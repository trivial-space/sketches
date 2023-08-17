import { defineConfig } from 'vite'

const config = defineConfig(async () => {
	return {
		root: 'src/public',
		plugins: [],
		server: {
			port: 8000,
		},
	}
})

export default config
