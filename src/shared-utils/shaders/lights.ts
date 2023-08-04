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
} from '@thi.ng/shader-ast'

export const specularLight = (
	normal: Vec3Term,
	lightDir: Vec3Term,
	eyeDir: Vec3Term,
	surfaceSpecularColor: Vec3Term,
	shininess: FloatTerm = float(0.1),
	lightColor: Vec3Term = vec3(1),
): Vec3Term => {
	const r = reflect(lightDir, normal)
	const s = pow(max(dot(r, eyeDir), FLOAT0), shininess)

	return ternary(
		gt(dot(normal, lightDir), FLOAT0),
		mul(mul(surfaceSpecularColor, lightColor), s),
		VEC3_0,
	)
}

export const spotLight = (
	normal: Vec3Term,
	// light: Vec3,
	// camera: Vec3,
	shininess = 0.1,
) => {}
