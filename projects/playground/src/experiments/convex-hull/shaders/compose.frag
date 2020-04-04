precision mediump float;

uniform sampler2D previous;
uniform sampler2D current;

varying vec2 coords;

void main() {
	vec4 p = texture2D(previous, coords);
	vec4 c = texture2D(current, coords);
	vec3 color = max(p.rgb, c.rgb);
	gl_FragColor = vec4(color, 1.0);
}

