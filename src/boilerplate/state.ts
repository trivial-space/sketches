import { mat4 } from 'gl-matrix'
import { addSystem, set } from 'shared-utils/painterState'
import { normalRand } from 'tvs-libs/dist/math/random'
import { times } from 'tvs-libs/lib/utils/sequence'
import { events, State } from './context'

export class Quad {
	transform = mat4.create()
	color = times(normalRand, 3)
	update(tpf: number) {
		mat4.rotateY(this.transform, this.transform, tpf * 0.003)
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

set<State>('entities', new Entities(), { reset: { quad: { color: true } } })
