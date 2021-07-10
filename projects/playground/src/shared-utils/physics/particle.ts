import { add, div, mul, vec, Vec } from '../../../../libs/dist/math/vectors'

export interface ParticleData {
	pos: Vec
	vel: Vec
	force: Vec
	mass: number
	inertia: number
}

export class Particle implements ParticleData {
	pos!: Vec
	vel!: Vec
	force!: Vec
	mass: number = 1
	inertia: number = 1

	addForce(newForce: Vec) {
		const { force } = this
		add(force, newForce, force)
	}

	applyForce() {
		const { vel, pos, force, mass, inertia } = this
		if (mass !== 1) {
			div(mass, force, force)
		}
		add(vel, force, vel)
		if (inertia !== 1) {
			mul(inertia, vel, vel)
		}
		add(pos, vel, pos)
		mul(0, force, force)
	}
}

export function makeParticle2D({
	pos,
	vel,
	force,
	mass = 1,
	inertia = 1,
}: Partial<ParticleData>) {
	const p = new Particle()
	p.pos = vec(pos || [0, 0])
	p.vel = vec(vel || [0, 0])
	p.force = vec(force || [0, 0])
	p.mass = mass
	p.inertia = inertia
	return p
}

export function makeParticle3D({
	pos,
	vel,
	force,
	mass = 1,
	inertia = 1,
}: Partial<ParticleData>) {
	const p = new Particle()
	p.pos = vec(pos || [0, 0, 0])
	p.vel = vec(vel || [0, 0, 0])
	p.force = vec(force || [0, 0, 0])
	p.mass = mass
	p.inertia = inertia
	return p
}
