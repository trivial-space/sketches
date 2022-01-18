var me=Object.defineProperty;var H=Object.getOwnPropertySymbols;var fe=Object.prototype.hasOwnProperty,pe=Object.prototype.propertyIsEnumerable;var Y=(s,e,o)=>e in s?me(s,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[e]=o,G=(s,e)=>{for(var o in e||(e={}))fe.call(e,o)&&Y(s,o,e[o]);if(H)for(var o of H(e))pe.call(e,o)&&Y(s,o,e[o]);return s};import"./modulepreload-polyfill.b7f2da20.js";import{g as ge,b as de,m as P,r as ue}from"./painterState.2081fc22.js";import{a as Q,g as xe}from"./ast.22bf2736.js";import{j as d,u as a,l as u,B as r,ad as he,P as C,ae as ve,x as l,N as i,v as x,n as f,w as h,V as M,R as _,A as n,Q as L,z as c,$ as X,M as T,D as v,O as q,y as Te,S as Se,T as je,L as we,k as S,o as O,t as Fe,F as be,_ as Ee,c as j,af as w}from"./vendor.86045b5f.js";import{m as ke,c as ye}from"./mirror-scene.d1c1d204.js";import{i as Pe}from"./perspectiveViewport.0dcf679b.js";import{g as Ce}from"./texture-helpers.e15866c2.js";import"./pointer.1f73fbf8.js";import"./blur.d5b889bc.js";import"./core.b58d4e59.js";import"./quad.93433895.js";import"./primitives.6d8411f1.js";import"./core.f107e89c.js";import"./vectors.212c15dd.js";import"./stackgl.1871bf40.js";import"./camera.94126e27.js";import"./noise.095b1379.js";const Me=document.getElementById("canvas"),t=ge(Me),R=G({},de),m=Q();let p,g;const _e=m(d([p=a("vec2","resolution"),g=a("float","time"),u(()=>{let s,e;return[s=r(he(C(m.gl_FragCoord),p)),e=r(ve(l(i(s,g),20),x(1),x(1))),f(m.gl_FragColor,h(M(_(e)),1))]})]));let F;const Le=m(d([p=a("vec2","resolution"),g=a("float","time"),F=a("sampler2D","noiseTex"),u(()=>{let s,e;return[s=r(i(n(g,3),n(C(m.gl_FragCoord),l(p,1.5)))),e=r(L(F,s)),f(m.gl_FragColor,h(M(_(i(i(i(c(T(e)),n(c(v(e)),2)),n(c(q(e)),4)),n(c(X(e)),8)))),1))]})])),Re=m(d([p=a("vec2","resolution"),g=a("float","time"),F=a("sampler2D","noiseTex"),u(()=>{let s,e,o,z;return[s=r(n(C(m.gl_FragCoord),p)),e=r(L(F,Te(l(T(s),2),i(l(l(.7,v(s)),v(s)),g)))),o=r(_(i(i(i(c(T(e)),n(c(v(e)),2)),n(c(q(e)),4)),n(c(X(e)),8)))),z=r(Se(je(c(T(s))),x(1.2))),f(m.gl_FragColor,h(M(we(i(.5,l(o,.5)),z)),1))]})])),W=Q(),Z=xe();let b,E,J,K,ee,te,se,$;const oe=Z(d([J=S("vec3","position"),K=S("vec2","uv"),ee=a("mat4","transform"),te=a("mat4","projection"),se=a("mat4","view"),b=O("vec2","vUv"),E=O("float","vHeight"),u(()=>[f(b,K),$=r(l(ee,h(J,1))),f(E,v($)),f(Z.gl_Position,l(l(te,se),$))])]));let ae,re,ie;const ne=W(d([ae=a("sampler2D","texture"),re=a("float","withDistance"),b=S("vec2","vUv"),E=S("float","vHeight"),u(()=>[ie=r(Fe(be(re,x(0)),n(E,12),x(1))),f(W.gl_FragColor,h(Ee(L(ae,b)),ie))])]));console.log(oe);console.log(ne);Pe(t,{position:[0,3,-15],rotationY:Math.PI,lookSpeed:3});const k=t.getForm("plane").update(ke(5,2)),y=t.getShade("plane").update({frag:ne,vert:oe}),D=j();w(D,D,[0,5.5,5]);const $e=t.getEffect("noise").update({frag:_e,drawSettings:{clearColor:[0,0,0,1],clearBits:P(t.gl,"color","depth")},uniforms:{time:()=>t.state.time,resolution:()=>[256,256]}}),V=t.getLayer("noise").update({effects:$e,width:256,height:256}),De=t.getSketch("noise").update({form:k,shade:y,uniforms:{texture:()=>V.image(),transform:D}}),A=j();w(A,A,[11,5.5,5]);const B=t.getLayer("noiseTex").update({texture:Ce({width:256,height:256,startX:3,startY:3,data:{magFilter:"LINEAR",minFilter:"LINEAR",wrap:"REPEAT"}})}),Ve=t.getSketch("noiseTex").update({form:k,shade:y,uniforms:{texture:()=>B.image(),transform:A}}),I=j();w(I,I,[-11,5.5,5]);const Ae=t.getEffect("noiseTex2").update({frag:Le,drawSettings:{clearBits:P(t.gl,"color","depth")},uniforms:{time:()=>t.state.time,resolution:()=>[256,256],noiseTex:()=>B.image()}}),le=t.getLayer("noiseTex2").update({effects:Ae,width:256,height:256}),Be=t.getSketch("noiseTex2").update({form:k,shade:y,uniforms:{texture:()=>le.image(),transform:I}}),N=j();w(N,N,[-22,5.5,5]);const Ie=t.getEffect("lineTex").update({frag:Re,drawSettings:{clearBits:P(t.gl,"color","depth")},uniforms:{time:()=>t.state.time,resolution:()=>[256,256],noiseTex:()=>B.image()}}),ce=t.getLayer("lineTex").update({effects:Ie,width:256,height:256}),Ne=t.getSketch("lineTex").update({form:k,shade:y,uniforms:{texture:()=>ce.image(),transform:N}}),U=ye(t,[De,Ve,Be,Ne],{scale:.5,reflectionStrength:.5});t.set("time",0);t.listen("renderer",R.FRAME,s=>{const e=s.device;s.time+=e.tpf/1e4});t.listen("renderer",R.RESIZE,()=>{V.update()});ue(s=>{t.state.device.tpf=s,t.emit(R.FRAME),t.painter.compose(le,V,ce,U.mirrorScene,U.scene).show(U.scene)},"loop");(!1).accept();
