precision mediump float;

uniform sampler2D reflection;
uniform vec2 size;
uniform vec3 lightPositions[5];
uniform float lightRotations[5];
varying vec3 V;

const vec3 N = vec3(0.0, 1.0, 0.0);
const float lightDistance = 30.0;

void main() {
	float scale = (50.0 - length(V)) / 50.0;
	vec4 refl = texture2D(reflection, gl_FragCoord.xy / size);
	//vec4 ground = vec4(vec3(scale * 0.5), 1.0);
	vec3 ground = vec3(0.0);
	for (int i = 0; i < 5; i++) {
		ground += (lightDistance - length(lightPositions[i] - V)) / (lightDistance * 10.0);
	}
	//gl_FragColor = mix(ground, vec4(refl.rgb, 1.0), refl / 2.0 + 0.25);
	gl_FragColor = vec4(ground, 1.0);
}
