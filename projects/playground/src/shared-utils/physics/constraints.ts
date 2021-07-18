import { div, length, mul, sub, Vec } from 'tvs-libs/dist/math/vectors'

const temp: Vec = []
export function springForce(
	springLength: number,
	springStrength: number,
	agentPos: Vec,
	receiverPos: Vec,
) {
	const vec = sub(receiverPos, agentPos, temp)
	const len = length(vec)
	const norm = div(len, vec, temp)

	return mul((springLength - len) * springStrength, norm)
}

const temp2: Vec = []
export function directionForce(strength: number, direction: Vec) {
	const len = length(direction)

	let norm = direction

	if (len != 1) {
		norm = div(len, direction, temp2)
	}

	return mul(strength, norm)
}
