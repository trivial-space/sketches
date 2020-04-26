import { get, dispatch } from '../../shared-utils/painterState'
import { painter, events, state } from './context'
import { repeat } from '../../shared-utils/scheduler'
import { scene, noiseFrame, noiseTex2Frame, lineTexFrame } from './renderer'

repeat(tpf => {
	const d = state.device
	d.tpf = tpf
	dispatch(events.FRAME)
	painter
		.compose(noiseFrame, noiseTex2Frame, lineTexFrame, scene)
		.display(scene)
}, 'loop')
