precision mediump float;

uniform sampler2D reflection;
uniform sampler2D lightTex[5];
uniform vec4 lights[5];
uniform vec2 size;
uniform vec2 lightSize;
varying vec3 V;

const vec3 up = vec3(0.0, 1.0, 0.0);


vec3 diffuseAreaLight(sampler2D tex, vec3 normal, vec3 pos, vec3 V) {
	float width = lightSize.x / 2.0;
	float height = lightSize.y / 2.0;

	vec3 right = cross(up, normal);

	/*project onto plane and calculate direction from center to the projection*/
	float dis = dot(normal, V - pos);
	vec3 projection = V - dis * normal;
	vec3 dir = projection - pos;

	/*calculate distance from area*/
	vec2 diagonal = vec2(dot(dir, right), dot(dir, up));
	vec2 nearest2D = vec2(clamp(diagonal.x, -width, width), clamp(diagonal.y, -height, height));
	vec3 nearestPointInside = pos + (right * nearest2D.x + up * nearest2D.y);

	vec3 L = normalize(nearestPointInside - V);

	float nDotL = dot(-normal, L);

	float d = distance(V, nearestPointInside); //real distance to area rectangle

	vec3 diff = vec3(0.0);


	vec2 co = ((diagonal.xy / (d + 1.0)) + vec2(width, height)) / lightSize;
	vec3 texColor = texture2D(tex, co).rgb;

	if (nDotL > 0.0) {
		//co.x = 1.0 - co.x;
		diff = texColor;

		float NDotL = clamp(dot(-up, L), 0.0, 1.0);
		nDotL *= NDotL * 0.5 + 0.5; //distribute over hemisphere, looks better. Should be dependant of area size.

		float attenuation = 1.0 / (1.0 + d);

		diff *= nDotL * attenuation;
	}

	return diff;
}


void main() {
	float scale = (50.0 - length(V)) / 50.0;
	vec4 refl = texture2D(reflection, gl_FragCoord.xy / size);
	vec3 ground = vec3(0.0);

	for (int i = 0; i < 5; i++) {
		vec4 light = lights[i];
		vec3 lightNormal = vec3(sin(light.a), 0, cos(light.a));
		vec3 diffuse = diffuseAreaLight(lightTex[i], lightNormal, light.xyz, V);
		ground += pow(diffuse, vec3(0.57));
	}

	gl_FragColor = mix(vec4(ground, 1.0), vec4(refl.rgb, 1.0), refl / 2.0 + 0.25);
	// gl_FragColor = vec4(ground, 1.0);
}
