attribute vec2 position;

uniform vec2 size;

void main() {
	gl_Position = vec4((position / size) * 2.0 - 1.0, 0.0, 1.0);
	gl_PointSize = 20.0;
}
