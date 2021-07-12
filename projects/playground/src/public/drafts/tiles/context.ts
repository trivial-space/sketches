import {
	baseEvents,
	BaseState,
	getPainterContext,
} from '../../shared-utils/painterState'
import { Tiles } from './state/tiles'
import { ViewPort } from './viewport'

export interface State extends BaseState {
	viewPort: ViewPort
	tiles: Tiles
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<State>(canvas)

export const events = {
	...baseEvents,
	INIT: 'init',
	ON_IMAGES_LOADED: 'on_image_loaded',
	NEW_ACTIVE_TILES: 'new_active_tiles',
}
