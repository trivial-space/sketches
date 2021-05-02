#version 300 es
in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

out vec4 vPosition;
out vec4 vNormal;
out vec4 vUv;

void main() {
	vPosition = transform * vec4(position, 1.0);
	vNormal = transform * vec4(normal, 0.0);
	vUv = vec4(uv, 0.0, 0.0);
	gl_Position = projection * view * vPosition;
}
