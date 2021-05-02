import { State, events, Q } from './context'
import {
	walkLine3D,
	lineSegment,
	Line,
} from '../../shared-utils/geometry/lines'

interface Step {
	duration: number
	currentTime: number
	turn: number
}

const speed = 10
const segmentLength = 1.3
let isStraight = false

function nextStep(): Step {
	isStraight = !isStraight
	return {
		currentTime: 0,
		duration: isStraight ? segmentLength * 1000 : segmentLength * 300,
		turn: isStraight ? 0 : Math.random() >= 0.5 ? Math.PI : -Math.PI,
	}
}

export class Squeegee {
	step = nextStep()
	segment = lineSegment({
		direction: [0, 1, 0],
		normal: [0, 0, 1],
		vertex: [0, -7, 0],
	})
	line: Line = [this.segment, this.segment]

	update(tpf: number) {
		const part = tpf / this.step.duration
		this.step.currentTime += tpf
		const newSegment = walkLine3D(
			{
				length: (speed * tpf) / 1000,
				normalAngle: part * this.step.turn,
			},
			this.segment,
		)
		this.line = [this.segment, newSegment]
		this.segment = newSegment
		if (this.step.currentTime >= this.step.duration) {
			this.step = nextStep()
		}
	}
}

Q.set('squeegee', new Squeegee())

Q.listen('Squeegee', events.FRAME, (s) => {
	s.squeegee.update(s.device.tpf)
})
