import {normalRand} from 'tvs-libs/lib/math/core'
import {entity, addToFlow} from '../flow'
import {pick} from 'tvs-libs/lib/utils/sequence'
import * as constants from './constants'


export const tileSize = entity(10)

export const tileDensity = entity(11)


export const color = entity( [normalRand(), normalRand(), normalRand()] )


export const set = entity()
  .stream({
    with: {
      sets: constants.sets.HOT
    },
    do: ({sets}) => pick(sets)
  })


export const images = entity()
  .stream({
    async: true,
    with: {
      set: set.HOT,
      specs: constants.specs.HOT
    },
    do: ({specs, set}, send) => {

      Promise.all(Object.keys(set).map(key => new Promise(res => {
        const img = new Image()
        img.onload = () => {res([key, img])}
        img.src = 'img/' + specs[key].file + '.jpg'
      })))
      .then(send)
    }
  })


addToFlow({
  tileSize,
  tileDensity,
  color,
  set,
  images
}, 'state.init')
