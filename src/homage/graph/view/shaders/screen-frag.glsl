uniform sampler2D video;
uniform int withDistance;

varying vec2 vUv;
varying float height;

void main() {
	vec4 tex = texture2D(video, vUv);
	if (withDistance == 0) {
		gl_FragColor = vec4(tex.rgb, 1.0);
	} else {
		gl_FragColor = vec4(tex.rgb, height);
	}
}
