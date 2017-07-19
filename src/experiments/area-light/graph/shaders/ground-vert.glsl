attribute vec3 position;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying float dist;

void main() {
	vec4 pos = transform * vec4(position, 1.0);
	dist = length(pos.xyz);
	gl_Position = projection * view * pos;
}
