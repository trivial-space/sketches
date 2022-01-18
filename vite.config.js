import { defineConfig } from 'vite'
import glslify from 'vite-plugin-glslify'
import { glob } from 'glob'
import { promisify } from 'util'
import { resolve } from 'path'

const config = defineConfig(async () => {
	const apps = await promisify(glob)('src/public/**/index.html')
	return {
		root: 'src/public',
		plugins: [glslify()],
		build: {
			rollupOptions: {
				input: apps.reduce((entries, entry, i) => {
					entries[i] = resolve(__dirname, entry)
					return entries
				}, {}),
			},
			outDir: resolve(__dirname, 'public'),
		},
	}
})

export default config
