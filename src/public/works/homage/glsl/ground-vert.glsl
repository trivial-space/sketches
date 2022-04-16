attribute vec3 position;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec3 V;

void main() {
	vec4 pos = transform * vec4(position, 1.0);
	V = pos.xyz;
	gl_Position = projection * view * pos;
}
