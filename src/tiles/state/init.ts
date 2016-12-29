import {normalRand} from 'tvs-libs/lib/math/core'
import {val, stream, asyncStream, addToFlow} from '../flow'
import {pick} from 'tvs-libs/lib/utils/sequence'
import * as constants from './constants'


export const tileSize = val(10)

export const tileDensity = val(11)


export const color = val( [normalRand(), normalRand(), normalRand()] )


export const set = stream( [constants.sets.HOT], pick )


export const images = asyncStream(
  [constants.specs.HOT, set.HOT],
  (send, specs, set) => {

    Promise.all(Object.keys(set).map(key => new Promise(res => {
      const img = new Image()
      img.onload = () => {res([key, img])}
      img.src = 'img/' + specs[key].file + '.jpg'
    })))
    .then(send)

  }
)


addToFlow({
  tileSize,
  tileDensity,
  color,
  set,
  images
}, 'state.init')
