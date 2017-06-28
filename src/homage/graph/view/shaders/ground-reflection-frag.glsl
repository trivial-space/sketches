precision mediump float;
#pragma glslify: blur = require('glsl-fast-gaussian-blur')

uniform sampler2D source;
uniform vec2 size;
uniform int direction;
uniform float strength;

varying float dist;
varying vec2 coords;

void main() {
	vec2 uv = coords;
	vec4 refl = texture2D(source, uv);
	float dist = refl.a * strength + 0.2;

	if (direction == 0) {
		gl_FragColor = vec4(blur(source, uv, size, vec2(dist, 0)));
	} else {
		gl_FragColor = vec4(blur(source, uv, size, vec2(0, dist)));
	}
}
