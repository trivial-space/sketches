import { add, div, mul, Vec } from '../../../../libs/dist/math/vectors'

class Particle {
	pos: Vec
	vel: Vec
	force: Vec
	mass: number = 1
	damping: number = 1

	addForce(newForce: Vec) {
		const { mass, force } = this
		if (mass !== 1) {
			div(mass, newForce, newForce)
		}
		this.force = add(force, newForce)
	}

	applyForce() {
		const { vel, pos, force, damping } = this
		add(vel, force, vel)
		if (damping !== 1) {
			mul(damping, vel, vel)
		}
		add(pos, vel, pos)
		mul(0, force, force)
	}
}
