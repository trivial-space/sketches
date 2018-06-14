attribute vec3 position;
attribute vec3 normal;
attribute vec3 color;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec3 vColor;
varying vec3 vNormal;

void main() {
	vNormal = normal;
	vColor = color;
	gl_Position = projection * view * transform * vec4(position, 1.0);
}
