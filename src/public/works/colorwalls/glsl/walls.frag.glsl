precision mediump float;

uniform float withDistance;

varying vec3 vColor;
varying vec3 vNormal;
varying float vHeight;

void main() {
	if (withDistance > 0.0) {
		gl_FragColor = vec4(vColor, vHeight);
	} else {
		gl_FragColor = vec4(vColor, 1.0);
	}
}
