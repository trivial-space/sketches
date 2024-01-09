import { partial } from 'tvs-libs/dist/fp/core'
import { doTimes } from 'tvs-libs/dist/utils/sequence'
import {
	directionForce,
	springForce,
} from '../../../../shared-utils/physics/constraints'
import { createParticle3D } from '../../../../shared-utils/physics/particle'

export const p1 = createParticle3D({ pos: [10, 50, 0], damping: 1, mass: 10 })
export const p2 = createParticle3D({ pos: [20, 50, 0], damping: 1 })
export const p3 = createParticle3D({ pos: [30, 50, 0], damping: 1 })

export const anchor = [0, 50, 0]
const particles = [p1, p2, p3]

const gravity = directionForce(0.001, [0, -1, 0])

const springStrength = 0.1
const springLength = 10

const spring = partial(springForce, springLength, springStrength)

export function update(tpf: number) {
	const steps = Math.floor(tpf / 4)
	doTimes(step, steps)
}

function step() {
	particles.forEach((p) => p.applyForce(gravity))

	p1.applyForce(spring(anchor, p1.pos))
	p1.applyForce(spring(p2.pos, p1.pos))

	p2.applyForce(spring(p1.pos, p2.pos))
	p2.applyForce(spring(p3.pos, p2.pos))

	p3.applyForce(spring(p2.pos, p3.pos))

	particles.forEach((p) => p.accelerate())
}
