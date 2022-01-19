var N=Object.defineProperty,V=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var w=Object.getOwnPropertySymbols;var x=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var I=(t,e,i)=>e in t?N(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,y=(t,e)=>{for(var i in e||(e={}))x.call(e,i)&&I(t,i,e[i]);if(w)for(var i of w(e))C.call(e,i)&&I(t,i,e[i]);return t},D=(t,e)=>V(t,G(e));var S=(t,e)=>{var i={};for(var l in t)x.call(t,l)&&e.indexOf(l)<0&&(i[l]=t[l]);if(t!=null&&w)for(var l of w(t))e.indexOf(l)<0&&C.call(t,l)&&(i[l]=t[l]);return i};var n=(t,e,i)=>(I(t,typeof e!="symbol"?e+"":e,i),i);import"./modulepreload-polyfill.b7f2da20.js";import{b as M,g as H,q as z,t as v,d as T,n as m,u as B,h as Y,v as k,r as W}from"./painterState.2081fc22.js";import{s as X}from"./core.f107e89c.js";import{g as Q,a as Z}from"./geometry.b5190803.js";import{a8 as q,am as $,c as J,a3 as K}from"./vendor.86045b5f.js";import{P as tt}from"./camera.94126e27.js";import{p as et}from"./plane.159d540e.js";import"./pointer.1f73fbf8.js";import"./vectors.212c15dd.js";var it="/assets/tile_lb_A_1.be3d5c38.jpg",ot="/assets/tile_lb_A_2.be66e9a6.jpg",nt="/assets/tile_lb_A_3.dd5b3a57.jpg",st="/assets/tile_lb_B_1.ea898955.jpg",lt="/assets/tile_lb_B_2.8aaddfd8.jpg",rt="/assets/tile_lb_B_3.242761f5.jpg",at="/assets/tile_lr_A_1.a213f3d6.jpg",ct="/assets/tile_lr_B_1.5b0d2d71.jpg",_t="/assets/tile_lr_C_1.3fc8f0cf.jpg",ft="/assets/tile_lr_D_1.c7577dd6.jpg",pt="/assets/tile_lr_D_2.0003ce1c.jpg",gt="/assets/tile_lr_D_3.0c49d3ea.jpg",ht="/assets/tile_lr_E_1.cc04cca8.jpg",dt="/assets/tile_lr_E_2.85e388d8.jpg",ut="/assets/tile_lr_E_3.43bdc593.jpg",mt="/assets/tile_lrtb_A_1.c133cfcd.jpg",bt="/assets/tile_lrtb_B_1.65dca693.jpg",vt="/assets/tile_lrtb_C_1.7c0265e5.jpg",wt="/assets/tile_ltb_A_1.24c13102.jpg",jt="/assets/tile_ltb_B_1.7acfc01b.jpg";const Et=t=>t;class It{constructor(e){n(this,"easeFn",Et);n(this,"duration",1e3);n(this,"delay",0);n(this,"repeat",!1);n(this,"onComplete");n(this,"onStart");n(this,"onUpdate");n(this,"progress");n(this,"oldValue");n(this,"done",!1);Object.assign(this,e),this.progress=-this.delay,this.oldValue=this.easeFn(0)}update(e){if(this.done||(this.progress+=e,this.progress<=0))return 0;this.progress<=e&&this.onStart&&this.onStart();const i=this.progress<this.duration?this.easeFn(this.progress/this.duration):this.easeFn(1),l=i-this.oldValue;return this.oldValue=i,this.onUpdate&&this.onUpdate(l),this.progress>=this.duration&&(this.repeat===!0||typeof this.repeat=="number"&&this.repeat>0?(typeof this.repeat=="number"&&this.repeat--,this.progress=0):(this.onComplete&&this.onComplete(),this.done=!0)),l}}let j=[],U=!1;function b(t,e){U||(t.listen("_transitionRunner",M.FRAME,l=>{j=j.filter(o=>!o.done),j.forEach(o=>o.update(l.device.tpf))}),U=!0);const i=new It(e);return j.push(i),i}const At=document.getElementById("canvas"),r=H(At),h=D(y({},M),{INIT:"init",ON_IMAGES_LOADED:"on_image_loaded",NEW_ACTIVE_TILES:"new_active_tiles"}),P={lbA1:{file:"tile_lb_A_1",connections:[0,0,1,1]},lbA2:{file:"tile_lb_A_2",connections:[0,0,1,1]},lbA3:{file:"tile_lb_A_3",connections:[0,0,1,1]},lbB1:{file:"tile_lb_B_1",connections:[0,0,1,1]},lbB2:{file:"tile_lb_B_2",connections:[0,0,1,1]},lbB3:{file:"tile_lb_B_3",connections:[0,0,1,1]},lrA1:{file:"tile_lr_A_1",connections:[0,1,0,1]},lrB1:{file:"tile_lr_B_1",connections:[0,1,0,1]},lrC1:{file:"tile_lr_C_1",connections:[0,1,0,1]},lrD1:{file:"tile_lr_D_1",connections:[0,1,0,1]},lrD2:{file:"tile_lr_D_2",connections:[0,1,0,1]},lrD3:{file:"tile_lr_D_3",connections:[0,1,0,1]},lrE1:{file:"tile_lr_E_1",connections:[0,1,0,1]},lrE2:{file:"tile_lr_E_2",connections:[0,1,0,1]},lrE3:{file:"tile_lr_E_3",connections:[0,1,0,1]},lrtbA1:{file:"tile_lrtb_A_1",connections:[1,1,1,1]},lrtbB1:{file:"tile_lrtb_B_1",connections:[1,1,1,1]},lrtbC1:{file:"tile_lrtb_C_1",connections:[1,1,1,1]},ltbA1:{file:"tile_ltb_A_1",connections:[1,0,1,1]},ltbB1:{file:"tile_ltb_B_1",connections:[1,0,1,1]}},xt=[{lbA1:1,lbA2:1,lbA3:1,lbB1:1,lbB2:1,lbB3:1,lrD1:1,lrD2:1,lrD3:1,lrE1:1,lrE2:1,lrE3:1,lrtbA1:1,lrtbB1:1,lrtbC1:1,ltbA1:1,ltbB1:1}];class Ct{constructor(){n(this,"tileSize",3);n(this,"tileDensity",11);n(this,"color",[m(),m(),m()]);n(this,"set",B(xt));n(this,"animationDuration",1700);n(this,"animationChance",.01);n(this,"liftHeight",1);n(this,"sinkHeight",-100);n(this,"flipped",!1);n(this,"colCount",0);n(this,"rowCount",0);n(this,"images",{});n(this,"activeTiles",[]);n(this,"grid",[])}}class yt{constructor(e,i,l){n(this,"gridIndex",[0,0]);n(this,"pos",[0,0]);n(this,"posOffset",[0,0]);n(this,"transform",J());n(this,"tileSpecId");n(this,"tileSpec");n(this,"turn");n(this,"roll");n(this,"color");n(this,"neighbours",[]);n(this,"flipped",!1);n(this,"yawDirection",0);n(this,"yawDelay",0);n(this,"yaw",0);n(this,"height",0);n(this,"rotation",K());n(this,"updateTransform",!1);n(this,"connections",[0,0,0,0]);const[o,p,s]=i;this.color=[o+(m()-.6)*.25,p+(m()-.6)*.25,s+(m()-.6)*.25],this.tileSpecId=B(Object.keys(e)),this.turn=Y(3),this.tileSpec=l[this.tileSpecId],this.roll=this.turn*Math.PI/2}isConnected(){return this.height<.1&&this.height>-.1}connect(){for(let e=0;e<4;e++){const i=(e+4-this.turn)%4,l=this.tileSpec.connections[i],o=this.neighbours[e],p=o?(e+6-o.turn)%4:0,s=this.connections[i];let a;if(this.isConnected()&&o&&o.isConnected()){const _=o.tileSpec.connections[p];a=l&&_}else a=0;s!==a&&(a===0?b(r,{duration:300,onUpdate:_=>{this.connections[i]=Math.max(0,this.connections[i]-_),o&&(o.connections[p]=Math.max(0,o.connections[p]-_))}}):b(r,{duration:300,onUpdate:_=>{this.connections[i]=Math.min(1,this.connections[i]+_),o&&(o.connections[p]=Math.min(1,o.connections[p]+_))}}))}}disconnect(){for(let e=0;e<4;e++){const i=this.neighbours[e],l=i?(e+6-i.turn)%4:0;b(r,{duration:300,onUpdate:o=>{this.connections[e]=Math.max(0,this.connections[e]-o),i&&(i.connections[l]=Math.max(0,i.connections[l]-o))}})}}}const E={UP:0,RIGHT:1,DOWN:2,LEFT:3};function Dt(t){return-Math.cos(t*Math.PI*2)*.5+.5}function St(t){return-Math.cos(t*Math.PI)*.5+.5}function Mt(t){return t*t*t*t}function Tt(t){return Math.pow(t,.25)}function Bt(t){return new URL({"../img/tile_lb_A_1.jpg":it,"../img/tile_lb_A_2.jpg":ot,"../img/tile_lb_A_3.jpg":nt,"../img/tile_lb_B_1.jpg":st,"../img/tile_lb_B_2.jpg":lt,"../img/tile_lb_B_3.jpg":rt,"../img/tile_lr_A_1.jpg":at,"../img/tile_lr_B_1.jpg":ct,"../img/tile_lr_C_1.jpg":_t,"../img/tile_lr_D_1.jpg":ft,"../img/tile_lr_D_2.jpg":pt,"../img/tile_lr_D_3.jpg":gt,"../img/tile_lr_E_1.jpg":ht,"../img/tile_lr_E_2.jpg":dt,"../img/tile_lr_E_3.jpg":ut,"../img/tile_lrtb_A_1.jpg":mt,"../img/tile_lrtb_B_1.jpg":bt,"../img/tile_lrtb_C_1.jpg":vt,"../img/tile_ltb_A_1.jpg":wt,"../img/tile_ltb_B_1.jpg":jt}[`../img/${t}.jpg`],self.location).href}r.listen("tiles",h.INIT,({tiles:t})=>{t.images={},Promise.all(Object.values(z((e,i)=>new Promise(l=>{const o=new Image;o.onload=l,o.src=Bt(P[i].file),t.images[i]=o}),t.set))).then(()=>{r.emit(h.ON_IMAGES_LOADED),r.emit(h.RESIZE)})});r.listen("tiles",h.RESIZE,i=>{var l=i,{tiles:t}=l,e=S(l,["tiles"]);const o=e.device.canvas,p=o.width/o.height;t.colCount=Math.floor(Math.pow(o.width/1e3,.5)*t.tileDensity),t.rowCount=Math.ceil(t.colCount/p),Ut(t.colCount,t.rowCount,t.color,t.set,t.grid),Pt(t)});r.listen("tiles",h.FRAME,({tiles:t})=>{Ft(t)});r.set("tiles",new Ct);function Ut(t,e,i,l,o){const p=o.length,s=o[0]&&o[0].length||0,a=e-s,_=t-p,u=()=>new yt(l,i,P);if(_>0){const c=Math.floor(_/2),f=_-c,g=Math.max(e,s),d=()=>v(u,g);o.unshift(...v(d,c)),o.push(...v(d,f))}if(a>0){const c=Math.floor(a/2),f=a-c;o.forEach(g=>{g.unshift(...v(u,c)),g.push(...v(u,f))})}if(_>0||a>0)for(let c=0;c<o.length;c++)for(let f=0;f<o[c].length;f++){const g=o[c][f];g.gridIndex=[c,f],g.neighbours[E.LEFT]=o[c-1]&&o[c-1][f],g.neighbours[E.RIGHT]=o[c+1]&&o[c+1][f],g.neighbours[E.UP]=o[c][f-1],g.neighbours[E.DOWN]=o[c][f+1]}}function Pt(t){const e=t.activeTiles=[],i=t.grid.length,l=t.grid[0].length,o=-Math.floor(i/2),p=-Math.floor(l/2),s=i-t.colCount;let a=Math.floor(s/2);(i+1)%2&&s%2&&a++;const _=Math.floor((l-t.rowCount)/2),u=(t.colCount+1)%2*.5,c=t.rowCount%2*.5+.5;T(f=>{T(g=>{const d=t.grid[f+a][g+_];if(d){const[R,O]=d.gridIndex;d.posOffset=[u,c],d.updateTransform=!0,d.yawDelay=(f+(t.rowCount-g+1))*100,d.pos=[o+R,p+O],e.push(d)}},t.rowCount)},t.colCount),e.forEach(f=>f.connect()),r.emit(h.NEW_ACTIVE_TILES)}function Ft(t){const e=t.activeTiles,i=t.animationDuration,l=t.animationChance/t.activeTiles.length,o=t.tileSize*.95;for(const p in e){const s=e[p];if(Math.random()<l){s.disconnect();const a=X(Math.random()-.5);b(r,{duration:i,easeFn:St,onUpdate:_=>{s.roll+=_*Math.PI/2*a,s.updateTransform=!0},onComplete:()=>{s.turn=a>0?(s.turn+1)%4:a<0?(s.turn+3)%4:s.turn,s.connect()}}),b(r,{duration:i,easeFn:Dt,onUpdate:_=>{s.height+=_*t.liftHeight,s.updateTransform=!0}})}if(t.flipped!==s.flipped&&(s.flipped=t.flipped,b(r,{duration:i,easeFn:t.flipped?Mt:Tt,delay:s.yawDelay,onStart:()=>s.disconnect(),onUpdate:a=>{s.yaw+=a*Math.PI,s.height+=a*t.sinkHeight*(s.flipped?1:-1),s.updateTransform=!0},onComplete:()=>{s.flipped||s.connect()}})),s.updateTransform){s.updateTransform=!1,q(s.rotation,Z(s.yaw),Q(s.roll));const[a,_]=s.pos,[u,c]=s.posOffset;$(s.transform,s.rotation,[(a+u)*o,(_+c)*o,s.height])}}}class Lt{constructor(){n(this,"distance",1);n(this,"camera",new tt({fovy:Math.PI*.5,position:[0,0,0]}))}}r.listen("viewPort",h.RESIZE,t=>{const e=t.viewPort,i=e.camera;e.distance=t.tiles.colCount*t.tiles.tileSize*.47,i.aspect=t.device.canvas.width/t.device.canvas.height,i.needsUpdateProjection=!0,i.position=[0,0,e.distance/i.aspect],i.needsUpdateView=!0,i.update()});r.set("viewPort",new Lt);var Rt=`precision mediump float;
#define GLSLIFY 1

uniform sampler2D image;
uniform vec3 color;
uniform vec4 connections;

varying vec2 vUv;

void main() {
  vec4 tex = texture2D(image, vUv);
  if (tex.r > 0.9) {
    discard;
  }

  float up = 0.0;
  float right = 0.0;
  float down = 0.0;
  float left = 0.0;
  float x = vUv.x - 0.5;
  float y = vUv.y;

  if (connections[0] > 0.0) {
    up = x * x * 2.0 + y * y * 2.0;
    up = connections[0] - up;
    up = max(0.0, up);
    up *= up;
  }

  if (connections[1] > 0.0) {
    x = vUv.x - 1.0;
    y = vUv.y - 0.5;
    right = x * x * 2.0 + y * y * 2.0;
    right = connections[1] - right;
    right = max(0.0, right);
    right *= right;
  }

  if (connections[2] > 0.0) {
    x = vUv.x - 0.5;
    y = vUv.y - 1.0;
    down = x * x * 2.0 + y * y * 2.0;
    down = connections[2] - down;
    down = max(0.0, down);
    down *= down;
  }

  if (connections[3] > 0.0) {
    x = vUv.x;
    y = vUv.y - 0.5;
    left = x * x * 2.0 + y * y * 2.0;
    left = connections[3] - left;
    left = max(0.0, left);
    left *= left;
  }

  // smooth out border
  /* col /= resolution.x * resolution.y * 0.5; */
  /* col = sqrt(col); */

	float glow = up + right + left + down;

	vec3 result = 0.8 - color.rgb * (1.0 - tex.r);
	float red = result.r;

	if (abs(tex.g - tex.r) > 0.1 && tex.g > 0.9) {
		red = mix(red, 1.0, glow);
	}

  gl_FragColor = vec4(red, result.gb, 1.0);
  // gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = connections;
}
`,Ot=`#define GLSLIFY 1
attribute vec3 position;
attribute vec2 uv;

uniform mat4 transform;
uniform mat4 projection;
uniform mat4 view;

varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projection * view * transform * vec4(position, 1.0);
}
`;r.painter.updateDrawSettings({clearColor:[1,1,1,1],enable:[r.gl.DEPTH_TEST,r.gl.CULL_FACE]});const Nt=r.getShade("shade").update({frag:Rt,vert:Ot}),F=r.state.tiles.tileSize,Vt=r.getForm("form").update(et(F,F,3,3)),A={},L=r.getSketch("tiles");r.listen("render",h.ON_IMAGES_LOADED,t=>{k((e,i)=>{A[i]=r.getLayer(i).update({texture:{minFilter:"LINEAR_MIPMAP_LINEAR",magFilter:"LINEAR",asset:e}})},t.tiles.images)});r.listen("render",h.NEW_ACTIVE_TILES,t=>{L.update({form:Vt,shade:Nt,uniforms:t.tiles.activeTiles.map(e=>({view:()=>t.viewPort.camera.viewMat,projection:()=>t.viewPort.camera.projectionMat,transform:e.transform,image:A[e.tileSpecId]&&A[e.tileSpecId].image(),color:e.color,connections:e.connections}))})});r.listen("start",h.ON_IMAGES_LOADED,t=>{W(e=>{t.device.tpf=e,r.emit(h.FRAME),r.painter.draw({sketches:L})},"loop")});r.emit(h.INIT);
