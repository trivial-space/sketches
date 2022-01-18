var x=Object.defineProperty,T=Object.defineProperties;var h=Object.getOwnPropertyDescriptors;var s=Object.getOwnPropertySymbols;var L=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable;var v=(e,t,o)=>t in e?x(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,u=(e,t)=>{for(var o in t||(t={}))L.call(t,o)&&v(e,o,t[o]);if(s)for(var o of s(t))R.call(t,o)&&v(e,o,t[o]);return e},p=(e,t)=>T(e,h(t));import"./modulepreload-polyfill.b7f2da20.js";import{g as y,b as C,r as B}from"./painterState.2081fc22.js";import"./pointer.1f73fbf8.js";const E=document.getElementById("canvas"),c=document.getElementById("paint"),n=y(E),r=p(u({},C),{PROCESS_PAINT:"process_paint",CLEANUP_PAINT:"cleanup_paint"}),i=c.getContext("2d");if(!i)throw Error("unable to initialize 2d context");const l=i.getImageData(0,0,c.width,c.height);for(let e=0;e<l.data.length;e+=4)l.data[e]=Math.random()>.5?255:0,l.data[e+3]=255;i.putImageData(l,0,0);n.listen("paint",r.CLEANUP_PAINT,e=>{i.fillStyle="black",i.fillRect(0,0,c.width,c.height)});n.listen("paint",r.PROCESS_PAINT,({device:e})=>{if(e.pointer.dragging&&e.pointer.drag.event){const{clientX:t,clientY:o}=e.pointer.drag.event,g=Math.floor(t/window.innerWidth*c.width),m=Math.floor(o/window.innerHeight*c.height);i.fillStyle="white",i.fillRect(g,m,1,1)}});var P=`precision mediump float;
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
		color = vec4(1.0, 1.0, 0.0, 1.0);
	}

	gl_FragColor = color;
}
`;const d=n.getLayer("paint"),a=256,b=n.getEffect("layer").update({frag:P,uniforms:{size:a,paint:()=>d.image(),previous:()=>"0"}}),f=n.getLayer("automaton").update({effects:b,width:a,height:a,selfReferencing:!0,bufferStructure:[{flipY:!0}]});n.listen("renderer",r.FRAME,()=>{d.update({texture:{asset:c}})});B(e=>{n.get("device").tpf=e,n.emit(r.PROCESS_PAINT),n.emit(r.FRAME),n.painter.compose(f).show(f),n.emit(r.CLEANUP_PAINT)},"loop");(!1).accept();
