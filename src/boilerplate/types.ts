import { BaseState } from 'shared-utils/painterState'
import { ViewPort } from './camera'
import { Entities } from './state'

export interface State extends BaseState{
	viewPort: ViewPort
	entities: Entities
}
