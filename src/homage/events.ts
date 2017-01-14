import {val, stream, asyncStream, asyncStreamStart, addToFlow} from './flow'
import {keyboard} from 'tvs-libs/lib/events/keyboard'
import {mouse as getMouse, MouseState} from 'tvs-libs/lib/events/mouse'
import {windowSize as getWindowSize} from 'tvs-libs/lib/events/dom'
import {animateWithTPF} from 'tvs-libs/lib/utils/animation'
import {videos} from './videos'


export const tick = asyncStream([videos.HOT], animateWithTPF)


export const tickStep = val(2)

export const tickCounter = val(0)
  .react(
    [tickStep.HOT, tick.HOT],
    (self, max) => self === max ? 0 : self + 1
  )

export const slowTick = stream(
  [tickCounter.HOT],
  cnt => cnt === 0 ? true : null
)

export const windowSize = asyncStreamStart(getWindowSize)

export const mouse = asyncStreamStart(getMouse)

export const keys = asyncStreamStart(keyboard)


export const mouseDrag = asyncStream(
  [mouse.COLD, tick.HOT],
  (send, mouse: MouseState) => {
    if (mouse.dragDelta.x || mouse.dragDelta.y) {
      send({x: mouse.dragDelta.x, y: mouse.dragDelta.y})
    }
    mouse.dragDelta.x = mouse.dragDelta.y = 0
  }
)


addToFlow({
  tick,
  tickStep,
  tickCounter,
  slowTick,
  windowSize,
  mouse,
  mouseDrag,
  keys
}, 'events')
