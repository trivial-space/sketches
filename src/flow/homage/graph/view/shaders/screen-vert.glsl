attribute vec3 position;
attribute vec2 uv;
uniform float groundHeight;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec2 vUv;
varying float height;

void main() {
	vUv = uv;
	vec4 pos = transform * vec4(position, 1.0);
	height = (pos.y - groundHeight) / 10.0;
	gl_Position = projection * view * pos;
}
