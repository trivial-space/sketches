attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec4 vPosition;
varying vec4 vNormal;
varying vec4 vUv;

void main() {
	vPosition = transform * vec4(position, 1.0);
	vNormal = transform * vec4(normal, 0.0);
	vUv = vec4(uv, 0.0, 0.0);
	gl_Position = projection * view * vPosition;
}
