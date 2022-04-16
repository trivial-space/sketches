import { Vec } from 'tvs-libs/dist/math/vectors'

export interface ForceReceiver {
	applyForce(force: Vec): void
}
