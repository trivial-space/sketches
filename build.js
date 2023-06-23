import { build } from 'vite'
import * as glob from 'glob'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function makeBuild() {
	const publicSrcDir = resolve(__dirname, 'src', 'public')

	const apps = await glob.glob('**/index.html', {
		cwd: publicSrcDir,
	})

	await build({
		root: publicSrcDir,
		plugins: [],
		build: {
			assetsDir: '__assets',
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
			plugins: [],
			build: { outDir: resolve(__dirname, 'dist', appDir) },
		})
	}
}

makeBuild()
	.then(() => console.log('done'))
	.catch(console.error)
