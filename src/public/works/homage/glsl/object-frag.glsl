precision mediump float;

uniform int withDistance;

varying float dist;
varying float height;

void main() {
	float scale = (50.0 - dist) / 50.0;
	if (withDistance == 0) {
		gl_FragColor = vec4(vec3(scale * 0.6), 1.0);
	} else {
		gl_FragColor = vec4(vec3(scale * 0.6), height);
		// gl_FragColor = vec4(vec3(height), 1.0);
	}
}
