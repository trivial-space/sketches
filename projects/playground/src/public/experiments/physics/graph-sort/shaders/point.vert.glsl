attribute vec2 position;
attribute vec3 color;

uniform vec2 size;

varying vec3 vColor;

void main() {
	vColor = color;
	gl_Position = vec4((position / size) * 2.0 - 1.0, 0.0, 1.0);
	gl_PointSize = 20.0;
}
