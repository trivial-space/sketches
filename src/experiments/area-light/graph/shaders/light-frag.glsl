precision mediump float;

uniform sampler2D colors;
uniform sampler2D positions;
uniform sampler2D normals;
uniform sampler2D uvs;

uniform vec3 eyePosition;
uniform mat4 lightMat;
uniform mat4 view;

varying vec2 coords;


float areaLampEnergy(mat4 lampMat, vec3 V, vec3 N, vec2 areaSize) {
	float width = areaSize.x / 2.0;
	float height = areaSize.y / 2.0;

	vec3 right = normalize(lightMat[0].xyz);
	vec3 up = normalize(lightMat[1].xyz);
	vec3 normal = normalize(-1.0 * lightMat[2].xyz);
	vec3 pos = lightMat[3].xyz;

	/*project onto plane and calculate direction from center to the projection*/
	float dis = dot(normal, V - pos);
	vec3 projection = V - dis * normal;
	vec3 dir = projection - pos;

	/*calculate distance from area*/
	vec2 diagonal = vec2(dot(dir, right), dot(dir, up));
	vec2 nearest2D = vec2(clamp(diagonal.x, -width, width), clamp(diagonal.y, -height, height));
	vec3 nearestPointInside = pos + (right * nearest2D.x + up * nearest2D.y);

	float d = distance(V, nearestPointInside); //real distance to area rectangle

	vec3 L = normalize(nearestPointInside - V);

	float nDotL = clamp(dot(-normal, L), 0.0, 1.0);
	//nDotL *= clamp(dot(-N,L),0.0,1.0); //how blender internal works, but too hard falloff
	nDotL *= clamp(dot(-N, L) * 0.5 + 0.5, 0.0, 1.0); //distribute over hemisphere, looks better. Should be dependant of area size.

	float attenuation = 1.0 / (1.0 + d);

	return max(nDotL, 0.0) * attenuation;
}


const float lightDistance = 3.0;

void main() {

	vec4 position = texture2D(positions, coords);
	vec4 normal = texture2D(normals, coords);
	//vec4 uv = texture2D(uvs, coords);
	vec4 color = texture2D(colors, coords);

	float diff = 1.0;

	if (color.a < 1.0) {
		gl_FragColor = vec4(color.rgb, 1.0);
	} else {
		diff = pow(areaLampEnergy(lightMat, position.xyz, normalize(normal.xyz), vec2(10.0)), 0.7);
		//gl_FragColor = vec4(abs(normal.xyz), 1.0);
		gl_FragColor = vec4(color.xyz * min(1.2, max(0.2, diff * lightDistance)), 1.0);
		//gl_FragColor = vec4(color.xyz * (lightPosition / 5.0), 1.0);
	}

}
