var v=Object.defineProperty;var n=Object.getOwnPropertySymbols;var d=Object.prototype.hasOwnProperty,f=Object.prototype.propertyIsEnumerable;var i=(t,e,r)=>e in t?v(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,c=(t,e)=>{for(var r in e||(e={}))d.call(e,r)&&i(t,r,e[r]);if(n)for(var r of n(e))f.call(e,r)&&i(t,r,e[r]);return t};var a=(t,e,r)=>(i(t,typeof e!="symbol"?e+"":e,r),r);import"./modulepreload-polyfill.b7f2da20.js";import{g as u,b as g,t as j,n as b,r as w}from"./painterState.2081fc22.js";import{c as F,r as q}from"./vendor.86045b5f.js";import{n as h}from"./primitives.6d8411f1.js";import{e as y,q as E}from"./quad.93433895.js";import{c as S}from"./stackgl.1871bf40.js";import{i as B}from"./perspectiveViewport.0dcf679b.js";import"./pointer.1f73fbf8.js";import"./core.b58d4e59.js";import"./core.f107e89c.js";import"./vectors.212c15dd.js";import"./camera.94126e27.js";const C=document.getElementById("canvas"),o=u(C),m=c({},g);class L{constructor(){a(this,"transform",F());a(this,"color",j(b,3))}update(e){q(this.transform,this.transform,e*.003)}}class R{constructor(){a(this,"quad",new L)}}o.listen("entities",m.FRAME,t=>{const e=t.entities,r=t.device.tpf;e.quad.update(r)});o.set("entities",new R,{reset:{quad:{color:!0}}});const s=y([0,-2,0],[[-1,1,0],[1,1,0]]),P=o.getForm("plane").update(S({position:s,color:s.map(()=>o.state.entities.quad.color),normal:s.map(()=>h(s)),cells:E}));var p=`precision mediump float;
#define GLSLIFY 1

varying vec3 vColor;
varying vec3 normal;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`,l=`#define GLSLIFY 1
attribute vec3 position;
attribute vec3 normal;
attribute vec3 color;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec3 vColor;
varying vec3 vNormal;

void main() {
	vNormal = normal;
	vColor = color;
	gl_Position = projection * view * transform * vec4(position, 1.0);
}
`;console.log("frag",p);console.log("vert",l);B(o);const _=o.getShade("base").update({vert:l,frag:p}),k=o.getSketch("quad").update({form:P,shade:_,uniforms:{transform:()=>o.state.entities.quad.transform}}),I=o.getLayer("scene").update({sketches:[k],uniforms:{view:()=>o.state.viewPort.camera.viewMat,projection:()=>o.state.viewPort.camera.projectionMat},drawSettings:{clearBits:o.gl.DEPTH_BUFFER_BIT|o.gl.COLOR_BUFFER_BIT},directRender:!0});w(t=>{o.state.device.tpf=t,o.emit(m.FRAME),o.painter.compose(I)},"loop");(!1).accept();
