precision mediump float;

uniform vec2 p1;
uniform vec2 p2;
uniform vec2 p3;
uniform vec2 size;

varying vec2 coords;

void main() {
	vec2 v = p2 - p1;
	bool left = dot(v, p3) >= 0.0;
	bool light = dot((coords * size - p3), v) >= 0.0;
	//if (!left) light = !light;
	vec4 color = vec4(1.0, coords, 0.001);
	if (!light) {
		color = vec4(0.0);
	}
	gl_FragColor = vec4(color.rgb, 0.49);
}

