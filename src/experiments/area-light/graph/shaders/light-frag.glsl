precision mediump float;

uniform sampler2D colors;
uniform sampler2D positions;
uniform sampler2D normals;
uniform sampler2D uvs;

uniform vec3 eyePosition;
uniform mat4 lightMat;
uniform mat4 view;

varying vec2 coords;


float areaLampEnergy(mat4 lampMat, vec3 V, vec3 N, vec3 lampPos, vec2 areaSize) {
	float width = areaSize.x / 2.0;
	float height = areaSize.y / 2.0;

	vec3 right = normalize(vec3(lampMat * vec4(1.0, 0.0, 0.0, 0.0))); //lamp right axis
	vec3 up = normalize(vec3(lampMat * vec4(0.0, 1.0, 0.0, 0.0))); //lamp up axis
	vec3 lampv = normalize(vec3(lampMat * vec4(0.0, 0.0, -1.0, 0.0))); //lamp projection axis

	/*project onto plane and calculate direction from center to the projection*/
	float dis = dot(lampv, V - lampPos);
	vec3 projection = V - dis * lampv;
	vec3 dir = projection - lampPos;

	/*calculate distance from area*/
	vec2 diagonal = vec2(dot(dir, right), dot(dir, up));
	vec2 nearest2D = vec2(clamp(diagonal.x, -width, width), clamp(diagonal.y, -height, height));
	vec3 nearestPointInside = lampPos + (right * nearest2D.x + up * nearest2D.y);

	float d = distance(V, nearestPointInside); //real distance to area rectangle

	vec3 L = normalize(nearestPointInside - V);

	float nDotL = clamp(dot(-lampv, L), 0.0, 1.0);
	//nDotL *= clamp(dot(-N,L),0.0,1.0); //how blender internal works, but too hard falloff
	nDotL *= clamp(dot(-N, L) * 0.5 + 0.5, 0.0, 1.0); //distribute over hemisphere, looks better. Should be dependant of area size.

	float attenuation = 1.0 / (1.0 + d);

	return max(nDotL, 0.0) * attenuation;
}

void areaDiff(vec3 V, vec3 lampPos, vec3 lampVec, vec3 N, mat4 lampMat, vec2 areaSize, float dist, float k, out float inp) {
	vec3 vec = V - lampPos;

	float strength = dist * dist / 4.0;

	if (dot(vec, lampVec) < 0.0) {
		inp = 0.0;
	} else {
		float intens = areaLampEnergy(lampMat, V, N, lampPos, areaSize);
		inp = pow(intens * strength, k);
	}
}

void main() {

	vec4 position = texture2D(positions, coords);
	vec4 normal = texture2D(normals, coords);
	vec4 uv = texture2D(uvs, coords);
	vec4 color = texture2D(colors, coords);

	vec3 lightPosition = lightMat[3].xyz;
	vec3 lightNormal = normalize(lightMat[2].xyz);
	float dist = abs(length(eyePosition - position.xyz));

	float diff = 1.0;

	areaDiff(position.xyz, lightPosition, -lightNormal, normalize(normal.xyz), lightMat, vec2(10.0), dist, 1.0, diff);
	//gl_FragColor = vec4(abs(normal.xyz), 1.0);
	gl_FragColor = vec4(color.xyz * diff, 1.0);
	//gl_FragColor = vec4(color.xyz * (lightPosition / 5.0), 1.0);
}
