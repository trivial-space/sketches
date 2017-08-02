precision mediump float;
#pragma glslify: diffuseAreaLight = require(../../../../shared-utils/shaders/area-light/diffuse.glsl)
#pragma glslify: specularAreaLight = require(../../../../shared-utils/shaders/area-light/specular.glsl)

uniform sampler2D colors;
uniform sampler2D positions;
uniform sampler2D normals;
uniform sampler2D uvs;

uniform vec3 eyePosition;
uniform mat4 lightMat;
uniform mat4 view;

varying vec2 coords;


const float lightDistance = 4.0;
const vec2 lightSize = vec2(10.0);


void main() {

	vec3 position = texture2D(positions, coords).xyz;
	vec3 normal = normalize(texture2D(normals, coords).xyz);
	//vec4 uv = texture2D(uvs, coords);
	vec4 color = texture2D(colors, coords);

	if (color.a < 1.0) {
		gl_FragColor = vec4(color.rgb, 1.0);
	} else {
		float diffusePower = pow(diffuseAreaLight(lightMat, position, normal, lightSize), 0.7);
		vec3 diffuseColor = color.xyz * min(1.2, max(0.2, diffusePower * lightDistance));
		float specularPower = 0.0;
		if (diffusePower > 0.0) {
			specularPower = specularAreaLight(lightMat, position, normal, eyePosition, lightSize, 100.0);
		}
		vec3 specularColor = vec3(0.9, 0.0, 0.0) * specularPower;
		//gl_FragColor = vec4(abs(normal.xyz), 1.0);
		gl_FragColor = vec4(diffuseColor + specularColor, 1.0);
		//gl_FragColor = vec4(color.xyz * (lightPosition / 5.0), 1.0);
	}
}
