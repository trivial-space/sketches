import {asyncStream, asyncStreamStart, addToFlow} from './flow'
import {keyboard} from 'tvs-libs/lib/events/keyboard'
import {mouse as getMouse, MouseState} from 'tvs-libs/lib/events/mouse'
import {windowSize as getWindowSize} from 'tvs-libs/lib/events/dom'
import {animateWithTPF} from 'tvs-libs/lib/utils/animation'
import * as init from './state/init'


export const windowSize = asyncStreamStart(getWindowSize)

export const mouse = asyncStreamStart(getMouse)

export const keys = asyncStreamStart(keyboard)


export const tick = asyncStream(
  [init.images.HOT],
  animateWithTPF
).isEvent()


export const mouseDrag = asyncStream(
  [mouse.COLD, tick.HOT],
  (send, mouse: MouseState) => {
    if (!mouse) return
    if (mouse.dragDelta.x || mouse.dragDelta.y) {
      send({x: mouse.dragDelta.x, y: mouse.dragDelta.y})
    }
    mouse.dragDelta.x = mouse.dragDelta.y = 0
  }
).isEvent()


addToFlow({
  tick,
  windowSize,
  mouse,
  mouseDrag,
  keys
}, 'events')
