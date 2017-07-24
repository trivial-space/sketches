import { stream, streamStart, val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { mat4 } from 'gl-matrix'


export const groundColor = val([0.5, 0.5, 0.5, 1.0])

export const groundTransform = streamStart(null, () => {
	const t = mat4.create()
	mat4.rotateX(t, t, Math.PI / 2)
	mat4.scale(t, t, [10, 10, 10])
	return t
})

export const lightRotation = val(Math.PI / 6)
export const lightPosition = val([0, 5, 0])

export const lightColor = val([1.0, 1.0, 1.0, 1.0])

export const lightTransform = stream(
	[lightRotation.HOT, lightPosition.HOT],
	(rot, pos) => {
		const t = mat4.fromTranslation(mat4.create(), pos)
		mat4.rotateX(t, t, rot)
		return t
	})
