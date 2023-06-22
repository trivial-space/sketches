import { defineConfig } from 'vite'
import { directoryPlugin } from 'vite-plugin-list-directory-contents'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = defineConfig(async () => {
	return {
		root: 'src/public',
		plugins: [
			directoryPlugin({ baseDir: path.resolve(__dirname, 'src/public') }),
		],
		server: {
			port: 8000,
		},
	}
})

export default config
