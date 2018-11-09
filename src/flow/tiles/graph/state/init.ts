import {
	val,
	stream,
	asyncStream,
	EntityRef
} from 'tvs-flow/dist/lib/utils/entity-reference'
import { normalRand } from 'tvs-libs/dist/lib/math/random'
import { pickRandom } from 'tvs-libs/dist/lib/utils/sequence'
import * as constants from './constants'

export const tileSize = val(10)

export const tileDensity = val(11)

export const color = val([normalRand(), normalRand(), normalRand()])

export const set = stream([constants.sets.HOT], pickRandom)

export const images: EntityRef<[string, HTMLImageElement][]> = asyncStream(
	[constants.specs.HOT, set.HOT],
	(send, specs, set) => {
		Promise.all(
			Object.keys(set).map(
				key =>
					new Promise<[string, HTMLImageElement]>(res => {
						const img = new Image()
						img.onload = () => {
							res([key, img])
						}
						img.src = 'img/' + specs[key].file + '.jpg'
					})
			)
		).then(send)
	}
)
