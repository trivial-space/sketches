var R=Object.defineProperty;var d=Object.getOwnPropertySymbols;var U=Object.prototype.hasOwnProperty,Y=Object.prototype.propertyIsEnumerable;var g=(e,t,r)=>t in e?R(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,w=(e,t)=>{for(var r in t||(t={}))U.call(t,r)&&g(e,r,t[r]);if(d)for(var r of d(t))Y.call(t,r)&&g(e,r,t[r]);return e};import"./modulepreload-polyfill.b7f2da20.js";import{g as B,b as G,t as b,m as $,p as h,f as z}from"./painterState.2081fc22.js";import{a as H}from"./noise.095b1379.js";import{w as K,b as O,c as Q}from"./lines_3d.f5b3b669.js";import{i as q}from"./perspectiveViewport.0dcf679b.js";import{a as J,g as W}from"./ast.22bf2736.js";import{j,k as o,u as i,o as M,l as F,n as l,K as T,_ as X,x as n,w as p,V as y,M as Z,D as ee,ag as te,c as f,e as ae,i as re,ah as oe}from"./vendor.86045b5f.js";import{a as ne,s as se}from"./frameLoop.4c9b21ff.js";import"./pointer.1f73fbf8.js";import"./vectors.212c15dd.js";import"./primitives.6d8411f1.js";import"./core.b58d4e59.js";import"./core.f107e89c.js";import"./camera.94126e27.js";const ie=document.getElementById("canvas"),a=B(ie),v=w({},G),le=e=>e[e.length-1];a.set("lines",{line1:[]});a.listen("lines",v.FRAME,e=>{e.lines.line1=b(t=>t,100).reduce((t,r)=>t.concat(K({length:1,normalAngle:H(r/6,e.time/40)/2,tangentAngle:.1},le(t))),[O({direction:[0,0,1],normal:[-1,0,0]})])});const A=J(),N=W();let m,s,C,P,k,x,E,L,S;const me=N(j([C=o("vec3","position"),P=o("vec3","normal"),k=o("vec2","uv"),x=i("mat4","transform"),E=i("mat4","projection"),S=i("mat4","view"),L=i("mat4","normalMatrix"),m=M("vec3","vNormal"),s=M("vec2","vUv"),F(()=>[l(m,T(X(n(L,p(P,1))))),l(s,k),l(N.gl_Position,n(n(n(E,S),x),p(C,1)))])])),ce=A(j([m=o("vec3","vNormal"),s=o("vec2","vUv"),F(()=>[l(A.gl_FragColor,p(n(te(T(m),y(0,-1,0)),y(1,ee(s),Z(s))),1))])])),{gl:c,state:u}=a;q(a,{position:[0,10,30]});const V=a.getShade("line").update({vert:me,frag:ce}),D=a.getForm("line1"),pe=f(),fe=a.getSketch("line1").update({form:D,shade:V,uniforms:{transform:pe}}),I=a.getForm("line2"),ve=ae(f(),[10,0,0]),ue=a.getSketch("line2").update({form:I,shade:V,uniforms:{transform:ve}}),_=f(),de=a.getLayer("scene").update({sketches:[fe,ue],uniforms:{view:()=>u.viewPort.camera.viewMat,projection:()=>u.viewPort.camera.projectionMat,normalMatrix:()=>re(_,oe(_,u.viewPort.camera.viewMat))},drawSettings:{clearColor:[1,1,1,1],clearBits:$(c,"depth","color"),cullFace:c.FRONT,enable:[c.DEPTH_TEST,c.CULL_FACE]},directRender:!0});a.listen("renderer",v.FRAME,e=>{D.update({attribs:{position:{buffer:new Float32Array(h(t=>t.vertex,e.lines.line1)),storeType:"DYNAMIC"},normal:{buffer:new Float32Array(h(t=>t.normal,e.lines.line1)),storeType:"DYNAMIC"},uv:{buffer:new Float32Array(z(b(t=>[t/e.lines.line1.length,t/e.lines.line1.length],e.lines.line1.length))),storeType:"DYNAMIC"}},drawType:"LINE_STRIP",itemCount:e.lines.line1.length}),I.update(Q(e.lines.line1,.4,{withBackFace:!0,withNormals:!0,withUVs:!0,storeType:"DYNAMIC"}))});a.state.time=0;ne(e=>{a.state.device.tpf=e,a.state.time+=e/1e3,a.emit(v.FRAME),a.painter.compose(de)},"loop");se();