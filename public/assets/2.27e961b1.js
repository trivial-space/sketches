var y=Object.defineProperty;var v=Object.getOwnPropertySymbols;var P=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable;var c=(o,e,i)=>e in o?y(o,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):o[e]=i,h=(o,e)=>{for(var i in e||(e={}))P.call(e,i)&&c(o,i,e[i]);if(v)for(var i of v(e))z.call(e,i)&&c(o,i,e[i]);return o};var a=(o,e,i)=>(c(o,typeof e!="symbol"?e+"":e,i),i);import"./modulepreload-polyfill.b7f2da20.js";import{g as D,b as S,m as u,r as L}from"./painterState.2081fc22.js";import{c as f,g as d,h as C,e as M}from"./vendor.86045b5f.js";import{p as I}from"./plane.159d540e.js";import{i as T}from"./perspectiveViewport.0dcf679b.js";import"./pointer.1f73fbf8.js";import"./camera.94126e27.js";const N=document.getElementById("canvas"),m=h({},S),t=D(N);class b{constructor(){a(this,"time",0);a(this,"groundColor",[.7,.6,.9,1]);a(this,"groundTransform",f());a(this,"rotationSpeed",2e-4);a(this,"lightRotation",-Math.PI*.8);a(this,"lightPosition",[0,3.5,0]);a(this,"lightColor",[1,1,1,0]);a(this,"lightBackColor",[0,0,.2,0]);a(this,"lightTransforms",[f(),f()]);d(this.groundTransform,this.groundTransform,Math.PI/2),C(this.groundTransform,this.groundTransform,[10,10,10]),this.update(0)}update(e){this.time+=e,this.lightRotation+=this.rotationSpeed*e,this.lightPosition[1]+=Math.sin(this.time/2e3)*.05,M(this.lightTransforms[0],this.lightPosition),d(this.lightTransforms[0],this.lightTransforms[0],this.lightRotation),d(this.lightTransforms[1],this.lightTransforms[0],Math.PI)}}t.listen("entities",m.FRAME,o=>{o.scene.update(o.device.tpf)});t.set("scene",new b);var E=`#version 300 es
precision highp float;
#define GLSLIFY 1

uniform vec4 color;

in vec4 vPosition;
in vec4 vNormal;
in vec4 vUv;

layout(location=0) out vec4 fragPosition;
layout(location=1) out vec4 fragNormal;
layout(location=2) out vec4 fragUV;
layout(location=3) out vec4 fragColor;

void main() {
	fragPosition = vPosition;
	fragNormal = vNormal;
	fragUV = vUv;
	fragColor = color;
}
`,j=`#version 300 es
#define GLSLIFY 1
in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

out vec4 vPosition;
out vec4 vNormal;
out vec4 vUv;

void main() {
	vPosition = transform * vec4(position, 1.0);
	vNormal = transform * vec4(normal, 0.0);
	vUv = vec4(uv, 0.0, 0.0);
	gl_Position = projection * view * vPosition;
}
`,F=`precision mediump float;
#define GLSLIFY 1
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
		// gl_FragColor += vec4(specularColor / 2.0, 1.0);
		gl_FragColor += diffuseColor / 1.5;
	}
}
`;const{state:r,gl:s}=t;T(t,{fovy:Math.PI*.3,position:[11,2,-9],rotationY:2});const V=I(10,10,0,0),p=t.getForm("plane").update(V),x=t.getShade("geo").update({frag:E,vert:j}),w=t.getLayer("tex").update({texture:{}}),g=new Image;g.onload=()=>{w.update({texture:{asset:g,minFilter:"LINEAR_MIPMAP_LINEAR",magFilter:"LINEAR"}})};g.src="tree.jpg";const R=t.getSketch("ground").update({form:p,shade:x,uniforms:{transform:()=>r.scene.groundTransform,color:()=>r.scene.groundColor}}),A=t.getSketch("light").update({form:p,shade:x,uniforms:[{transform:()=>r.scene.lightTransforms[0],color:()=>r.scene.lightColor},{transform:()=>r.scene.lightTransforms[1],color:()=>r.scene.lightBackColor}],drawSettings:{enable:[s.CULL_FACE]}}),l={type:"FLOAT"},n=t.getLayer("scene").update({sketches:[A,R],uniforms:{view:()=>r.viewPort.camera.viewMat,projection:()=>r.viewPort.camera.projectionMat},drawSettings:{enable:[s.DEPTH_TEST],clearBits:u(s,"color","depth")},bufferStructure:[l,l,l,l]}),k=t.getEffect("light").update({frag:F,uniforms:{eyePosition:()=>r.viewPort.camera.position,lightMat:()=>r.scene.lightTransforms[0],view:()=>r.viewPort.camera.viewMat,tex:()=>w.image(),positions:n.image(0),normals:n.image(1),uvs:n.image(2),colors:n.image(3)},drawSettings:{enable:[s.BLEND],clearBits:u(s,"color")}});t.listen("renderer",m.RESIZE,()=>{n.update()});L(o=>{t.get("device").tpf=o,t.emit(m.FRAME),t.painter.compose(n),t.painter.draw({effects:k})},"loop");
