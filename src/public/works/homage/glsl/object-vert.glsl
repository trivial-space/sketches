attribute vec3 position;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;
uniform float groundHeight;

varying float dist;
varying float height;

void main() {
	vec4 pos = transform * vec4(position, 1.0);
	dist = length(pos.xyz);
	height = (pos.y - groundHeight) / 10.0;
	gl_Position = projection * view * pos;
}
