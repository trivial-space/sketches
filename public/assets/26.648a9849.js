import"./modulepreload-polyfill.b7f2da20.js";import{g as e,m as i,t as o}from"./painterState.2081fc22.js";import{c as a}from"./points.c0fbbf77.js";import{a as s,s as c}from"./frameLoop.4c9b21ff.js";import"./pointer.1f73fbf8.js";import"./ast.22bf2736.js";import"./vendor.86045b5f.js";const m=document.getElementById("canvas"),t=e(m),r=100,n=a(t,"points1",{pointSize:10,dynamicForm:!0,drawSettings:{clearColor:[0,0,0,1],clearBits:i(t.gl,"color"),cullFace:t.gl.BACK,enable:[t.gl.CULL_FACE]}}),p=a(t,"points2",{pointSize:30,positions:o(()=>[Math.random()*t.gl.drawingBufferWidth,Math.random()*t.gl.drawingBufferHeight],20),color:[1,1,0,1]});s(()=>{n.update({positions:o(()=>[Math.random()*t.gl.drawingBufferWidth,Math.random()*t.gl.drawingBufferHeight],r),colors:o(()=>[Math.random(),Math.random(),Math.random(),1],r)}),t.painter.draw({sketches:[n.sketch,p.sketch]})},"loop");c();
