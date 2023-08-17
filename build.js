import { build } from 'vite'
import * as glob from 'glob'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'
import * as cheerio from 'cheerio'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function makeBuild() {
	const publicSrcDir = resolve(__dirname, 'src', 'public')

	const apps = await glob.glob('**/index.html', {
		cwd: publicSrcDir,
	})

	// regenerate public index.html

	const indexHtml = await readFile(resolve(publicSrcDir, 'index.html'), 'utf-8')
	const $ = cheerio.load(indexHtml)
	$('ul').html(
		apps
			.filter((a) => a !== 'index.html')
			.map((a) => a.replace(/\/index\.html$/, ''))
			.sort((a, b) => a.localeCompare(b))
			.map((a) => `<li><a href="/${a}/">${a}</a></li>`)
			.join('\n'),
	)
	await writeFile(resolve(publicSrcDir, 'index.html'), $.html())

	// build complete repo as one app

	if (!process.argv.includes('--skip-main')) {
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
	}

	// build each sketch individually

	if (process.argv.includes('-a') || process.argv.includes('--all')) {
		for (const app of apps) {
			const appDir = dirname(app)

			await build({
				root: resolve(publicSrcDir, appDir),
				plugins: [],
				build: { outDir: resolve(__dirname, 'dist', appDir) },
			})
		}
	}
}

makeBuild()
	.then(() => console.log('done'))
	.catch(console.error)
