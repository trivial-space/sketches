import { val, EntityRef, asyncStream } from 'tvs-flow/dist/lib/utils/entity-reference'


export function createVideo (src: string) {
	const video = document.createElement('video')
	video.crossOrigin = 'anonymous'
	video.loop = true

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


export const names = val([
	'tworooms',
	'behindglass',
	'nanofuzz',
	'balloon',
	'threescreens'
])


//export const videosUrl = val("//s3.eu-central-1.amazonaws.com/trivialspace.net/tvs1/")
export const videosUrl = val('videos/')


export const loadTimeout = val(60000)


export const videos: EntityRef<HTMLVideoElement[]> = asyncStream([
	names.HOT,
	loadTimeout.HOT,
	videosUrl.HOT
],
	(send, names, timeout, url) => {

		Promise.all<HTMLVideoElement>(
			names
				.map(name => createVideo(url + name))
				.map((v: HTMLVideoElement) => new Promise((res, rej) => {
					const t = setTimeout(() => {
						console.log('timeout', v)
						rej('Video timeout ' + v)
					}, timeout)

					v.addEventListener('canplay', () => {
						res(v)
						v.play()
						clearTimeout(t)
						console.log('loaded', v)
					})
				}))

		).then(send)
	}
)
