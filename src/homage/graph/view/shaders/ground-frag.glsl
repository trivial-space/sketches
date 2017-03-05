uniform sampler2D reflection;
uniform vec2 size;

varying float dist;

void main() {
	float scale = (50.0 - dist) / 50.0;
	vec4 refl = texture2D(reflection, gl_FragCoord.xy / size);
	vec4 ground = vec4(vec3(scale * 0.6), 1.0);
	gl_FragColor = mix(ground, vec4(refl.rgb, 1.0), refl / 2.0 + 0.25);
}
