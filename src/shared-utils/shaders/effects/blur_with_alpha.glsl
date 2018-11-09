precision mediump float;
#pragma glslify: blur = require('glsl-fast-gaussian-blur')

uniform sampler2D source;
uniform vec2 size;
uniform float direction;
uniform float strength;
uniform float strengthOffset;

varying vec2 coords;

void main() {
	vec2 uv = coords;
	vec4 refl = texture2D(source, uv);
	float dist = refl.a * strength + strengthOffset;

	if (direction == 0.0) {
		gl_FragColor = vec4(blur(source, uv, size, vec2(dist, 0)).rgb, refl.a);
	} else {
		gl_FragColor = vec4(blur(source, uv, size, vec2(0, dist)).rgb, refl.a);
	}
}
