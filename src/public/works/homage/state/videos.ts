export const names = [
	'tworooms',
	'behindglass',
	'nanofuzz',
	'balloon',
	'threescreens',
]

const videosUrl =
	import.meta.env.MODE === 'production' ? '/assets/videos/' : 'videos/'

const isIOS =
	['iPad', 'iPhone', 'iPod'].some((s) => navigator.userAgent.includes(s)) ||
	// iPad on iOS 13 detection
	(navigator.userAgent.includes('Mac') && 'ontouchend' in document)

const loadTimeout = 2 * 60 * 1000 // 5 minutes

function createVideo(src: string) {
	const video = document.createElement('video')
	video.crossOrigin = 'anonymous'
	video.loop = true
	video.playsInline = true
	video.preload = 'auto'
	video.muted = isIOS
	video.src = src + '.webm'

	return video
}

export const videos = names
	.map((name) => createVideo(videosUrl + name))
	.map(
		(v) =>
			new Promise<HTMLVideoElement>((res, rej) => {
				const t = setTimeout(() => {
					console.log('timeout', v)
					finish(false)
				}, loadTimeout)

				const i = setInterval(() => {
					if (v.readyState > 2) {
						finish(true)
					}
				}, 1000)

				const finish = (loaded: boolean) => {
					clearTimeout(t)
					clearInterval(i)
					v.removeEventListener('canplay', success)
					v.removeEventListener('canplaythrough', success)
					if (loaded) {
						console.log('loaded', v)
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
	)
