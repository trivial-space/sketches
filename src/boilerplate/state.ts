import { mat4 } from 'gl-matrix'
import { times } from 'tvs-libs/lib/utils/sequence'
import { state } from './context'
import { normalRand } from 'tvs-libs/dist/lib/math/random'


export class Quad {
	transform = mat4.create()
	color = times(normalRand, 3)
	update (tpf: number) {
		mat4.rotateY(this.transform, this.transform, tpf * 0.0003)
	}
}


export class Entities {
	quad = new Quad()
	update (tpf: number) {
		this.quad.update(tpf)
	}
}


state.entities = new Entities()

if (module.hot) {
	module.hot.accept()
}
