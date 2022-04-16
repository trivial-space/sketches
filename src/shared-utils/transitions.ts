import { baseEvents, PainterContext } from './painterState'

export const linear = (step: number) => step

export class Transition {
	easeFn = linear
	duration = 1000
	delay = 0
	repeat = false
	onComplete?: () => void
	onStart?: () => void
	onUpdate?: (step: number) => void

	progress: number
	oldValue: number

	done = false

	constructor(options: Partial<Transition>) {
		Object.assign(this, options)

		this.progress = -this.delay
		this.oldValue = this.easeFn(0)
	}

	update(step: number) {
		if (this.done) {
			return 0
		}

		this.progress += step

		if (this.progress <= 0) {
			return 0
		}

		if (this.progress <= step && this.onStart) {
			this.onStart()
		}

		const newValue =
			this.progress < this.duration
				? this.easeFn(this.progress / this.duration)
				: this.easeFn(1)

		const value = newValue - this.oldValue
		this.oldValue = newValue

		if (this.onUpdate) this.onUpdate(value)

		if (this.progress >= this.duration) {
			if (
				this.repeat === true ||
				(typeof this.repeat === 'number' && this.repeat > 0)
			) {
				if (typeof this.repeat === 'number') {
					this.repeat--
				}
				this.progress = 0
			} else {
				if (this.onComplete) {
					this.onComplete()
				}
				this.done = true
			}
		}

		return value
	}
}

let transitions: Transition[] = []
let initialized = false

export function pushTransition(
	Q: PainterContext,
	transitionProps: Partial<Transition>,
) {
	if (!initialized) {
		Q.listen('_transitionRunner', baseEvents.FRAME, (s) => {
			transitions = transitions.filter((t) => !t.done)
			transitions.forEach((t) => t.update(s.device.tpf))
		})
		initialized = true
	}

	const t = new Transition(transitionProps)
	transitions.push(t)
	return t
}
