/* eslint-disable import/no-extraneous-dependencies */
import { exec } from 'node:child_process'
import chokidar from 'chokidar'
import _ from 'lodash'

const pathToWatch = process.argv[2]

console.log(pathToWatch, process.cwd())

if (!pathToWatch) throw 'you must provide a path to a crate to watch'

const watcher = chokidar.watch(pathToWatch + '/**/*.rs')

function onWatch(path) {
	console.log('on rust change', path)
	exec(
		`npx wasm-pack build --target web --no-pack ${pathToWatch}`,
		(err, stdout, stderr) => {
			if (err) {
				console.error('something bad happend!', err)
				return
			}

			// the *entire* stdout and stderr (buffered)
			stdout && console.log(`stdout: ${stdout}`)
			stderr && console.log(`stderr: ${stderr}`)
		},
	)
}

const watchListener = _.debounce(onWatch, 300)

watcher.on('change', watchListener)
watcher.on('add', watchListener)
watcher.on('unlink', watchListener)
