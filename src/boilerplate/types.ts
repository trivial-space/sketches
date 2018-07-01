import { ViewPort } from './camera'
import { MouseState } from 'tvs-libs/dist/lib/events/mouse'
import { KeyState } from 'tvs-libs/dist/lib/events/keyboard'
import { Entities } from './state'


export interface State {
	viewPort: ViewPort,
	input: {
		mouse: MouseState,
		keys: KeyState
	}
	entities: Entities
}
