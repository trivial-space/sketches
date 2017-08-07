import { streamStart, val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { mat4 } from 'gl-matrix'
import { tick } from './events'
import { unequal } from 'tvs-libs/dist/lib/utils/predicates'


export const groundColor = val([0.7, 0.6, 0.9, 1])

export const groundTransform = streamStart(null, () => {
	const t = mat4.create()
	mat4.rotateX(t, t, Math.PI / 2)
	mat4.scale(t, t, [10, 10, 10])
	return t
})


export const animate = val(true)

export const lightRotation = val(-Math.PI * 0.8)
.react([animate.COLD, tick.HOT], (rot, animate, _) => animate ? rot + 0.02 : rot)

export const time = val(0)
.react([tick.HOT, animate.COLD], (t, tick, animate) => animate ? t + tick : t)
.accept(unequal)

export const lightPosition = val([0, 5.5, 0])
.react([time.HOT], (pos, t) => {
	pos[1] = 4.5 + Math.sin(t / 2000) * 4.0
	return pos
})

export const lightColor = val([1.0, 1.0, 1.0, 0.0])
export const lightBackColor = val([0.0, 0.0, 0.2, 0.0])

export const lightTransforms = val([mat4.create(), mat4.create()])
.react(
	[lightRotation.HOT, lightPosition.HOT],
	(mats, rot, pos) => {
		mat4.fromTranslation(mats[0], pos)
		mat4.rotateX(mats[0], mats[0], rot)
		mat4.rotateX(mats[1], mats[0], Math.PI)
		return mats
	})
