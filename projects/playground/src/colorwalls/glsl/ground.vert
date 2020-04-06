attribute vec3 position;
attribute vec3 normal;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec3 vNormal;
varying vec3 vPos;

void main() {
	vNormal = normal;
	vec4 pos = transform * vec4(position, 1.0);
	vPos = pos.xyz;
	gl_Position = projection * view * pos;
}
