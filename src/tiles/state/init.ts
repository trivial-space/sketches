import { normalRand } from 'tvs-libs/dist/lib/math/random'
import { pickRandom, map } from 'tvs-libs/dist/lib/utils/sequence'
import * as constants from './constants'


export const tileSize = 10

export const tileDensity = 11

export const color = [normalRand(), normalRand(), normalRand()]

export const set = pickRandom(constants.sets)

export const images = map(() => new Image(), set)

export const imagesLoaded = Promise.all(
	Object.values(map((img, key) => new Promise(res => {
		img.onload = res
		img.src = 'img/' + constants.specs[key].file + '.jpg'
	}), images))
)
