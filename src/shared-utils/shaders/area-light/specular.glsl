float specularAreaLight(mat4 lightMat, vec3 V, vec3 N, vec3 eyePosition, vec2 areaSize, float hard, float gloss) {

	hard /= gloss;

	vec3 right = normalize(lightMat[0].xyz);
	vec3 up = normalize(lightMat[1].xyz);

	vec3 normal = normalize(lightMat[2].xyz);
	vec3 pos = lightMat[3].xyz;

	float width = areaSize.x / 2.0;
	float height = areaSize.y / 2.0;

	vec3 R = reflect(eyePosition - V, -N);
	vec3 E = V + R * (dot(normal, pos - V) / dot(normal, R)); //line-plane intersection

	if (dot(V - pos, normal) >= 0.0 && dot(R, normal) > 0.0) {
		vec3 dirSpec = E - pos;
		vec2 dirSpec2D = vec2(dot(dirSpec, right), dot(dirSpec, up));
		vec3 specPlane = pos + (right * dirSpec2D.x + up * dirSpec2D.y);

		float dist = max(distance(V, specPlane), 0.0); //real distance to specular rectangle

		width -= ((1.0 / hard) / 2.0) * (dist / gloss);
		height -= ((1.0 / hard) / 2.0) * (dist / gloss);

		width = max(width, 0.0);
		height = max(height, 0.0);

		vec2 nearestSpec2D = vec2(clamp(dirSpec2D.x, -width, width), clamp(dirSpec2D.y, -height, height));
		return 1.0 - clamp(length(nearestSpec2D - dirSpec2D) * (hard / (dist / gloss)), 0.0, 1.0);
	} else {
		return 0.0;
	}
}


#pragma glslify: export(specularAreaLight)
