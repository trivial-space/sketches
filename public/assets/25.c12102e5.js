import"./modulepreload-polyfill.b7f2da20.js";import{a as m}from"./points.c0fbbf77.js";import{g as c,t as o,m as f,b as s}from"./painterState.2081fc22.js";import{i as d}from"./perspectiveViewport.0dcf679b.js";import{a as l,s as v}from"./frameLoop.4c9b21ff.js";import{e as M,c as r,r as b,ai as h}from"./vendor.86045b5f.js";import"./ast.22bf2736.js";import"./pointer.1f73fbf8.js";import"./camera.94126e27.js";const j=document.getElementById("canvas"),t=c(j);d(t,{moveSpeed:40,fovy:Math.PI*.6});const i=2e3,e=M(r(),[0,0,-100]),n=r(),p=m(t,"points",{pointSize:2.5,scalePerspective:!0,projectionMat:t.state.viewPort.camera.projectionMat,viewMat:n,positions:o(()=>[Math.random()*100-50,Math.random()*100-50,Math.random()*100-50],i),colors:o(()=>[Math.random(),Math.random(),Math.random(),1],i),drawSettings:{enable:[t.gl.DEPTH_TEST],clearColor:[1,0,1,1],clearBits:f(t.gl,"depth","color")}});l(a=>{t.state.device.tpf=a,t.emit(s.FRAME),b(e,e,.01),h(n,t.state.viewPort.camera.viewMat,e),t.painter.draw({sketches:p.sketch})},"loop");t.listen("",s.RESIZE,a=>p.update());v();