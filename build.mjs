import { build } from 'vite'
import glob from 'glob'
import { promisify } from 'util'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { glslify } from 'vite-plugin-glslify'

// @ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(glslify)

async function makeBuild() {
	const publicSrcDir = resolve(__dirname, 'src', 'public')

	const apps = await promisify(glob.glob)('**/index.html', {
		cwd: publicSrcDir,
	})

	await build({
		root: publicSrcDir,
		plugins: [glslify()],
		build: {
			rollupOptions: {
				input: apps.reduce((entries, entry, i) => {
					entries[i] = resolve(publicSrcDir, entry)
					return entries
				}, {}),
			},
			outDir: resolve(__dirname, 'public'),
		},
	})

	for (const app of apps) {
		const appDir = dirname(app)

		await build({
			root: resolve(publicSrcDir, appDir),
			plugins: [glslify()],
			build: { outDir: resolve(__dirname, 'dist', appDir) },
		})
	}
}

makeBuild()
