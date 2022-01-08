import { mat4 } from 'gl-matrix'
import { normalRand } from 'tvs-libs/dist/math/random'
import { times } from 'tvs-libs/dist/utils/sequence'
import { events, Q } from './context'

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

Q.listen('entities', events.FRAME, (s) => {
	const en = s.entities
	const tpf = s.device.tpf
	en.quad.update(tpf)
})

Q.set('entities', new Entities(), { reset: { quad: { color: true } } })
