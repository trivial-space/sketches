precision mediump float;

uniform sampler2D reflection;
uniform vec2 size;

varying vec3 vNormal;

void main() {
	vec4 color = texture2D(reflection, gl_FragCoord.xy / size);
	gl_FragColor = vec4(color.rgb / 2.0 + 0.2, 1.0);
}
