import { stream, streamStart, val } from 'tvs-flow/lib/utils/entity-reference'
import { mat4 } from 'tvs-libs/lib/math/gl-matrix'


export const groundTransform = streamStart(null, () => {
	const t = mat4.create()
	mat4.rotateX(t, t, Math.PI / 2)
	mat4.scale(t, t, [10, 10, 10])
	return t
})

export const lightRotation = val(Math.PI / 6)
export const lightPosition = val([0, 5, 0])

export const lightTransform = stream(
	[lightRotation.HOT, lightPosition.HOT],
	(rot, pos) => {
		const t = mat4.fromTranslation(mat4.create(), pos)
		mat4.rotateX(t, t, rot)
		return t
	})
