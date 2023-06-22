float specularAreaLight(mat4 lightMat, vec3 V, vec3 N, vec3 eyePosition, vec2 areaSize, float gloss) {

	vec3 pos = lightMat[3].xyz;
	vec3 normal = normalize(lightMat[2].xyz);

	vec3 direction = eyePosition - V;

	vec3 R = reflect(normalize(direction), -N);
	float rDotN = dot(normal, R);

	if (rDotN > 0.0) {
		vec3 E = V + R * (dot(normal, pos - V) / rDotN); // line-plane intersection
		vec3 dir = E - pos;

		float width = areaSize.x / 2.0;
		float height = areaSize.y / 2.0;

		vec3 right = normalize(lightMat[0].xyz);
		vec3 up = normalize(lightMat[1].xyz);

		/*calculate distance from area*/
		vec2 diagonal = vec2(dot(dir, right), dot(dir, up));
		vec2 nearest2D = vec2(clamp(diagonal.x, -width, width), clamp(diagonal.y, -height, height));
		vec3 nearestPointInside = pos + (right * nearest2D.x + up * nearest2D.y);

		float dist = distance(V, nearestPointInside); //real distance to area rectangle

		float rDotL = max(0.0, dot(R, normalize(V - nearestPointInside)));

		// reduce glow of reflected points that are fare outside of the light area
		float falloff = min(1.0, length(vec2(width, height)) / length(diagonal));

		// remove artefact when intersection point is close to the vertex
		float closeness = clamp(distance(E, V) / dist, 0.0, 1.0);
		//float closeness = 1.0;

		float attenuation = 1.0 / (pow(dist, 0.5));

		return pow(max(rDotL, 0.0), gloss) * falloff * closeness * attenuation;
	} else {
		return 0.0;
	}
}


// #pragma glslify: export(specularAreaLight)
