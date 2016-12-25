import {entity, addToFlow} from './flow'



export const names = entity([
  "tworooms",
  "behindglass",
  "nanofuzz",
  "balloon",
  "threescreens"
])


export const createVideo = entity(src => {
  const video = document.createElement('video')
  video.crossOrigin = "anonymous"
  video.loop = true

  const source1 = document.createElement('source')
  source1.src = src + ".webm"
  source1.type = "video/webm"

  const source2 = document.createElement('source')
  source2.src = src + ".mp4"
  source2.type = "video/mp4"

  video.appendChild(source1)
  video.appendChild(source2)
  return video
})


//export const videosUrl = entity("//s3.eu-central-1.amazonaws.com/trivialspace.net/tvs1/")
export const videosUrl = entity("/videos/")


export const loadTimeout = entity(60000)


export const videos = entity()
    .stream({
      async: true,
      with: {
        names: names.HOT,
        timeout: loadTimeout.HOT,
        url: videosUrl.HOT,
        createVideo: createVideo.HOT
      },
      do: ({names, createVideo, url, timeout}, send) => {

        Promise.all<HTMLVideoElement>(
          names
            .map(name => createVideo(url + name))
            .map((v: HTMLVideoElement) => new Promise((res, rej) => {
              const t = setTimeout(() => {
                console.log('timeout', v)
                rej("Video timeout " + v)
              }, timeout)

              v.addEventListener('canplay', () => {
                res(v)
                clearTimeout(t)
                console.log('loaded', v)
              })
            }))

        ).then(vs =>
          names.reduce((videos, n, i) => {
            const v = vs[i]
            v.play()
            videos[n] = v
            return videos
          }, {})

        ).then(send)

      }
    })


addToFlow({
  names,
  createVideo,
  videosUrl,
  loadTimeout,
  videos
}, 'videos')
