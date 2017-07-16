export interface AnimationOptions {
	duration?: number
	easeFn?: (step: number) => number
	delay?: number
	onUpdate?: (step: number) => void
	onComplete?: () => void
}


export interface Animation {
	(step: number): number
}


export const linear = (step: number) => step


export function createAnimation ({
	duration = 1000,
	easeFn = linear,
	delay = 0,
	onComplete,
	onUpdate
}: AnimationOptions) {

	let progress = -delay
	let oldValue = 0

	return function animate (step: number) {

		if (progress >= duration) {
			return 0
		}

		if (progress < 0) {
			progress += Math.min(step, -progress)
			return 0
		}

		const newValue = (progress < duration - step)
			? easeFn((progress + step) / duration)
			:	easeFn(1)

		const value = newValue - oldValue
		progress += step
		oldValue = newValue

		if (onUpdate) onUpdate(value)

		if (progress >= duration && onComplete) {
			onComplete()
		}
		return value

	} as Animation
}
