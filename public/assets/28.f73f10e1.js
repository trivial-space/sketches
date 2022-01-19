var M=Object.defineProperty;var u=Object.getOwnPropertySymbols;var D=Object.prototype.hasOwnProperty,E=Object.prototype.propertyIsEnumerable;var g=(t,e,o)=>e in t?M(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,b=(t,e)=>{for(var o in e||(e={}))D.call(e,o)&&g(t,o,e[o]);if(u)for(var o of u(e))E.call(e,o)&&g(t,o,e[o]);return t};import"./modulepreload-polyfill.b7f2da20.js";import{a as H,s as T}from"./frameLoop.4c9b21ff.js";import{g as x,b as P,t as V,f as i,n as p}from"./painterState.2081fc22.js";import{p as h}from"./core.b58d4e59.js";import{n as G}from"./primitives.6d8411f1.js";import{d as j,a as I,e as N,b as f,r as v,t as _}from"./quad.93433895.js";import{c as z}from"./stackgl.1871bf40.js";import{c as A,a3 as B,aj as O,ak as Y}from"./vendor.86045b5f.js";import{i as q}from"./perspectiveViewport.0dcf679b.js";import{c as Q}from"./mirror-scene.d1c1d204.js";import"./pointer.1f73fbf8.js";import"./core.f107e89c.js";import"./vectors.212c15dd.js";import"./camera.94126e27.js";import"./blur.d5b889bc.js";import"./ast.22bf2736.js";const $=document.getElementById("canvas"),r=x($),S=b({},P),J=h(j,.5,.5),w=h(I,.5,.5);function K(t,e=1){for(let o=0;o<e;o++)t=i(t.map(a=>i(J(a).map(w))));return t}function U(){return[p(),p(),p()]}const n=10;function W(t,e){const o=[];let a=t;for(let s=e;s>1;s--){const F=1/s+(Math.random()*2-1)*.5/s,R=1/s+(Math.random()*2-1)*.5/s,[k,L]=j(F,R,a);o.push(k),a=L}return o.push(a),o}const X=V(U,4*n),Z=N([0,-9,0],[[-10,10,-10],[10,10,-10]]);function c(t,e){return W(t,e).map(o=>i(K(w(o))))}const m=(()=>{const t=n,e=Z,o=f([0,0,20],v(e)),a=f([-20,0,0],v(o)),s=f([0,0,-20],v(a));return[c(e,t),c(o,t),c(a,t),c(s,t)]})(),tt=m.map(t=>G(t[1])),ot=r.getForm("wallsForm").update(z({position:i(i(m)),color:i(m.map((t,e)=>i(t.map((o,a)=>o.map(()=>X[e*n+a]))))),normal:i(m.map((t,e)=>i(t).map(()=>tt[e]))),cells:_(4*n*4*2)}));var et=`precision mediump float;
#define GLSLIFY 1

uniform float withDistance;

varying vec3 vColor;
varying vec3 vNormal;
varying float vHeight;

void main() {
	if (withDistance > 0.0) {
		gl_FragColor = vec4(vColor, vHeight);
	} else {
		gl_FragColor = vec4(vColor, 1.0);
	}
}
`,rt=`#define GLSLIFY 1
attribute vec3 position;
attribute vec3 normal;
attribute vec3 color;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec3 vColor;
varying vec3 vNormal;
varying float vHeight;

void main() {
	vNormal = normal;
	vec4 pos = transform * vec4(position, 1.0);
	vColor = color;
	vHeight = pos.y / 25.0;
	gl_Position = projection * view * pos;
}
`;let l=0;const y=A(),C=B();r.listen("state",S.FRAME,t=>{l+=t.device.tpf,O(C,Math.sin(7e-4*l)*1.1,l*.001,Math.sin(8e-4*l)*1.1),Y(y,C,[0,-8,0],[.8,.8,.8],[0,60,0])});q(r,{position:[0,3.4,25],fovy:Math.PI*.4,lookSpeed:2});r.painter.updateDrawSettings({enable:[r.gl.DEPTH_TEST]});const at=r.getShade("walls").update({vert:rt,frag:et}),it=r.getSketch("walls").update({form:ot,shade:at,uniforms:{transform:y}}),d=Q(r,[it],{scale:.4,blurRatioVertical:2.5,blurStrenghOffset:2.5});d.scene.update({directRender:!0});H(t=>{r.get("device").tpf=t,r.emit(S.FRAME),r.painter.compose(d.mirrorScene,d.scene)},"loop");T();
