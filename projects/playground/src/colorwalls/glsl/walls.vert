attribute vec3 position;
attribute vec3 normal;
attribute vec3 color;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec3 vColor;
varying vec3 vNormal;
varying float vHeight;

void main() {
	vNormal = normal;
	vec4 pos = transform * vec4(position, 1.0);
	vColor = color;
	vHeight = pos.y / 25.0;
	gl_Position = projection * view * pos;
}
