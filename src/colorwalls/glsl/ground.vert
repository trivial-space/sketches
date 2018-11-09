attribute vec3 position;
attribute vec3 normal;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec3 vNormal;

void main() {
	vNormal = normal;
	gl_Position = projection * view * transform * vec4(position, 1.0);
}
