uniform int withDistance;

varying float distance;
varying float height;

void main() {
	float scale = (50.0 - distance) / 50.0;
	if (withDistance == 0) {
		gl_FragColor = vec4(vec3(scale * 0.6), 1.0);
	} else {
		gl_FragColor = vec4(vec3(scale * 0.6), height);
	}
}
