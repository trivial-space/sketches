vec3 nearestPointInsideArea(vec3 pointOnPlane, mat4 areaMat, vec2 areaSize) {
	float width = areaSize.x / 2.0;
	float height = areaSize.y / 2.0;

	vec3 right = normalize(areaMat[0].xyz);
	vec3 up = normalize(areaMat[1].xyz);
	vec3 pos = areaMat[3].xyz;

	/*calculate distance from area*/
	vec2 diagonal = vec2(dot(pointOnPlane, right), dot(pointOnPlane, up));
	vec2 nearest2D = vec2(clamp(diagonal.x, -width, width), clamp(diagonal.y, -height, height));
	return pos + (right * nearest2D.x + up * nearest2D.y);
}


float specularAreaLight(mat4 lightMat, vec3 V, vec3 N, vec3 eyePosition, vec2 areaSize, float gloss) {

	vec3 normal = normalize(lightMat[2].xyz);
	vec3 pos = lightMat[3].xyz;

	vec3 direction = eyePosition - V;

	vec3 R = reflect(normalize(direction), -N);
	float rDotN = dot(normal, R);

	if (rDotN > 0.0) {
		vec3 E = V + R * (dot(normal, pos - V) / rDotN); // line-plane intersection
		vec3 dir = E - pos;

		vec3 nearestPointInside = nearestPointInsideArea(dir, lightMat, areaSize);
		float dist = distance(V, nearestPointInside); //real distance to area rectangle

		float rDotL = max(dot(R, normalize(V - nearestPointInside)), 0.0);
		float attenuation = 1.0 / (pow(dist, 0.5));

		return pow(max(rDotL, 0.0), gloss) * attenuation;
	} else {
		return 0.0;
	}
}


#pragma glslify: export(specularAreaLight)
