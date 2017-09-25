vec4 diffuseAreaLight(sampler2D tex, mat4 lightMat, vec3 V, vec3 N, vec2 areaSize) {
	float width = areaSize.x / 2.0;
	float height = areaSize.y / 2.0;

	vec3 right = normalize(lightMat[0].xyz);
	vec3 up = normalize(lightMat[1].xyz);
	vec3 normal = normalize(lightMat[2].xyz);
	vec3 pos = lightMat[3].xyz;

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

	vec4 diff = vec4(0.0);

	if (nDotL > 0.0) {
		float lod = pow(d, 0.03) * 6.0;

		vec2 co = ((diagonal.xy / (d + 1.0)) + vec2(width, height)) / areaSize;
		//co.x = 1.0 - co.x;

		vec4 t00 = texture2D(tex, co, lod);
		vec4 t01 = texture2D(tex, co, lod + 1.0);

		diff = mix(t00, t01, fract(lod + 1.5));

		float NDotL = clamp(dot(-N, L), 0.0, 1.0);
		nDotL *= NDotL * 0.5 + 0.5; //distribute over hemisphere, looks better. Should be dependant of area size.

		float attenuation = 1.0 / (1.0 + d);

		diff *= nDotL * attenuation;
	}

	diff.a = 1.0;
	return diff;
}


#pragma glslify: export(diffuseAreaLight)
