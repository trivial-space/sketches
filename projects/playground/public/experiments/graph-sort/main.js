(()=>{"use strict";let t=null;const e={};let r=!1,i=0,n=0;function s(i){const a=n?i-n:n;if(n=i,t){for(const e in t)t[e](a);t=null}let o=0;for(const t in e)o++,e[t](a);o?requestAnimationFrame(s):(r=!1,n=0)}var a;function o(t,e,r){const i=r&&r.ignore;if("object"==typeof t&&"object"==typeof e&&!Array.isArray(t)&&!Array.isArray(e)&&t!==e){for(const r in t)if(t.hasOwnProperty(r)&&(!i||!(r in i)||!0!==i[r])){const n=t[r],s=e[r];void 0!==s&&(t[r]=o(n,s,{ignore:i&&i[r]}))}return t}return e}!function(t){t[t.CANCEL=3]="CANCEL",t[t.HELP=6]="HELP",t[t.BACK_SPACE=8]="BACK_SPACE",t[t.TAB=9]="TAB",t[t.CLEAR=12]="CLEAR",t[t.RETURN=13]="RETURN",t[t.ENTER=14]="ENTER",t[t.SHIFT=16]="SHIFT",t[t.CONTROL=17]="CONTROL",t[t.ALT=18]="ALT",t[t.PAUSE=19]="PAUSE",t[t.CAPS_LOCK=20]="CAPS_LOCK",t[t.ESCAPE=27]="ESCAPE",t[t.SPACE=32]="SPACE",t[t.PAGE_UP=33]="PAGE_UP",t[t.PAGE_DOWN=34]="PAGE_DOWN",t[t.END=35]="END",t[t.HOME=36]="HOME",t[t.LEFT=37]="LEFT",t[t.UP=38]="UP",t[t.RIGHT=39]="RIGHT",t[t.DOWN=40]="DOWN",t[t.PRINTSCREEN=44]="PRINTSCREEN",t[t.INSERT=45]="INSERT",t[t.DELETE=46]="DELETE",t[t.DIGIT_0=48]="DIGIT_0",t[t.DIGIT_1=49]="DIGIT_1",t[t.DIGIT_2=50]="DIGIT_2",t[t.DIGIT_3=51]="DIGIT_3",t[t.DIGIT_4=52]="DIGIT_4",t[t.DIGIT_5=53]="DIGIT_5",t[t.DIGIT_6=54]="DIGIT_6",t[t.DIGIT_7=55]="DIGIT_7",t[t.DIGIT_8=56]="DIGIT_8",t[t.DIGIT_9=57]="DIGIT_9",t[t.SEMICOLON=59]="SEMICOLON",t[t.EQUALS=61]="EQUALS",t[t.A=65]="A",t[t.B=66]="B",t[t.C=67]="C",t[t.D=68]="D",t[t.E=69]="E",t[t.F=70]="F",t[t.G=71]="G",t[t.H=72]="H",t[t.I=73]="I",t[t.J=74]="J",t[t.K=75]="K",t[t.L=76]="L",t[t.M=77]="M",t[t.N=78]="N",t[t.O=79]="O",t[t.P=80]="P",t[t.Q=81]="Q",t[t.R=82]="R",t[t.S=83]="S",t[t.T=84]="T",t[t.U=85]="U",t[t.V=86]="V",t[t.W=87]="W",t[t.X=88]="X",t[t.Y=89]="Y",t[t.Z=90]="Z",t[t.CONTEXT_MENU=93]="CONTEXT_MENU",t[t.NUMPAD0=96]="NUMPAD0",t[t.NUMPAD1=97]="NUMPAD1",t[t.NUMPAD2=98]="NUMPAD2",t[t.NUMPAD3=99]="NUMPAD3",t[t.NUMPAD4=100]="NUMPAD4",t[t.NUMPAD5=101]="NUMPAD5",t[t.NUMPAD6=102]="NUMPAD6",t[t.NUMPAD7=103]="NUMPAD7",t[t.NUMPAD8=104]="NUMPAD8",t[t.NUMPAD9=105]="NUMPAD9",t[t.MULTIPLY=106]="MULTIPLY",t[t.ADD=107]="ADD",t[t.SEPARATOR=108]="SEPARATOR",t[t.SUBTRACT=109]="SUBTRACT",t[t.DECIMAL=110]="DECIMAL",t[t.DIVIDE=111]="DIVIDE",t[t.F1=112]="F1",t[t.F2=113]="F2",t[t.F3=114]="F3",t[t.F4=115]="F4",t[t.F5=116]="F5",t[t.F6=117]="F6",t[t.F7=118]="F7",t[t.F8=119]="F8",t[t.F9=120]="F9",t[t.F10=121]="F10",t[t.F11=122]="F11",t[t.F12=123]="F12",t[t.F13=124]="F13",t[t.F14=125]="F14",t[t.F15=126]="F15",t[t.F16=127]="F16",t[t.F17=128]="F17",t[t.F18=129]="F18",t[t.F19=130]="F19",t[t.F20=131]="F20",t[t.F21=132]="F21",t[t.F22=133]="F22",t[t.F23=134]="F23",t[t.F24=135]="F24",t[t.NUM_LOCK=144]="NUM_LOCK",t[t.SCROLL_LOCK=145]="SCROLL_LOCK",t[t.COMMA=188]="COMMA",t[t.PERIOD=190]="PERIOD",t[t.SLASH=191]="SLASH",t[t.BACK_QUOTE=192]="BACK_QUOTE",t[t.OPEN_BRACKET=219]="OPEN_BRACKET",t[t.BACK_SLASH=220]="BACK_SLASH",t[t.CLOSE_BRACKET=221]="CLOSE_BRACKET",t[t.QUOTE=222]="QUOTE",t[t.META=224]="META"}(a||(a={}));const u=5126,f=5124,h=5125,l=3553,c=34067,d=32879,m=35866,_="CLAMP_TO_EDGE",E={renderQuad:{attribs:{position:{buffer:new Float32Array([-1,1,-1,-1,1,1,1,-1]),storeType:"STATIC"},uv:{buffer:new Float32Array([0,1,0,0,1,1,1,0]),storeType:"STATIC"}},drawType:"TRIANGLE_STRIP",itemCount:4}},g={vert:"\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 coords;\nvoid main() {\n\tcoords = uv;\n\tgl_Position = vec4(position, 0.0, 1.0);\n}",frag:"precision mediump float;\nuniform sampler2D source;\nvarying vec2 coords;\nvoid main() {\n\tgl_FragColor = texture2D(source, coords);\n}"};function p(t){return v[t].bindPoint}function A(t,e){return r=>{t.uniform1i(e,r)}}function T(t,e){return r=>{t.uniform1iv(e,r)}}function F(t,e){return r=>{t.uniform2iv(e,r)}}function y(t,e){return r=>{t.uniform3iv(e,r)}}function R(t,e){return r=>{t.uniform4iv(e,r)}}function S(t,e,r,i){const n=p(e);return e=>{t.uniform1i(i,r),t.activeTexture(t.TEXTURE0+r),t.bindTexture(n,e._texture)}}function b(t,e,r,i,n){const s=p(e),a=new Int32Array(n);for(let t=0;t<n;++t)a[t]=r+t;return e=>{t.uniform1iv(i,a);for(const r in e)t.activeTexture(t.TEXTURE0+a[r]),t.bindTexture(s,e[r]._texture)}}const v={[u]:{Type:Float32Array,size:4,setter:function(t,e){return r=>{t.uniform1f(e,r)}},arraySetter:function(t,e){return r=>{t.uniform1fv(e,r)}}},35664:{Type:Float32Array,size:8,setter:function(t,e){return r=>{t.uniform2fv(e,r)}}},35665:{Type:Float32Array,size:12,setter:function(t,e){return r=>{t.uniform3fv(e,r)}}},35666:{Type:Float32Array,size:16,setter:function(t,e){return r=>{t.uniform4fv(e,r)}}},[f]:{Type:Int32Array,size:4,setter:A,arraySetter:T},35667:{Type:Int32Array,size:8,setter:F},35668:{Type:Int32Array,size:12,setter:y},35669:{Type:Int32Array,size:16,setter:R},[h]:{Type:Uint32Array,size:4,setter:function(t,e){return r=>{t.uniform1ui(e,r)}},arraySetter:function(t,e){return r=>{t.uniform1uiv(e,r)}}},36294:{Type:Uint32Array,size:8,setter:function(t,e){return r=>{t.uniform2uiv(e,r)}}},36295:{Type:Uint32Array,size:12,setter:function(t,e){return r=>{t.uniform3uiv(e,r)}}},36296:{Type:Uint32Array,size:16,setter:function(t,e){return r=>{t.uniform4uiv(e,r)}}},35670:{Type:Uint32Array,size:4,setter:A,arraySetter:T},35671:{Type:Uint32Array,size:8,setter:F},35672:{Type:Uint32Array,size:12,setter:y},35673:{Type:Uint32Array,size:16,setter:R},35674:{Type:Float32Array,size:16,setter:function(t,e){return r=>{t.uniformMatrix2fv(e,!1,r)}}},35675:{Type:Float32Array,size:36,setter:function(t,e){return r=>{t.uniformMatrix3fv(e,!1,r)}}},35676:{Type:Float32Array,size:64,setter:function(t,e){return r=>{t.uniformMatrix4fv(e,!1,r)}}},35685:{Type:Float32Array,size:24,setter:function(t,e){return r=>{t.uniformMatrix2x3fv(e,!1,r)}}},35686:{Type:Float32Array,size:32,setter:function(t,e){return r=>{t.uniformMatrix2x4fv(e,!1,r)}}},35687:{Type:Float32Array,size:24,setter:function(t,e){return r=>{t.uniformMatrix3x2fv(e,!1,r)}}},35688:{Type:Float32Array,size:48,setter:function(t,e){return r=>{t.uniformMatrix3x4fv(e,!1,r)}}},35689:{Type:Float32Array,size:32,setter:function(t,e){return r=>{t.uniformMatrix4x2fv(e,!1,r)}}},35690:{Type:Float32Array,size:48,setter:function(t,e){return r=>{t.uniformMatrix4x3fv(e,!1,r)}}},35678:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:l},35680:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:c},35679:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:d},35682:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:l},36289:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:m},36292:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:m},36293:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:c},36298:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:l},36299:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:d},36300:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:c},36303:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:m},36306:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:l},36307:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:d},36308:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:c},36311:{Type:null,size:0,setter:S,arraySetter:b,bindPoint:m}};function U(t,e,r){return i=>{t.bindBuffer(t.ARRAY_BUFFER,i.buffer),t.enableVertexAttribArray(e),t.vertexAttribPointer(e,r.itemSize,u,i.normalize||!1,i.stride||0,i.offset||0)}}function M(t,e,r){return i=>{t.bindBuffer(t.ARRAY_BUFFER,i.buffer),t.enableVertexAttribArray(e),t.vertexAttribIPointer(e,r.itemSize,f,i.stride||0,i.offset||0)}}function w(t,e,r){const i=r.size,n=r.count;return r=>{t.bindBuffer(t.ARRAY_BUFFER,r.buffer);const s=i,a=s/n,o=v[5126].size*s,f=r.normalize||!1,h=r.offset||0,l=o/n;for(let r=0;r<n;++r)t.enableVertexAttribArray(e+r),t.vertexAttribPointer(e+r,a,u,f,o,h+l*r)}}const L={[u]:{size:4,setter:U,itemSize:1},35664:{size:8,setter:U,itemSize:2},35665:{size:12,setter:U,itemSize:3},35666:{size:16,setter:U,itemSize:4},[f]:{size:4,setter:M,itemSize:1},35667:{size:8,setter:M,itemSize:2},35668:{size:12,setter:M,itemSize:3},35669:{size:16,setter:M,itemSize:4},[h]:{size:4,setter:M,itemSize:1},36294:{size:8,setter:M,itemSize:2},36295:{size:12,setter:M,itemSize:3},36296:{size:16,setter:M,itemSize:4},35670:{size:4,setter:M,itemSize:1},35671:{size:8,setter:M,itemSize:2},35672:{size:12,setter:M,itemSize:3},35673:{size:16,setter:M,itemSize:4},35674:{size:4,setter:w,count:2},35675:{size:9,setter:w,count:3},35676:{size:16,setter:w,count:4}};function B(t,e){if(e.enable)for(const r of e.enable)t.enable(r);if(e.disable)for(const r of e.disable)t.disable(r);e.blendFunc&&t.blendFunc.apply(t,e.blendFunc),null!=e.depthFunc&&t.depthFunc(e.depthFunc),null!=e.cullFace&&t.cullFace(e.cullFace),null!=e.frontFace&&t.frontFace(e.frontFace),null!=e.lineWidth&&t.lineWidth(e.lineWidth),e.colorMask&&t.colorMask.apply(t,e.colorMask),null!=e.depthMask&&t.depthMask(e.depthMask),e.clearColor&&t.clearColor.apply(t,e.clearColor),null!=e.clearDepth&&t.clearDepth(e.clearDepth),null!=e.clearBits&&t.clear(e.clearBits)}function P(t,e){if(e.enable)for(const r of e.enable)t.disable(r);if(e.disable)for(const r of e.disable)t.enable(r)}Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Uint16Array,Uint16Array,Uint16Array,Uint16Array,Uint32Array,Uint32Array,Uint32Array,Uint32Array,Uint32Array;let x=1;class I{constructor(t,e="Form"+x++){this._painter=t,this.id=e}update(t){const e=this._painter.gl;t.drawType&&(this._drawType=e[t.drawType]),t.itemCount&&(this._itemCount=t.itemCount),this._attribs=this._attribs||{};for(const r in t.attribs){const i=t.attribs[r];null==this._attribs[r]&&(this._attribs[r]={buffer:e.createBuffer()}),e.bindBuffer(e.ARRAY_BUFFER,this._attribs[r].buffer),e.bufferData(e.ARRAY_BUFFER,i.buffer,e[(i.storeType||"STATIC")+"_DRAW"])}if(t.elements){const r=t.elements.buffer;null==this._elements&&(this._elements={buffer:e.createBuffer(),glType:null}),this._elements.glType=function(t){if(t instanceof Int8Array)return 5120;if(t instanceof Uint8Array)return 5121;if(t instanceof Uint8ClampedArray)return 5121;if(t instanceof Int16Array)return 5122;if(t instanceof Uint16Array)return 5123;if(t instanceof Int32Array)return f;if(t instanceof Uint32Array)return h;if(t instanceof Float32Array)return u;throw new Error("unsupported typed array type")}(r),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this._elements.buffer),e.bufferData(e.ELEMENT_ARRAY_BUFFER,r,e[(t.elements.storeType||"STATIC")+"_DRAW"])}return this}destroy(){const t=this._painter.gl;for(const e in this._attribs)t.deleteBuffer(this._attribs[e].buffer);this._attribs={},this._elements&&(t.deleteBuffer(this._elements.buffer),this._elements=void 0)}}function D(t,e,r=[]){for(let i=0;i<e;i++)r[i]=t(i);return r}function C(t,e=[]){for(const r of t){const t=e.length;for(let i=0;i<r.length;i++)e[i+t]=r[i]}return e}function z(t,e,r=[]){return C(function(t,e,r=[]){for(let i=0;i<e.length;i++)r[i]=t(e[i],i);return r}(t,e,r))}let N=1;class O{constructor(t,e="Texture"+N++){this._painter=t,this.id=e,this._texture=null,this._data={}}update(t){const e=this._painter.gl;if(null==this._texture&&(this._texture=e.createTexture()),e.bindTexture(e.TEXTURE_2D,this._texture),t.wrap&&t.wrap!==this._data.wrap||t.wrapS&&t.wrapS!==this._data.wrapS||t.wrapT&&t.wrapT!==this._data.wrapT){let r,i;t.wrap?r=i=t.wrap:(i=t.wrapT||_,r=t.wrapS||_),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e[r]),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e[i])}else this._data.wrap||this._data.wrapS||this._data.wrapT||(this._data.wrap=this._data.wrapT=this._data.wrapS=_,e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e[this._data.wrap]),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e[this._data.wrap]));return t.magFilter&&t.magFilter!==this._data.magFilter?e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e[t.magFilter]):this._data.magFilter||(this._data.magFilter="NEAREST",e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e[this._data.magFilter])),t.minFilter&&t.minFilter!==this._data.minFilter?e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e[t.minFilter]):this._data.minFilter||(this._data.minFilter="LINEAR",e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e[this._data.minFilter])),t.asset&&e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t.asset),void 0!==t.data&&e.texImage2D(e.TEXTURE_2D,0,"FLOAT"===t.type&&this._painter.isWebGL2?e.RGBA32F:e.RGBA,t.width,t.height,0,e.RGBA,e[t.type||"UNSIGNED_BYTE"],t.data),null!=t.flipY&&t.flipY!==this._data.flipY&&e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,t.flipY),t.minFilter&&t.minFilter.indexOf("MIPMAP")>0&&e.generateMipmap(e.TEXTURE_2D),e.bindTexture(e.TEXTURE_2D,null),Object.assign(this._data,t),this}destroy(){this._painter.gl.deleteTexture(this._texture),this._data={},this._texture=null}}let G=1;class k{constructor(t,e="Form"+G++){this._painter=t,this.id=e,this.width=0,this.height=0,this.antialias=!1,this.frameBuffer=null,this.antiAliasFrameBuffer=null,this.antiAliasRenderBuffer=null,this.textures=[],this.depthBuffer=null,this.bufferStructure=[],this._data={}}update(t){var e;const r=this._painter.gl,i=t.width||this.width,n=t.height||this.height;if(!i||!n)return this;if(i===this.width&&n===this.height){if(!t.bufferStructure)return this;if(t.bufferStructure.length===this.bufferStructure.length&&this.bufferStructure.every(((e,r)=>function(t,e){if(t===e)return!0;if(!e)return!1;const r=Object.keys(t);if(!function(t,e){if(t===e)return!0;if(!e||!t)return!1;if(t.length!==e.length)return!1;for(let r=0;r<t.length;r++)if(t[r]!==e[r])return!1;return!0}(r,Object.keys(e)))return!1;for(const i of r)if(t[i]!==e[i])return!1;return!0}(e,t.bufferStructure[r]))))return this}null==this.frameBuffer&&(this.frameBuffer=r.createFramebuffer()),null==this.depthBuffer&&(this.depthBuffer=r.createRenderbuffer()),t.bufferStructure&&t.bufferStructure.length&&(this.bufferStructure=t.bufferStructure,this.bufferStructure.some((t=>"FLOAT"===t.type))&&(this._painter.isWebGL2?r.getExtension("EXT_color_buffer_float"):r.getExtension("OES_texture_float")));const s=this.bufferStructure.length||1,a=[r.COLOR_ATTACHMENT0];if(r.bindFramebuffer(r.FRAMEBUFFER,this.frameBuffer),s>1){let t;this._painter.isWebGL2||(t=r.getExtension("WEBGL_draw_buffers"));const e=this._painter.isWebGL2?r.COLOR_ATTACHMENT0:t.COLOR_ATTACHMENT0_WEBGL;for(let t=0;t<s;t++)a[t]=e+t;this._painter.isWebGL2?r.drawBuffers(a):t.drawBuffersWEBGL(a)}if(this.antialias=1===s&&this._painter.isWebGL2&&(t.antialias||(null===(e=this._data)||void 0===e?void 0:e.antialias)),this.antialias){const t=r;null==this.antiAliasFrameBuffer&&(this.antiAliasFrameBuffer=r.createFramebuffer()),null==this.antiAliasRenderBuffer&&(this.antiAliasRenderBuffer=r.createRenderbuffer()),r.bindFramebuffer(r.FRAMEBUFFER,this.antiAliasFrameBuffer),r.bindRenderbuffer(r.RENDERBUFFER,this.antiAliasRenderBuffer),t.renderbufferStorageMultisample(r.RENDERBUFFER,Math.min(4,r.getParameter(t.MAX_SAMPLES)),t.RGBA8,i,n),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,this.antiAliasRenderBuffer),r.bindRenderbuffer(r.RENDERBUFFER,this.depthBuffer),t.renderbufferStorageMultisample(r.RENDERBUFFER,Math.min(4,r.getParameter(t.MAX_SAMPLES)),r.DEPTH_COMPONENT16,i,n),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,this.depthBuffer),r.bindFramebuffer(r.FRAMEBUFFER,this.frameBuffer)}else r.bindRenderbuffer(r.RENDERBUFFER,this.depthBuffer),r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_COMPONENT16,i,n),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,this.depthBuffer);for(let t=0;t<s;t++){this.textures[t]||(this.textures[t]=new O(this._painter,this.id+"_Texture"+t));const e=this.textures[t];e.update(Object.assign(Object.assign({minFilter:"NEAREST",magFilter:"NEAREST"},this.bufferStructure[t]),{data:null,width:i,height:n})),r.framebufferTexture2D(r.FRAMEBUFFER,a[t],r.TEXTURE_2D,e._texture,0)}if(this.antialias){r.bindFramebuffer(r.FRAMEBUFFER,this.antiAliasFrameBuffer);const e=r.checkFramebufferStatus(r.FRAMEBUFFER);e!==r.FRAMEBUFFER_COMPLETE&&console.error("antialias framebuffer error",e,t),r.bindFramebuffer(r.FRAMEBUFFER,this.frameBuffer)}const o=r.checkFramebufferStatus(r.FRAMEBUFFER);return o!==r.FRAMEBUFFER_COMPLETE&&console.error("framebuffer error",o,t),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindTexture(r.TEXTURE_2D,null),r.bindRenderbuffer(r.RENDERBUFFER,null),Object.assign(this._data,t),this.width=i,this.height=n,this}destroy(){const t=this._painter.gl;t.deleteFramebuffer(this.frameBuffer),t.deleteRenderbuffer(this.depthBuffer);for(const e of this.textures)t.deleteTexture(e);this.antiAliasFrameBuffer&&t.deleteFramebuffer(this.antiAliasFrameBuffer),this.antiAliasRenderBuffer&&t.deleteRenderbuffer(this.antiAliasRenderBuffer),this.textures=[],this.frameBuffer=null,this.depthBuffer=null,this._data={},this.bufferStructure=[],this.width=0,this.height=0}}let X=1;class W{constructor(t,e="Frame"+X++){this._painter=t,this.id=e,this.width=0,this.height=0,this.layers=[],this._data={},this._targets=[],this._textures=[]}image(t=0){return this._targets.length&&this._targets[this._targets.length-1].textures[t]||this._textures[t]}update(t={}){var e,r,i,n;const s=this._painter.gl,a=Array.isArray(t.layers)?t.layers:t.layers?[t.layers]:this.layers,o=t.selfReferencing||this._data.selfReferencing,u=a.reduce(((t,e)=>t+(e._uniforms.length||1)),0),f=o||u>1?2:u,h=t.width||(null===(e=t.texture)||void 0===e?void 0:e.width)||this._data.width||(null===(r=this._data.texture)||void 0===r?void 0:r.width)||s.canvas.width,l=t.height||(null===(i=t.texture)||void 0===i?void 0:i.height)||this._data.height||(null===(n=this._data.texture)||void 0===n?void 0:n.height)||s.canvas.height,c=t.antialias||this._data.antialias||!0;f!==this._targets.length&&this._destroyTargets();const d=Object.assign(Object.assign({},t),{width:h,height:l,antialias:c});return!this._targets.length&&f>0?this._targets=D((t=>new k(this._painter,this.id+"_target"+(t+1)).update(d)),f):this._targets.length&&this._targets.forEach((t=>{t.update(d)})),t.texture&&(this._textures[0]||(this._textures[0]=new O(this._painter,this.id+"_Texture0")),t.texture.width=h,t.texture.height=l,this._textures[0].update(t.texture)),Object.assign(this._data,t),this.layers=a,this.width=h,this.height=l,this}destroy(){this._destroyTargets(),this._textures.forEach((t=>t.destroy())),this._textures=[],this._data={},this.layers=[],this.width=0,this.height=0}_destroyTargets(){this._targets.forEach((t=>t.destroy())),this._targets=[]}_swapTargets(){if(this._targets.length>1){const t=this._targets[0];this._targets[0]=this._targets[1],this._targets[1]=t}}}let Y=1;class H{constructor(t="DrawingLayer"+Y++){this.id=t,this.sketches=[],this._data={},this._uniforms=[]}update(t){if(t.sketches&&(this.sketches=Array.isArray(t.sketches)?t.sketches:[t.sketches]),t.frag){const e=this.sketches&&this.sketches[0];e&&e.shade.update({frag:t.frag})}return t.uniforms&&(this._uniforms=Array.isArray(t.uniforms)?t.uniforms:[t.uniforms]),Object.assign(this._data,t),this}destroy(){for(const t of this.sketches)t.destroy();this._data.sketches=[],this._data={},this._uniforms=[]}}let K=1;class j{constructor(t,e="Shade"+K++){this._painter=t,this.id=e}update(t){const e=this._painter.gl,r=t.frag&&t.frag.trim()||this.fragSource,i=t.vert&&t.vert.trim()||this.vertSource;if(!r||!i||r===this.fragSource&&i===this.vertSource)return this;this.destroy(),r.indexOf("GL_EXT_draw_buffers")>=0&&e.getExtension("WEBGL_draw_buffers");const n=e.createProgram(),s=e.createShader(e.FRAGMENT_SHADER),a=e.createShader(e.VERTEX_SHADER);if(n&&a&&s){if(this._program=n,this._frag=s,this._vert=a,e.attachShader(n,a),e.attachShader(n,s),e.shaderSource(a,i),e.shaderSource(s,r),e.compileShader(a),e.compileShader(s),e.getShaderParameter(a,e.COMPILE_STATUS)||console.error("Error Compiling Vertex Shader!\n",e.getShaderInfoLog(a),Q(i)),e.getShaderParameter(s,e.COMPILE_STATUS)||console.error("Error Compiling Fragment Shader!\n",e.getShaderInfoLog(s),Q(r)),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS)){const t=e.getProgramInfoLog(n);console.error("Error in program linking:",t)}return this._uniformSetters=function(t,e){let r=0;function i(e,i){const n=t.getUniformLocation(e,i.name),s=i.size>1&&"[0]"===i.name.substr(-3),a=i.type,o=v[a];if(!o)throw new Error("unknown type: 0x"+a.toString(16));if(null==n)return;let u;if(null===o.Type){const e=r;r+=i.size,u=s?o.arraySetter(t,a,e,n,i.size):o.setter(t,a,e,n)}else u=o.arraySetter&&s?o.arraySetter(t,n):o.setter(t,n);return{setter:u,location:n}}const n={},s=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<s;++r){const s=t.getActiveUniform(e,r);if(!s)continue;let a=s.name;if("[0]"===a.substr(-3)&&(a=a.substr(0,a.length-3)),e){const t=i(e,s);t&&(n[a]=t)}}return n}(e,n),this._attributeSetters=function(t,e){const r={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const i=t.getActiveAttrib(e,n);if(!i)break;const s=t.getAttribLocation(e,i.name),a=L[i.type],o=a.setter(t,s,a);r[i.name]={setter:o,location:s}}return r}(e,n),this.fragSource=r,this.vertSource=i,this}}destroy(){const t=this._painter.gl;t.deleteProgram(this._program),t.deleteShader(this._frag),t.deleteShader(this._vert),this.vertSource=void 0,this.fragSource=void 0,this._attributeSetters={},this._uniformSetters={}}}function Q(t){return t.trim().split("\n").map(((t,e)=>e+1+": "+t)).join("\n")}let V=1;class q{constructor(t="Sketch"+V++){this.id=t,this._uniforms=[]}update(t){return t.drawSettings&&(this._drawSettings=t.drawSettings),t.form&&(this.form=t.form),t.shade&&(this.shade=t.shade),t.uniforms&&(this._uniforms=Array.isArray(t.uniforms)?t.uniforms:[t.uniforms]),this}destroy(){this.form&&this.form.destroy(),this.shade&&this.shade.destroy(),this._drawSettings=void 0,this._uniforms=[]}}class Z{constructor(t,e={}){this.canvas=t,this.isWebGL2=!0,this.maxBufferSamples=0;let r=null;if(e.useWebGL1||(r=t.getContext("webgl2",e)||t.getContext("experimental-webgl2",e)),null==r&&(this.isWebGL2=!1,r=t.getContext("webgl",e)||t.getContext("experimental-webgl",e)),null==r)throw Error("Cannot initialize WebGL.");this.gl=r,this.sizeMultiplier=e.sizeMultiplier||1,this.isWebGL2&&(this.maxBufferSamples=r.getParameter(r.MAX_SAMPLES)),this.resize(),B(r,function(t){return{clearColor:[0,0,0,1],blendFunc:[t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA]}}(r)),this._renderQuad=this.createForm().update(E.renderQuad),this._staticSketch=this.createFlatSketch()}resize(){return function(t,e=1){let r=t.width,i=t.height;if("clientWidth"in t){const n=t.getBoundingClientRect();r=n.width*e|0,i=n.height*e|0}(t.width!==r||t.height!==i)&&(t.width=r,t.height=i)}(this.gl.canvas,this.sizeMultiplier),this}destroy(){this._staticSketch.destroy(),this._renderQuad.destroy()}updateDrawSettings(t){return B(this.gl,Object.assign({},t)),this}createForm(t){return new I(this,t)}createShade(t){return new j(this,t)}createSketch(t){return new q(t)}createFlatSketch(t){const e=this.createSketch(t);return e.update({form:this._renderQuad,shade:this.createShade(e.id+"_defaultShade").update(g)})}createFrame(t){return new W(this,t)}createLayer(t){return new H(t)}createEffect(t){const e=this.createLayer(t);return e.update({sketches:this.createFlatSketch(e.id+"_effectSketch")})}draw(t,e){const r=this.gl;return r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,r.canvas.width,r.canvas.height),J(r,t,e),this}compose(...t){for(const e of t)rt(this.gl,e);return this}display(t,e=0){return this.draw(this._staticSketch,{source:t.image(e)})}}function J(t,e,r,i){const{shade:n,form:s,_drawSettings:a,_uniforms:o}=e;if(!n||!s)throw Error("cannot draw, shader or geometry are not set");t.useProgram(n._program),function(t,e){for(const r in e._attribs){const i=t._attributeSetters[r];i&&i.setter(e._attribs[r])}}(n,s),r&&tt(n,r,i),a&&B(t,a);for(let r=0;r<(o.length||1);r++)$(t,e,o[r],i);a&&P(t,a)}function $(t,e,r,i){r&&tt(e.shade,r,i),e.form._elements&&null!=e.form._elements.glType?(t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.form._elements.buffer),t.drawElements(e.form._drawType,e.form._itemCount,e.form._elements.glType,0)):t.drawArrays(e.form._drawType,0,e.form._itemCount)}function tt(t,e,r){for(const i in e){const n=t._uniformSetters[i];if(n){let t=e[i];"function"==typeof t&&(t=t()),"string"==typeof t&&r?n.setter(r[t]):n.setter(t)}}}function et(t,e,r,i,n){i?(t.bindFramebuffer(t.FRAMEBUFFER,i.antialias?i.antiAliasFrameBuffer:i.frameBuffer),t.viewport(0,0,i.width,i.height)):(t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,t.canvas.width,t.canvas.height)),e._data.drawSettings&&B(t,e._data.drawSettings);for(const i of e.sketches)J(t,i,r,n);if(i&&i.antialias){const e=t;t.bindFramebuffer(e.READ_FRAMEBUFFER,i.antiAliasFrameBuffer),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,i.frameBuffer),e.clearBufferfv(e.COLOR,0,[1,1,1,1]),e.blitFramebuffer(0,0,i.width,i.height,0,0,i.width,i.height,t.COLOR_BUFFER_BIT,t.LINEAR)}e._data.drawSettings&&P(t,e._data.drawSettings)}function rt(t,e){for(let r=0;r<e.layers.length;r++){const i=e.layers[r],n=i._uniforms.length||1;for(let s=0;s<n;s++){const n=e._targets[0],a=r+s===0&&e._textures.length?e._textures:e._targets[1]&&e._targets[1].textures;et(t,i,i._uniforms[s],n,a),e._swapTargets()}}}const it=2;let nt,st;const at={};function ot(t){return at[t]||(at[t]=st.createForm("Form_"+t))}const ut={};function ft(t){return ut[t]||(ut[t]=st.createShade("Shade_"+t))}const ht={};function lt(t){return ht[t]||(ht[t]=st.createSketch("Sketch_"+t))}const ct={};function dt(t){return ct[t]||(ct[t]=st.createLayer("Layer_"+t))}const mt={};function _t(t){return mt[t]||(mt[t]=st.createFrame("Frame_"+t))}const Et={};function gt(t){return Et[t]||(Et[t]=st.createEffect("Effect_"+t))}const pt={device:{tpf:0,sizeMultiplier:1}};window.state=pt;const At={},Tt={FRAME:"frame",RESIZE:"resize"};let Ft,yt,Rt;const St=document.getElementById("canvas"),bt=function(e,n){return e!==nt&&(nt=e,st=new Z(e,void 0),pt.device.canvas=e,Ft&&Ft(),yt&&yt(),Rt&&Rt(),Ft=function(t){function e(){t({width:window.innerWidth,height:window.innerHeight})}return window.addEventListener("resize",e),e(),function(){window.removeEventListener("resize",e)}}((()=>{return e=()=>{st.sizeMultiplier=pt.device.sizeMultiplier,st.resize(),a(Tt.RESIZE)},n=(n="resize")||e.name||i++,t=t||{},t[n]=e,void(r||(requestAnimationFrame(s),r=!0));var e,n})),yt=function(t,e){const r=e||t,{element:i=document,enableRightButton:n,holdDelay:s=400,holdRadius:a=5}=t,o={pressed:{},drag:{x:0,y:0,dX:0,dY:0,xMax:0,yMax:0},dragging:!1,holding:!1};let u=0,f=0,h=0,l=0,c=null;function d(t){t.isPrimary?(o.pressed[t.button]=t,u=h=t.clientX,f=l=t.clientY,o.dragging=!0,null!=c&&clearTimeout(c),c=setTimeout((()=>{o.drag.xMax<a&&o.drag.yMax<a&&(o.holding=!0,r(o))}),s)):o.pressed[it]=t,r(o)}function m(t){o.pressed={},delete o.drag.event,o.drag.x=0,o.drag.y=0,o.drag.dX=0,o.drag.dY=0,o.drag.xMax=0,o.drag.yMax=0,o.dragging=!1,o.holding=!1,null!=c&&clearTimeout(c),c=null,r(o)}function _(t){o.dragging&&t.isPrimary&&(o.drag.event=t,o.drag.x=u-t.clientX,o.drag.y=f-t.clientY,o.drag.dX=h-t.clientX,o.drag.dY=l-t.clientY,o.drag.xMax=Math.max(Math.abs(o.drag.x),o.drag.xMax),o.drag.yMax=Math.max(Math.abs(o.drag.y),o.drag.yMax),h=t.clientX,l=t.clientY,r(o))}function E(t){t.preventDefault()}return i.addEventListener("pointerdown",d),document.addEventListener("pointermove",_),document.addEventListener("pointerup",m),document.addEventListener("pointerleave",m),document.addEventListener("pointercancel",m),n&&i.addEventListener("contextmenu",E),r(o),function(){i.removeEventListener("pointerdown",d),document.removeEventListener("pointermove",_),document.removeEventListener("pointerup",m),document.removeEventListener("pointerleave",m),document.removeEventListener("pointercancel",m),n&&i.removeEventListener("contextmenu",E)}}({element:e,enableRightButton:!0,holdRadius:7,holdDelay:250},(t=>pt.device.pointer=t)),Rt=function(t,e){const r=e||t,{element:i=window}=t,n={};function s(t){n[t.keyCode]=Date.now(),r(n)}function a(t){delete n[t.keyCode],r(n)}return i.addEventListener("keyup",a,!1),i.addEventListener("keydown",s,!1),r(n),function(){i.removeEventListener("keyup",a),i.removeEventListener("keydown",s)}}((t=>pt.device.keys=t))),{painter:st,gl:st.gl,getForm:ot,getShade:ft,getSketch:lt,getLayer:dt,getFrame:_t,getEffect:gt,state:pt,get:function(t){return pt[t]},set:function(t,e,r){const i=pt;if(i[t]){const n=r&&r.reset;!0!==n&&(e=o(e,i[t],{ignore:n}))}i[t]=e},listen:function(t,e,r){At[e]||(At[e]={}),At[e][t]=r},emit:a};function a(t){const e=At[t];if(e)for(const t in e)e[t](pt)}}(St);function vt(t,e,r=[]){for(let i=0;i<t.length;i++)r[i]=t[i]+e[i];return r}function Ut(t,e,r=[]){for(let i=0;i<t.length;i++)r[i]=t[i]-e[i];return r}function Mt(t,e,r=[]){for(let i=0;i<e.length;i++)r[i]=e[i]*t;return r}function wt(t,e,r=[]){for(let i=0;i<e.length;i++)r[i]=e[i]/t;return r}function Lt(t){let e=0;for(let r=0;r<t.length;r++){const i=t[r];e+=i*i}return Math.sqrt(e)}function Bt(t,e=[]){return wt(Lt(t),t,e)}Object.assign({},Tt),Math.PI;class Pt{constructor(t){this.value=t}static of(t){return new Pt(t)}of(t){return new Pt(t)}map(t){return new Pt(t(this.value))}ap(t){return t.chain(this.map.bind(this))}chain(t){return t(this.value)}combine(t,e){return this.chain((r=>e.chain((e=>Pt.of(t(r,e))))))}pull(t,e){return this.chain((r=>Pt.of(t(r,e))))}}function xt(t,e,r){return t[e]=r(t[e]),t}function It(t){return Math.floor(Math.random()*t)}function Dt(t,e){return It(e-t)+t}const Ct=D((t=>({id:t,pos:[Math.random()*St.width,Math.random()*St.height],ns:It(6),force:[0,0]})),40),zt=C(D((t=>{if(t<37){const e=Dt(t+1,39),r=[[t,e]],i=Dt(t+1,39);return i!==e&&r.push([t,i]),r}return[]}),40));function Nt(t,e,r,i){const n=t=>r=>t.combine(Mt,e).pull(vt,r).value;xt(r,"force",n(t)),xt(i,"force",n(t.map((t=>-t))))}const Ot=bt.getForm("points"),Gt=bt.getForm("lines"),kt=bt.getShade("point").update({vert:"#define GLSLIFY 1\nattribute vec2 position;\nattribute vec3 color;\n\nuniform vec2 size;\n\nvarying vec3 vColor;\n\nvoid main() {\n\tvColor = color;\n\tgl_Position = vec4((position / size) * 2.0 - 1.0, 0.0, 1.0);\n\tgl_PointSize = 20.0;\n}\n",frag:"precision mediump float;\n#define GLSLIFY 1\n\nvarying vec3 vColor;\n\nvoid main() {\n\tgl_FragColor = vec4(vColor, 1.0);\n}\n"}),Xt=bt.getShade("line").update({vert:"#define GLSLIFY 1\nattribute vec2 position;\n\nuniform vec2 size;\n\nvoid main() {\n\tgl_Position = vec4((position / size) * 2.0 - 1.0, 0.0, 1.0);\n}\n",frag:"precision mediump float;\n#define GLSLIFY 1\n\nvoid main() {\n\tgl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}\n"}),Wt=bt.getSketch("point").update({form:Ot,shade:kt,uniforms:{size:[St.width,St.height]}}),Yt=bt.getSketch("lines").update({form:Gt,shade:Xt,drawSettings:{clearColor:[0,0,0,1],clearBits:bt.gl.COLOR_BUFFER_BIT,cullFace:bt.gl.BACK,enable:[bt.gl.CULL_FACE]},uniforms:{size:[St.width,St.height]}});let Ht=0;var Kt,jt;Kt=t=>{var r;Ht+=t,function(t){for(const t of zt){const e=Ct[t[0]],r=Ct[t[1]],i=Pt.of(r.pos).pull(Ut,e.pos),n=i.map(Bt);Nt(i.map(Lt).map((t=>t-200)).map((t=>2*t)),n,e,r)}for(let t=0;t<Ct.length-1;t++){const e=Ct[t];for(let r=t+1;r<Ct.length;r++){const t=Ct[r],i=Pt.of(t.pos).pull(Ut,e.pos),n=i.map(Bt),s=i.map(Lt);Nt(s.map((t=>-Math.max(100-t,0))),n,e,t),t.ns===e.ns?Nt(s.map((t=>t-100)),n,e,t):Nt(s.map((t=>-Math.max(200-t,0))),n,e,t)}}for(const e of Ct){const r=e.force,i=Lt(r)-3;if(i>0){const n=wt(i+3,r);e.pos=vt(e.pos,Mt(i*(t/500),n)),e.force=[0,0]}}}(t),Ot.update({drawType:"POINTS",attribs:{position:{buffer:new Float32Array(z((t=>t.pos),Ct)),storeType:"DYNAMIC"},color:{buffer:new Float32Array(z((t=>[t.ns/6*255,255*(t.ns/6+1/3)%255,255*(t.ns/6+2/3)%255].map((t=>t/255))),Ct)),storeType:"DYNAMIC"}},itemCount:Ct.length}),Gt.update({drawType:"TRIANGLES",attribs:{position:{buffer:new Float32Array(z((t=>{const e=Ct[t[0]],r=Ct[t[1]],i=Bt(Ut(r.pos,e.pos)),n=[i[1],-i[0]],s=vt(e.pos,Mt(1.5,n)),a=vt(e.pos,Mt(-1.5,n)),o=vt(r.pos,Mt(1.5,n));return C([o,a,s,a,o,vt(r.pos,Mt(-1.5,n))])}),zt)),storeType:"DYNAMIC"}},itemCount:6*zt.length}),bt.painter.draw(Yt),bt.painter.draw(Wt),Ht>=1e4&&("function"==typeof(r="render")&&(r=r.name),delete e[r])},jt=(jt="render")||Kt.name||i++,e[jt]=Kt,r||(requestAnimationFrame(s),r=!0)})();
//# sourceMappingURL=main.js.map