precision mediump float;

uniform sampler2D previous;
uniform sampler2D current;

varying vec2 coords;

void main() {
	vec4 p = texture2D(previous, coords);
	vec4 c = texture2D(current, coords);
	vec3 color = mix(p.rgb, c.rgb, c.a);
	gl_FragColor = vec4(color, c.a);
}

