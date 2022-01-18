var T=Object.defineProperty,L=Object.defineProperties;var y=Object.getOwnPropertyDescriptors;var s=Object.getOwnPropertySymbols;var C=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable;var v=(e,o,r)=>o in e?T(e,o,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[o]=r,p=(e,o)=>{for(var r in o||(o={}))C.call(o,r)&&v(e,r,o[r]);if(s)for(var r of s(o))R.call(o,r)&&v(e,r,o[r]);return e},u=(e,o)=>L(e,y(o));import"./modulepreload-polyfill.b7f2da20.js";import{g as S,b,m as B,r as E}from"./painterState.2081fc22.js";import{p as P}from"./plane.159d540e.js";import{e as w,c as d,p as I,r as A}from"./vendor.86045b5f.js";import"./pointer.1f73fbf8.js";const _=document.getElementById("canvas"),n=document.getElementById("paint"),t=S(_),a=u(p({},b),{PROCESS_PAINT:"process_paint",CLEANUP_PAINT:"cleanup_paint"}),i=n.getContext("2d");if(!i)throw Error("unable to initialize 2d context");const c=i.getImageData(0,0,n.width,n.height);for(let e=0;e<c.data.length;e+=4)c.data[e]=Math.random()>.5?255:0,c.data[e+3]=255;i.putImageData(c,0,0);t.listen("paint",a.CLEANUP_PAINT,()=>{i.fillStyle="black",i.fillRect(0,0,n.width,n.height)});t.listen("paint",a.PROCESS_PAINT,({device:e})=>{if(e.pointer.dragging&&e.pointer.drag.event){const{clientX:o,clientY:r}=e.pointer.drag.event,x=Math.floor(o/window.innerWidth*n.width),h=Math.floor(r/window.innerHeight*n.height);i.fillStyle="white",i.fillRect(x,h,1,1)}});var D=`precision mediump float;
#define GLSLIFY 1

uniform sampler2D paint;
uniform sampler2D previous;
uniform float size;
varying vec2 coords;

int getCell(vec2 uv) {
	vec4 paintTex = texture2D(paint, uv);
	vec4 prevTex = texture2D(previous, uv);
	if (paintTex.r > 0.0 || prevTex.r > 0.0) {
		return 1;
	} else {
		return 0;
	}
}

void main() {
	float one = 1.0 / size;
	vec2 uvR = vec2(coords.x + one, coords.y);
	vec2 uvL = vec2(coords.x - one, coords.y);
	vec2 uvRT = vec2(coords.x + one, coords.y - one);
	vec2 uvLT = vec2(coords.x - one, coords.y - one);
	vec2 uvRB = vec2(coords.x + one, coords.y + one);
	vec2 uvLB = vec2(coords.x - one, coords.y + one);
	vec2 uvT = vec2(coords.x, coords.y - one);
	vec2 uvB = vec2(coords.x, coords.y + one);

	vec4 paintTex = texture2D(paint, coords);
	vec4 prevTex = texture2D(previous, coords);

	int cellL = getCell(uvL);
	int cellR = getCell(uvR);
	int cellT = getCell(uvT);
	int cellB = getCell(uvB);
	int cellTL = getCell(uvLT);
	int cellTR = getCell(uvRT);
	int cellBL = getCell(uvLB);
	int cellBR = getCell(uvRB);

	int neighbours = cellL + cellR + cellT + cellB + cellTL + cellTR + cellBL + cellBR;

	vec4 color = vec4(vec3(0.0), 1.0);
	if (neighbours == 3 || (neighbours == 2 && prevTex.r > 0.0) || paintTex.r > 0.0) {
		color = vec4(1.0, 0.0, 1.0, 1.0);
	}

	gl_FragColor = color;
}
`,F=`precision mediump float;
#define GLSLIFY 1
uniform sampler2D tex;
varying vec2 vUv;

void main() {
	gl_FragColor = texture2D(tex, vUv);
}
`,N=`#define GLSLIFY 1
attribute vec3 position;
attribute vec2 uv;
uniform mat4 projection;
uniform mat4 transform;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projection * transform * vec4(position, 1.0);
}
`;const f=t.getLayer("paint"),l=256,j=t.getEffect("layer").update({frag:D,uniforms:{size:l,paint:()=>f.image(),previous:"0"}}),g=t.getLayer("automaton").update({effects:j,selfReferencing:!0,width:l,height:l,bufferStructure:[{flipY:!0,wrap:"REPEAT"}]}),m=w(d(),[0,0,-3]),U=.001,M=I(d(),45,1,.01,10),Y=t.getForm("plane").update(P(2,2)),k=t.getShade("plane").update({vert:N,frag:F}),z=t.getSketch("plane").update({form:Y,shade:k,uniforms:{projection:M,transform:()=>A(m,m,U),tex:()=>g.image()},drawSettings:{clearColor:[0,1,0,1],clearBits:B(t.gl,"color")}});t.listen("renderer",a.FRAME,()=>{f.update({texture:{asset:n}})});E(e=>{t.get("device").tpf=e,t.emit(a.PROCESS_PAINT),t.emit(a.FRAME),t.painter.compose(g),t.painter.draw({sketches:z}),t.emit(a.CLEANUP_PAINT)},"loop");(!1).accept();
