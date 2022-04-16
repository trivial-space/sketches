import { defineConfig } from 'vite'
import glslify from 'vite-plugin-glslify'

const config = defineConfig(async () => {
	return {
		root: 'src/public',
		plugins: [glslify()],
	}
})

export default config
