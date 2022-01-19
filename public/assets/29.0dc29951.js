var A=Object.defineProperty,N=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var F=Object.getOwnPropertySymbols;var R=Object.prototype.hasOwnProperty,Y=Object.prototype.propertyIsEnumerable;var D=(e,t,o)=>t in e?A(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,v=(e,t)=>{for(var o in t||(t={}))R.call(t,o)&&D(e,o,t[o]);if(F)for(var o of F(t))Y.call(t,o)&&D(e,o,t[o]);return e},z=(e,t)=>N(e,G(t));import"./modulepreload-polyfill.b7f2da20.js";import{a as H,s as U}from"./frameLoop.4c9b21ff.js";import{g as B,b as O,z as s,f as $,m as q}from"./painterState.2081fc22.js";import{g as E}from"./blur.d5b889bc.js";import{al as Q,e as u,c,r as P,h as L,g as X,m as Z}from"./vendor.86045b5f.js";import{p as J}from"./plane.159d540e.js";import{c as K}from"./stackgl.1871bf40.js";import{i as W}from"./perspectiveViewport.0dcf679b.js";import{p as ee}from"./coords.52a43cba.js";import{m as te}from"./vectors.212c15dd.js";import{p as oe,m as re}from"./geometry.b5190803.js";import"./pointer.1f73fbf8.js";import"./camera.94126e27.js";const w=document.getElementById("canvas"),r=B(w),ie=()=>[w.width,w.height],C=v({},O),l={width:10,height:10},I=r.getForm("plane").update(J(l.width,l.height,5,5)),ae=[10,14,2],ne=[5,7,1],se=r.getForm("box").update(K(Q({size:ae,segments:ne})));var ce=`precision lowp float;
#define GLSLIFY 1

uniform sampler2D reflection;
uniform sampler2D lightTex[5];
uniform vec4 lights[5];
uniform vec2 size;
uniform vec2 lightSize;
varying vec3 V;

const vec3 up = vec3(0.0, 1.0, 0.0);

vec3 diffuseAreaLight(sampler2D tex, vec3 normal, vec3 pos, vec3 V) {
	float width = lightSize.x / 2.0;
	float height = lightSize.y / 2.0;

	vec3 right = cross(up, normal);

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

	vec3 diff = vec3(0.0);

	vec2 co = ((diagonal.xy / (d + 1.0)) + vec2(width, height)) / lightSize;
	vec3 texColor = texture2D(tex, co).rgb;

	if (nDotL > 0.0) {
		//co.x = 1.0 - co.x;
		diff = texColor;

		float NDotL = clamp(dot(-up, L), 0.0, 1.0);
		nDotL *= NDotL * 0.5 + 0.5; //distribute over hemisphere, looks better. Should be dependant of area size.

		float attenuation = 1.0 / (1.0 + d);

		diff *= nDotL * attenuation;
	}

	return diff;
}

vec3 processLight(vec4 light, sampler2D tex) {
		vec3 lightNormal = vec3(sin(light.a), 0, cos(light.a));
		vec3 diffuse = diffuseAreaLight(tex, lightNormal, light.xyz, V);
		return pow(diffuse, vec3(0.57));
}

void main() {
	float scale = (50.0 - length(V)) / 50.0;
	vec4 refl = texture2D(reflection, gl_FragCoord.xy / size);
	vec3 ground = vec3(0.0);

	ground += processLight(lights[0], lightTex[0]);
	ground += processLight(lights[1], lightTex[1]);
	ground += processLight(lights[2], lightTex[2]);
	ground += processLight(lights[3], lightTex[3]);
	ground += processLight(lights[4], lightTex[4]);

	gl_FragColor = mix(vec4(ground, 1.0), vec4(refl.rgb, 1.0), refl / 2.0 + 0.25);
	// gl_FragColor = vec4(ground, 1.0);
}
`,le=`#define GLSLIFY 1
attribute vec3 position;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec3 V;

void main() {
	vec4 pos = transform * vec4(position, 1.0);
	V = pos.xyz;
	gl_Position = projection * view * pos;
}
`,me=`precision mediump float;
#define GLSLIFY 1

uniform int withDistance;

varying float dist;
varying float height;

void main() {
	float scale = (50.0 - dist) / 50.0;
	if (withDistance == 0) {
		gl_FragColor = vec4(vec3(scale * 0.6), 1.0);
	} else {
		gl_FragColor = vec4(vec3(scale * 0.6), height);
		// gl_FragColor = vec4(vec3(height), 1.0);
	}
}
`,ge=`#define GLSLIFY 1
attribute vec3 position;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;
uniform float groundHeight;

varying float dist;
varying float height;

void main() {
	vec4 pos = transform * vec4(position, 1.0);
	dist = length(pos.xyz);
	height = (pos.y - groundHeight) / 10.0;
	gl_Position = projection * view * pos;
}
`,de=`precision lowp float;
#define GLSLIFY 1

uniform sampler2D video;
uniform int withDistance;

varying vec2 vUv;
varying float height;

void main() {
	vec4 tex = texture2D(video, vUv);
	if (withDistance == 0) {
		gl_FragColor = vec4(tex.rgb, 1.0);
	} else {
		gl_FragColor = vec4(tex.rgb, height);
		// gl_FragColor = vec4(vec3(height), 1.0);
	}
}
`,pe=`#define GLSLIFY 1
attribute vec3 position;
attribute vec2 uv;
uniform float groundHeight;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec2 vUv;
varying float height;

void main() {
	vUv = uv;
	vec4 pos = transform * vec4(position, 1.0);
	height = (pos.y - groundHeight) / 10.0;
	gl_Position = projection * view * pos;
}
`;const he=r.getShade("ground").update({vert:le,frag:ce}),fe=r.getShade("object").update({vert:ge,frag:me}),ve=r.getShade("screen").update({vert:pe,frag:de}),m=["tworooms","behindglass","nanofuzz","balloon","threescreens"],ue="//s3.eu-central-1.amazonaws.com/trivialspace.net/tvs1/",Le=6e4;function we(e){const t=document.createElement("video");t.crossOrigin="anonymous",t.loop=!0,t.playsinline=!0,t.autoplay;const o=document.createElement("source");o.src=e+".webm",o.type="video/webm";const i=document.createElement("source");return i.src=e+".mp4",i.type="video/mp4",t.appendChild(o),t.appendChild(i),t}const be=Promise.all(m.map(e=>we(ue+e)).map(e=>new Promise((t,o)=>{const i=setTimeout(()=>{console.log("timeout",e),o("Video timeout "+e)},Le);e.addEventListener("canplay",()=>{t(e),clearTimeout(i),console.log("loaded",e)})}))),xe=25,ye=2,g=[1.6,1,1],d=m.map((e,t)=>Math.PI*2*t/m.length),b=d.map(e=>{const t=-e-Math.PI/2,[o,i]=ee([xe,t]);return[o,ye,i]}),Se=s((e,t)=>{const o=u(c(),t);return P(o,o,e),L(o,o,g),o},d,b),je=s((e,t)=>{const o=te(1.045,t);o[1]-=2;const i=u(c(),o);return P(i,i,e),L(i,i,g.map(f=>f*1.03)),i},d,b),Fe=$(s((e,t)=>[...e,t],b,d)),De=[l.width*g[0],l.height*g[1]],x=[0,-3.6,0],ze=[0,1,0],y=1e3,a=c(),Ee=c();u(a,x);X(a,a,Math.PI/2);L(a,a,[y,y,y]);const Pe=oe(ze,x),Ce=re(Pe),{gl:Ie,state:p}=r;W(r,{fovy:Math.PI*.4,lookSpeed:2});const S={clearBits:q(Ie,"color","depth")};r.painter.updateDrawSettings({clearColor:[0,0,0,1]});const Ve={flipY:!0,minFilter:"LINEAR",wrap:"CLAMP_TO_EDGE"},j=m.map(e=>r.getLayer(e)),h=256,V=j.map((e,t)=>{const o="vref"+t;return r.getLayer(o).update({bufferStructure:[{minFilter:"LINEAR",magFilter:"LINEAR"}],width:h,height:h,effects:E(r,o,{strength:4,size:[h,h],startLayer:e})})}),T=r.getSketch("screens").update({form:I,shade:ve,uniforms:s((e,t)=>({transform:e,video:()=>t.image()}),Se,j),drawSettings:S}),_=r.getSketch("pedestals").update({form:se,shade:fe,uniforms:je.map(e=>({transform:e}))}),Te=E(r,"blur",{strength:4,strengthOffset:.3,blurRatioVertical:3,size:[256,256]}),k=r.getLayer("mirrorScene").update({sketches:[T,_],effects:Te,drawSettings:S,uniforms:{view:()=>Z(Ee,p.viewPort.camera.viewMat,Ce),projection:()=>p.viewPort.camera.projectionMat,withDistance:1,groundHeight:()=>x[1]},width:256,height:256,bufferStructure:[{magFilter:"LINEAR",minFilter:"LINEAR"}]}),_e=r.getSketch("ground").update({form:I,shade:he,uniforms:{reflection:()=>k.image(),transform:a,lights:Fe,lightSize:De,lightTex:()=>V.map(e=>e.image()),size:ie}}),M=r.getLayer("scene").update({sketches:[T,_,_e],drawSettings:S,uniforms:{view:()=>p.viewPort.camera.viewMat,projection:()=>p.viewPort.camera.projectionMat,withDistance:0},directRender:!0});r.listen("renderer",C.RESIZE,()=>{M.update()});const n=r.get("device");be.then(e=>{function t(){e.forEach(o=>o.play()),n.canvas.removeEventListener("mousedown",t),n.canvas.removeEventListener("touchstart",t)}n.canvas.addEventListener("mousedown",t),n.canvas.addEventListener("touchstart",t),H(o=>{n.tpf=o,r.emit(C.FRAME),j.forEach((i,f)=>i.update({texture:z(v({},Ve),{asset:e[f]})})),r.painter.compose(...V,k,M)},"render"),U()});
