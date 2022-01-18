var N=Object.defineProperty,V=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var w=Object.getOwnPropertySymbols;var y=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable;var x=(t,e,n)=>e in t?N(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,M=(t,e)=>{for(var n in e||(e={}))y.call(e,n)&&x(t,n,e[n]);if(w)for(var n of w(e))S.call(e,n)&&x(t,n,e[n]);return t},A=(t,e)=>V(t,G(e));var T=(t,e)=>{var n={};for(var r in t)y.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&w)for(var r of w(t))e.indexOf(r)<0&&S.call(t,r)&&(n[r]=t[r]);return n};var i=(t,e,n)=>(x(t,typeof e!="symbol"?e+"":e,n),n);import"./modulepreload-polyfill.b7f2da20.js";import{b as D,g as H,q as z,t as b,d as U,n as _,u as P,h as Y,v as k,r as W}from"./painterState.2081fc22.js";import{s as X}from"./core.f107e89c.js";import{g as Q,a as Z}from"./geometry.b5190803.js";import{a8 as q,am as $,c as J,a3 as K}from"./vendor.86045b5f.js";import{P as tt}from"./camera.94126e27.js";import{p as et}from"./plane.159d540e.js";import"./pointer.1f73fbf8.js";import"./vectors.212c15dd.js";const nt=t=>t;class ot{constructor(e){i(this,"easeFn",nt);i(this,"duration",1e3);i(this,"delay",0);i(this,"repeat",!1);i(this,"onComplete");i(this,"onStart");i(this,"onUpdate");i(this,"progress");i(this,"oldValue");i(this,"done",!1);Object.assign(this,e),this.progress=-this.delay,this.oldValue=this.easeFn(0)}update(e){if(this.done||(this.progress+=e,this.progress<=0))return 0;this.progress<=e&&this.onStart&&this.onStart();const n=this.progress<this.duration?this.easeFn(this.progress/this.duration):this.easeFn(1),r=n-this.oldValue;return this.oldValue=n,this.onUpdate&&this.onUpdate(r),this.progress>=this.duration&&(this.repeat===!0||typeof this.repeat=="number"&&this.repeat>0?(typeof this.repeat=="number"&&this.repeat--,this.progress=0):(this.onComplete&&this.onComplete(),this.done=!0)),r}}let E=[],F=!1;function v(t,e){F||(t.listen("_transitionRunner",D.FRAME,r=>{E=E.filter(o=>!o.done),E.forEach(o=>o.update(r.device.tpf))}),F=!0);const n=new ot(e);return E.push(n),n}const it=document.getElementById("canvas"),l=H(it),p=A(M({},D),{INIT:"init",ON_IMAGES_LOADED:"on_image_loaded",NEW_ACTIVE_TILES:"new_active_tiles"}),L={lbA1:{file:"tile_lb_A_1",connections:[0,0,1,1]},lbA2:{file:"tile_lb_A_2",connections:[0,0,1,1]},lbA3:{file:"tile_lb_A_3",connections:[0,0,1,1]},lbB1:{file:"tile_lb_B_1",connections:[0,0,1,1]},lbB2:{file:"tile_lb_B_2",connections:[0,0,1,1]},lbB3:{file:"tile_lb_B_3",connections:[0,0,1,1]},lrA1:{file:"tile_lr_A_1",connections:[0,1,0,1]},lrB1:{file:"tile_lr_B_1",connections:[0,1,0,1]},lrC1:{file:"tile_lr_C_1",connections:[0,1,0,1]},lrD1:{file:"tile_lr_D_1",connections:[0,1,0,1]},lrD2:{file:"tile_lr_D_2",connections:[0,1,0,1]},lrD3:{file:"tile_lr_D_3",connections:[0,1,0,1]},lrE1:{file:"tile_lr_E_1",connections:[0,1,0,1]},lrE2:{file:"tile_lr_E_2",connections:[0,1,0,1]},lrE3:{file:"tile_lr_E_3",connections:[0,1,0,1]},lrtbA1:{file:"tile_lrtb_A_1",connections:[1,1,1,1]},lrtbB1:{file:"tile_lrtb_B_1",connections:[1,1,1,1]},lrtbC1:{file:"tile_lrtb_C_1",connections:[1,1,1,1]},ltbA1:{file:"tile_ltb_A_1",connections:[1,0,1,1]},ltbB1:{file:"tile_ltb_B_1",connections:[1,0,1,1]}},st=[{lbA1:1,lbA2:1,lbA3:1,lbB1:1,lbB2:1,lbB3:1,lrD1:1,lrD2:1,lrD3:1,lrE1:1,lrE2:1,lrE3:1,lrtbA1:1,lrtbB1:1,lrtbC1:1,ltbA1:1,ltbB1:1}];class rt{constructor(){i(this,"tileSize",3);i(this,"tileDensity",11);i(this,"color",[_(),_(),_()]);i(this,"set",P(st));i(this,"animationDuration",1700);i(this,"animationChance",.01);i(this,"liftHeight",1);i(this,"sinkHeight",-100);i(this,"flipped",!1);i(this,"colCount",0);i(this,"rowCount",0);i(this,"images",{});i(this,"activeTiles",[]);i(this,"grid",[])}}class lt{constructor(e,n,r){i(this,"gridIndex",[0,0]);i(this,"pos",[0,0]);i(this,"posOffset",[0,0]);i(this,"transform",J());i(this,"tileSpecId");i(this,"tileSpec");i(this,"turn");i(this,"roll");i(this,"color");i(this,"neighbours",[]);i(this,"flipped",!1);i(this,"yawDirection",0);i(this,"yawDelay",0);i(this,"yaw",0);i(this,"height",0);i(this,"rotation",K());i(this,"updateTransform",!1);i(this,"connections",[0,0,0,0]);const[o,u,s]=n;this.color=[o+(_()-.6)*.25,u+(_()-.6)*.25,s+(_()-.6)*.25],this.tileSpecId=P(Object.keys(e)),this.turn=Y(3),this.tileSpec=r[this.tileSpecId],this.roll=this.turn*Math.PI/2}isConnected(){return this.height<.1&&this.height>-.1}connect(){for(let e=0;e<4;e++){const n=(e+4-this.turn)%4,r=this.tileSpec.connections[n],o=this.neighbours[e],u=o?(e+6-o.turn)%4:0,s=this.connections[n];let a;if(this.isConnected()&&o&&o.isConnected()){const f=o.tileSpec.connections[u];a=r&&f}else a=0;s!==a&&(a===0?v(l,{duration:300,onUpdate:f=>{this.connections[n]=Math.max(0,this.connections[n]-f),o&&(o.connections[u]=Math.max(0,o.connections[u]-f))}}):v(l,{duration:300,onUpdate:f=>{this.connections[n]=Math.min(1,this.connections[n]+f),o&&(o.connections[u]=Math.min(1,o.connections[u]+f))}}))}}disconnect(){for(let e=0;e<4;e++){const n=this.neighbours[e],r=n?(e+6-n.turn)%4:0;v(l,{duration:300,onUpdate:o=>{this.connections[e]=Math.max(0,this.connections[e]-o),n&&(n.connections[r]=Math.max(0,n.connections[r]-o))}})}}}const I={UP:0,RIGHT:1,DOWN:2,LEFT:3};function at(t){return-Math.cos(t*Math.PI*2)*.5+.5}function ct(t){return-Math.cos(t*Math.PI)*.5+.5}function ft(t){return t*t*t*t}function ht(t){return Math.pow(t,.25)}l.listen("tiles",p.INIT,({tiles:t})=>{t.images={},Promise.all(Object.values(z((e,n)=>new Promise(r=>{const o=new Image;o.onload=r,o.src="img/"+L[n].file+".jpg",t.images[n]=o}),t.set))).then(()=>{l.emit(p.ON_IMAGES_LOADED),l.emit(p.RESIZE)})});l.listen("tiles",p.RESIZE,n=>{var r=n,{tiles:t}=r,e=T(r,["tiles"]);const o=e.device.canvas,u=o.width/o.height;t.colCount=Math.floor(Math.pow(o.width/1e3,.5)*t.tileDensity),t.rowCount=Math.ceil(t.colCount/u),ut(t.colCount,t.rowCount,t.color,t.set,t.grid),dt(t)});l.listen("tiles",p.FRAME,({tiles:t})=>{pt(t)});l.set("tiles",new rt);function ut(t,e,n,r,o){const u=o.length,s=o[0]&&o[0].length||0,a=e-s,f=t-u,g=()=>new lt(r,n,L);if(f>0){const c=Math.floor(f/2),h=f-c,d=Math.max(e,s),m=()=>b(g,d);o.unshift(...b(m,c)),o.push(...b(m,h))}if(a>0){const c=Math.floor(a/2),h=a-c;o.forEach(d=>{d.unshift(...b(g,c)),d.push(...b(g,h))})}if(f>0||a>0)for(let c=0;c<o.length;c++)for(let h=0;h<o[c].length;h++){const d=o[c][h];d.gridIndex=[c,h],d.neighbours[I.LEFT]=o[c-1]&&o[c-1][h],d.neighbours[I.RIGHT]=o[c+1]&&o[c+1][h],d.neighbours[I.UP]=o[c][h-1],d.neighbours[I.DOWN]=o[c][h+1]}}function dt(t){const e=t.activeTiles=[],n=t.grid.length,r=t.grid[0].length,o=-Math.floor(n/2),u=-Math.floor(r/2),s=n-t.colCount;let a=Math.floor(s/2);(n+1)%2&&s%2&&a++;const f=Math.floor((r-t.rowCount)/2),g=(t.colCount+1)%2*.5,c=t.rowCount%2*.5+.5;U(h=>{U(d=>{const m=t.grid[h+a][d+f];if(m){const[O,R]=m.gridIndex;m.posOffset=[g,c],m.updateTransform=!0,m.yawDelay=(h+(t.rowCount-d+1))*100,m.pos=[o+O,u+R],e.push(m)}},t.rowCount)},t.colCount),e.forEach(h=>h.connect()),l.emit(p.NEW_ACTIVE_TILES)}function pt(t){const e=t.activeTiles,n=t.animationDuration,r=t.animationChance/t.activeTiles.length,o=t.tileSize*.95;for(const u in e){const s=e[u];if(Math.random()<r){s.disconnect();const a=X(Math.random()-.5);v(l,{duration:n,easeFn:ct,onUpdate:f=>{s.roll+=f*Math.PI/2*a,s.updateTransform=!0},onComplete:()=>{s.turn=a>0?(s.turn+1)%4:a<0?(s.turn+3)%4:s.turn,s.connect()}}),v(l,{duration:n,easeFn:at,onUpdate:f=>{s.height+=f*t.liftHeight,s.updateTransform=!0}})}if(t.flipped!==s.flipped&&(s.flipped=t.flipped,v(l,{duration:n,easeFn:t.flipped?ft:ht,delay:s.yawDelay,onStart:()=>s.disconnect(),onUpdate:a=>{s.yaw+=a*Math.PI,s.height+=a*t.sinkHeight*(s.flipped?1:-1),s.updateTransform=!0},onComplete:()=>{s.flipped||s.connect()}})),s.updateTransform){s.updateTransform=!1,q(s.rotation,Z(s.yaw),Q(s.roll));const[a,f]=s.pos,[g,c]=s.posOffset;$(s.transform,s.rotation,[(a+g)*o,(f+c)*o,s.height])}}}class mt{constructor(){i(this,"distance",1);i(this,"camera",new tt({fovy:Math.PI*.5,position:[0,0,0]}))}}l.listen("viewPort",p.RESIZE,t=>{const e=t.viewPort,n=e.camera;e.distance=t.tiles.colCount*t.tiles.tileSize*.47,n.aspect=t.device.canvas.width/t.device.canvas.height,n.needsUpdateProjection=!0,n.position=[0,0,e.distance/n.aspect],n.needsUpdateView=!0,n.update()});l.set("viewPort",new mt);var gt=`precision mediump float;
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
`,_t=`#define GLSLIFY 1
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
`;l.painter.updateDrawSettings({clearColor:[1,1,1,1],enable:[l.gl.DEPTH_TEST,l.gl.CULL_FACE]});const vt=l.getShade("shade").update({frag:gt,vert:_t}),j=l.state.tiles.tileSize,bt=l.getForm("form").update(et(j,j,3,3)),C={},B=l.getSketch("tiles");l.listen("render",p.ON_IMAGES_LOADED,t=>{k((e,n)=>{C[n]=l.getLayer(n).update({texture:{minFilter:"LINEAR_MIPMAP_LINEAR",magFilter:"LINEAR",asset:e}})},t.tiles.images)});l.listen("render",p.NEW_ACTIVE_TILES,t=>{B.update({form:bt,shade:vt,uniforms:t.tiles.activeTiles.map(e=>({view:()=>t.viewPort.camera.viewMat,projection:()=>t.viewPort.camera.projectionMat,transform:e.transform,image:C[e.tileSpecId]&&C[e.tileSpecId].image(),color:e.color,connections:e.connections}))})});l.listen("start",p.ON_IMAGES_LOADED,t=>{W(e=>{t.device.tpf=e,l.emit(p.FRAME),l.painter.draw({sketches:B})},"loop")});l.emit(p.INIT);(!1).accept();
