import {entity, addToFlow} from './flow'
import {keyboard} from 'tvs-libs/lib/events/keyboard'
import {mouse as getMouse, MouseState} from 'tvs-libs/lib/events/mouse'
import {windowSize as getWindowSize} from 'tvs-libs/lib/events/dom'
import {animateWithTPF} from 'tvs-libs/lib/utils/animation'
import * as init from './state/init'


export const tick = entity()
  .isEvent()
  .stream({
    async: true,
    with: {
      imgs: init.images.HOT
    },
    do: (_, send) => animateWithTPF(send)
  })


export const windowSize = entity()
  .stream({
    async: true,
    autostart: true,
    do: (_, send) => getWindowSize(send)
  })


export const mouse = entity()
  .stream({
    async: true,
    autostart: true,
    do: (_, send) => getMouse(send)
  })


export const mouseDrag = entity()
  .isEvent()
  .stream({
    async: true,
    with: {
      tick: tick.HOT,
      mouse: mouse.COLD
    },
    do: ({mouse}: {mouse: MouseState}, send) => {

      if (!mouse) return
      if (mouse.dragDelta.x || mouse.dragDelta.y) {
        send({x: mouse.dragDelta.x, y: mouse.dragDelta.y})
      }
      mouse.dragDelta.x = mouse.dragDelta.y = 0
    }
  })


export const keys = entity()
  .stream({
    autostart: true,
    async: true,
    do: (_, send) => keyboard(send)
  })


addToFlow({
  tick,
  windowSize,
  mouse,
  mouseDrag,
  keys
}, 'events')
