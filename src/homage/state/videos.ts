export const names = [
	'tworooms',
	'behindglass',
	'nanofuzz',
	'balloon',
	'threescreens'
]

const videosUrl =
	process.env.NODE_ENV === 'production'
		? '//s3.eu-central-1.amazonaws.com/trivialspace.net/tvs1/'
		: 'videos/'

const loadTimeout = 60000

function createVideo(src: string) {
	const video = document.createElement('video')
	video.crossOrigin = 'anonymous'
	video.loop = true
	;(video as any).playsinline = true
	video.autoplay

	const source1 = document.createElement('source')
	source1.src = src + '.webm'
	source1.type = 'video/webm'

	const source2 = document.createElement('source')
	source2.src = src + '.mp4'
	source2.type = 'video/mp4'

	video.appendChild(source1)
	video.appendChild(source2)
	return video
}

export const videos = Promise.all(
	names
		.map(name => createVideo(videosUrl + name))
		.map(
			v =>
				new Promise<HTMLVideoElement>((res, rej) => {
					const t = setTimeout(() => {
						console.log('timeout', v)
						rej('Video timeout ' + v)
					}, loadTimeout)

					v.addEventListener('canplay', () => {
						res(v)
						clearTimeout(t)
						console.log('loaded', v)
					})
				})
		)
)
