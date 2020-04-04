// lampMat = lamp to world matrix (lamp modelmatrix)
// V = vertex pos
// lampPos = lamp position
// lampVec = lamp direction vector
// areaSizeX = area light X size
// areaSizeY = area light Y size
// N = view normal (normalized)
// k = gamma coorection value for light
// dist = distance

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

void areaDiff(vec3 V, vec3 lampPos, vec3 lampVec, vec3 N, mat4 lampMat, float areaSizeX, float areaSizeY, float dist, float k, out float inp) {
	vec3 vec = V - lampPos;
	vec2 asize = vec2(areaSizeX, areaSizeY);

	float strength = dist * dist / 4.0;

	if (dot(vec, lampVec) < 0.0) {
		inp = 0.0;
	} else {
		float intens = areaLampEnergy(lampMat, V, N, lampPos, asize);
		inp = pow(intens * strength, k);
	}
}

void areaSpec(vec3 V, vec3 lampPos, vec3 N, mat4 lampMat, float areaSizeX, float areaSizeY, float hard, out float specfac) {
	float width = areaSizeX / 2.0;
	float height = areaSizeY / 2.0;

	hard /= 4.0;
	float gloss = 4.0;

	vec3 right = normalize(vec3(lampMat * vec4(1.0, 0.0, 0.0, 0.0))); //lamp right axis
	vec3 up = normalize(vec3(lampMat * vec4(0.0, 1.0, 0.0, 0.0))); //lamp up axis
	vec3 lampv = normalize(vec3(lampMat * vec4(0.0, 0.0, -1.0, 0.0)));; //lamp projection axis

	vec3 R = reflect(-V, -N);
	vec3 E = V + R * (dot(lampv, lampPos - V) / dot(lampv, R)); //line-plane intersection

	float specAngle = clamp(dot(R, lampv), 0.0, 1.0);
	float spec = 0.0;

	if (dot(V-lampPos, lampv) >= 0.0 && specAngle > 0.0) {
		vec3 dirSpec = E - lampPos;
		vec2 dirSpec2D = vec2(dot(dirSpec, right), dot(dirSpec, up));
		vec3 specPlane = lampPos + (right * dirSpec2D.x + up * dirSpec2D.y);

		float dist = max(distance(V, specPlane), 0.0); //real distance to specular rectangle

		width -= ((1.0 / hard) / 2.0) * (dist / gloss);
		height -= ((1.0 / hard) / 2.0) * (dist / gloss);

		width = max(width, 0.0);
		height = max(height, 0.0);

		vec2 nearestSpec2D = vec2(clamp(dirSpec2D.x, -width, width), clamp(dirSpec2D.y, -height, height));
		spec = 1.0 - clamp(length(nearestSpec2D - dirSpec2D) * (hard / (dist / gloss)), 0.0, 1.0);
	}

	specfac = spec;
}

void areaDiffTexture(sampler2D tex, vec3 V, vec3 lampPos, vec3 N, mat4 lampMat, float areaSizeX, float areaSizeY, float hard, out vec4 result) {
	float width = areaSizeX / 2.0;
	float height = areaSizeY / 2.0;

	hard /= 4.0;
	float gloss = 4.0;

	vec3 right = normalize(vec3(lampMat * vec4(1.0, 0.0, 0.0, 0.0))); //lamp right axis
	vec3 up = normalize(vec3(lampMat * vec4(0.0, 1.0, 0.0, 0.0))); //lamp up axis
	vec3 lampv = normalize(vec3(lampMat * vec4(0.0, 0.0, -1.0, 0.0))); //lamp projection axis

	float dis = dot(lampv, V - lampPos);
	vec3 projection = V - dis * lampv;
	vec3 dir = projection - lampPos;

	vec2 diagonal = vec2(dot(dir, right), dot(dir, up));
	vec2 nearest2D = vec2(clamp(diagonal.x, -width, width), clamp(diagonal.y, -height, height));
	vec3 nearestPointInside = lampPos + (right * nearest2D.x + up * nearest2D.y);

	float d = distance(V, nearestPointInside); //real distance to area rectangle

	vec2 co = ((diagonal.xy / (d + 1.0)) + vec2(width, height)) / vec2(width * 2.0, height * 2.0);
	co.x = 1.0 - co.x;
	vec3 ve = V - lampPos;

	vec4 diff = vec4(0.0);

	if (dot(ve, lampv) < 0.0) {
		diff = vec4(0.0);
	} else {
		float lod = pow(d,0.1)*8.0;

		vec4 t00 = texture2DLod(tex, co, lod);
		vec4 t01 = texture2DLod(tex, co, lod + 1.0);

		diff = mix(t00, t01, fract(lod + 1.5));
	}

	result = diff;
}

