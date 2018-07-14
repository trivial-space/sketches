import { mat4 } from 'gl-matrix'
import { times } from 'tvs-libs/lib/utils/sequence'
import { normalRand } from 'tvs-libs/dist/lib/math/random'
import { State } from './types'
import { addSystem, set } from 'shared-utils/painterState'
import { events } from 'boilerplate/context'


export class Quad {
	transform = mat4.create()
	color = times(normalRand, 3)
	update (tpf: number) {
		mat4.rotateY(this.transform, this.transform, tpf * 0.03)
	}
}


export class Entities {
	quad = new Quad()
}


addSystem<State>('entities', (e, s) => {
	const en = s.entities
	switch (e) {

		case events.FRAME:
			const tpf = s.device.tpf
			en.quad.update(tpf)
			return
	}
})


set<State>('entities', new Entities())

if (module.hot) module.hot.accept()
