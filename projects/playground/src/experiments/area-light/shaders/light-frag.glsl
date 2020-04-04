precision mediump float;
#pragma glslify: diffuseAreaLight = require(../../../shared-utils/shaders/area-light/diffuseTex.glsl)
#pragma glslify: specularAreaLight = require(../../../shared-utils/shaders/area-light/specular.glsl)

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
		// gl_FragColor += vec4(specularColor / 2.0, 1.0);
		gl_FragColor += diffuseColor / 1.5;
	}
}