void areaSpecTexture(sampler2D tex, vec3 V, vec3 lampPos, vec3 N, mat4 lampMat, float areaSizeX, float areaSizeY, float hard, out vec4 result) {
	float width = areaSizeX;
	float height = areaSizeY;

	hard /= 4.0;
	float gloss = 4.0;

	vec3 right = normalize(vec3(lampMat * vec4(1.0, 0.0, 0.0, 0.0))); //lamp right axis
	vec3 up = normalize(vec3(lampMat * vec4(0.0, 1.0, 0.0, 0.0))); //lamp up axis
	vec3 lampv = normalize(vec3(lampMat * vec4(0.0, 0.0, -1.0, 0.0)));; //lamp projection axis

	vec3 R = reflect(-V, -N);
	vec3 E = V + R * (dot(lampv, lampPos - V) / dot(lampv, R)); //line-plane intersection

	float specAngle = clamp(dot(R, lampv), 0.0, 1.0);
	vec4 spec = vec4(0.0);

	if (dot(V - lampPos, lampv) >= 0.0 && specAngle > 0.0) {
		vec3 dirSpec = E - lampPos;
		vec2 dirSpec2D = vec2(dot(dirSpec, right), dot(dirSpec, up));
		vec3 specPlane = lampPos +(right * dirSpec2D.x + up * dirSpec2D.y);

		float dist = max(distance(V, specPlane), 0.0); //real distance to specular rectangle

		float d = ((1.0 / hard) / 2.0) * (dist / gloss);

		width = max(width, 0.0);
		height = max(height, 0.0);

		vec2 co = (dirSpec2D) / (d + 1.0);
		co /= vec2(width, height);
		co = co + vec2(0.5);
		co.x = 1.0 - co.x;

		float lod = (2.0 / hard * max(dist, 0.0));
		vec4 t00 = texture2DLod(tex, co, lod);
		vec4 t01 = texture2DLod(tex, co, lod + 1.0);

		spec =  mix(t00, t01, fract(lod + 1.5));
	}
	result = spec;
}

/*
this is the whole blender implementation on the shader side.
you have to run this for each area light in the scene something like this:

for (i=0; i<AREALIGHTS; ++i) {
	diffuse += areaDiff();
	spec += areaSpec();

	#ifdef TEXTURE
	diffuse *= areaDiffTexture();
	spec *= areaSpecTexture();
	#endif
}
*/


/// ArKano22 original implementation
vec3 projectOnPlane(in vec3 p, in vec3 pc, in vec3 pn)
{
	float distance = dot(pn, p - pc);
	return p - distance * pn;
}
int sideOfPlane(in vec3 p, in vec3 pc, in vec3 pn){
	if (dot(p - pc, pn) >= 0.0) return 1; else return 0;
}
vec3 linePlaneIntersect(in vec3 lp, in vec3 lv, in vec3 pc, in vec3 pn){
	return lp + lv * (dot(pn, pc - lp) / dot(pn, lv));
}
void areaLight(in int i, in vec3 N, in vec3 V, in float shininess,
				inout vec4 ambient, inout vec4 diffuse, inout vec4 specular)
{
	vec3 right = normalize(vec3(gl_ModelViewMatrix * gl_LightSource[i].ambient));
	vec3 pnormal = normalize(gl_LightSource[i].spotDirection);
	vec3 up = normalize(cross(right, pnormal));

	//width and height of the area light:
	float width = 1.0;
	float height = 4.0;

	//project onto plane and calculate direction from center to the projection.
	vec3 projection = projectOnPlane(V, vec3(gl_LightSource[i].position.xyz), pnormal);// projection in plane
	vec3 dir = projection - vec3(gl_LightSource[i].position.xyz);

	//calculate distance from area:
	vec2 diagonal = vec2(dot(dir, right), dot(dir, up));
	vec2 nearest2D = vec2(clamp(diagonal.x, -width, width), clamp(diagonal.y, -height, height));
	vec3 nearestPointInside = vec3(gl_LightSource[i].position.xyz) + (right * nearest2D.x + up * nearest2D.y);

	float dist = distance(V, nearestPointInside); //real distance to area rectangle

	vec3 L = normalize(nearestPointInside - V);
	float attenuation = calculateAttenuation(i, dist);

	float nDotL = dot(pnormal, -L);

	if (nDotL > 0.0 && sideOfPlane(V, vec3(gl_LightSource[i].position.xyz), pnormal) == 1) //looking at the plane
	{
		//shoot a ray to calculate specular:
		vec3 R = reflect(normalize(-V), N);
		vec3 E = linePlaneIntersect(V, R, vec3(gl_LightSource[i].position.xyz), pnormal);

		float specAngle = dot(R, pnormal);
		if (specAngle > 0.0){
			vec3 dirSpec = E - vec3(gl_LightSource[i].position.xyz);
			vec2 dirSpec2D = vec2(dot(dirSpec, right), dot(dirSpec, up));
			vec2 nearestSpec2D = vec2(clamp(dirSpec2D.x, -width, width), clamp(dirSpec2D.y, -height, height));
			float specFactor = 1.0 - clamp(length(nearestSpec2D - dirSpec2D) * shininess, 0.0, 1.0);
			specular += gl_LightSource[i].specular * attenuation * specFactor * specAngle;
		}
		diffuse += gl_LightSource[i].diffuse * attenuation * nDotL;
	}

	ambient += gl_LightSource[i].ambient * attenuation;
}
