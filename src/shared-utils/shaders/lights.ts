import {
	FloatTerm,
	Vec3Term,
	float,
	mul,
	vec3,
	reflect,
	pow,
	max,
	dot,
	FLOAT0,
	gt,
	VEC3_0,
	ternary,
	neg,
	$x,
	$z,
	add,
	$y,
} from '@thi.ng/shader-ast'
import { vec2 } from 'gl-matrix'

/**
 *
 * @param normal
 * @param lightDir Pointing towards the light source
 * @param eyeDir Pointing towards the camera
 * @param surfaceSpecularColor
 * @param shininess
 * @param lightColor
 * @returns
 */
export const specularLight = (
	normal: Vec3Term,
	lightDir: Vec3Term,
	eyeDir: Vec3Term,
	surfaceSpecularColor: Vec3Term,
	shininess: FloatTerm = float(10),
	lightColor: Vec3Term = vec3(1),
): Vec3Term => {
	const r = reflect(neg(lightDir), normal)
	const s = pow(max(dot(r, eyeDir), FLOAT0), shininess)

	return ternary(
		gt(dot(normal, eyeDir), FLOAT0),
		mul(mul(surfaceSpecularColor, lightColor), s),
		VEC3_0,
	)
}

/**
 *
 * @param lightDir Pointing towards the light source
 * @param spotDir Pointing away from the spot light
 * @param shininess
 * @param lightColor
 * @returns
 */
export const spotLight = (
	lightDir: Vec3Term,
	spotDir: Vec3Term,
	shininess: FloatTerm = float(1),
	lightColor: Vec3Term = vec3(1),
): Vec3Term => {
	const spot = pow(max(dot(lightDir, neg(spotDir)), FLOAT0), shininess)
	return mul(lightColor, spot)
}

/**
 * attenuationConstants.x + attenuationConstants.y * distance + attenuationConstants.z * distance^2
 * @param distance
 * @param attenuationConstants
 * @returns
 */
export const distanceDivisor = (
	distance: FloatTerm,
	attenuationConstants: Vec3Term,
): FloatTerm =>
	add(
		$x(attenuationConstants),
		add(
			mul($y(attenuationConstants), distance),
			mul($z(attenuationConstants), mul(distance, distance)),
		),
	)
