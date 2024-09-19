export const names = [
	'tworooms',
	'behindglass',
	'nanofuzz',
	'balloon',
	'threescreens',
]

const videosUrl =
	import.meta.env.MODE === 'production'
		? 'https://assets.trivialspace.net/videos/'
		: 'videos/'

const loadTimeout = 5 * 60 * 1000 // 5 minutes

function createVideo(src: string) {
	const video = document.createElement('video')
	video.crossOrigin = 'anonymous'
	video.loop = true
	video.playsInline = true
	video.autoplay = true
	video.muted = true
	video.preload = 'auto'

	const source1 = document.createElement('source')
	source1.src = src + '.webm'
	source1.type = 'video/webm'

	const source2 = document.createElement('source')
	source2.src = src + '.mp4'
	source2.type = 'video/mp4'

	video.appendChild(source1)
	video.appendChild(source2)

	console.log(video)
	return video
}

export const videos = Promise.all(
	names
		.map((name) => createVideo(videosUrl + name))
		.map(
			(v) =>
				new Promise<HTMLVideoElement>((res, rej) => {
					const t = setTimeout(() => {
						console.log('timeout', v)
						finish(false)
					}, loadTimeout)

					const i = setInterval(() => {
						if (v.readyState >= 4) {
							finish(true)
						}
					}, 1000)

					const finish = (loaded: boolean) => {
						clearTimeout(t)
						clearInterval(i)
						v.removeEventListener('canplay', success)
						v.removeEventListener('canplaythrough', success)
						if (loaded) {
							res(v)
						} else {
							rej('Video failed to load ' + v)
						}
					}

					const success = () => finish(true)

					v.addEventListener('canplay', success)
					v.addEventListener('canplaythrough', success)

					v.load()
				}),
		),
)
