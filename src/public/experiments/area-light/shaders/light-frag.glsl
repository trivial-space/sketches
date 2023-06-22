precision mediump float;

// see shared-utils/shaders/area-light/diffuseTex.glsl
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

// see shared-utils/shaders/area-light/specular.glsl
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

uniform sampler2D colors;
uniform sampler2D positions;
uniform sampler2D normals;
uniform sampler2D uvs;
uniform sampler2D tex;

uniform vec3 eyePosition;
uniform mat4 lightMat;
uniform mat4 view;

varying vec2 coords;

const vec2 lightSize = vec2(10.0);

void main() {

	vec3 position = texture2D(positions, coords).xyz;
	vec3 normal = normalize(texture2D(normals, coords).xyz);
	vec4 uv = texture2D(uvs, coords);
	vec4 color = texture2D(colors, coords);

	if (color.a < 1.0) {
		vec4 texColor = texture2D(tex, uv.xy);
		gl_FragColor = vec4(texColor.rgb * color.rgb, 1.0);
	} else {
		// paint ground grid
		float vertical = fract(uv.x * 100.0);
		float horizontal = fract(uv.y * 100.0);
		if (vertical >= 0.95 || horizontal >= 0.95) gl_FragColor.b += 0.3;

		// light calculation
		vec4 diffuseColor = diffuseAreaLight(tex, lightMat, position, normal, lightSize);
		diffuseColor = vec4(
			pow(diffuseColor.r, 0.7),
			pow(diffuseColor.g, 0.7),
			pow(diffuseColor.b, 0.7),
			1.0
		);
		diffuseColor *= color * 4.0;

		float specularPower = specularAreaLight(lightMat, position, normal, eyePosition, lightSize, 100.0);

		vec3 specularColor = vec3(0.9) * specularPower * color.xyz;
		gl_FragColor += vec4(specularColor / 2.0, 1.0);
		gl_FragColor += diffuseColor / 1.5;
	}
}
