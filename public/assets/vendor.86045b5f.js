var kn=1e-6,j=typeof Float32Array!="undefined"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var e=0,n=arguments.length;n--;)e+=arguments[n]*arguments[n];return Math.sqrt(e)});function Nn(){var e=new j(9);return j!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function xr(){var e=new j(16);return j!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function Sr(e,n,t,r,s,i,o,l,c,a,f,y,d,p,m,g){var v=new j(16);return v[0]=e,v[1]=n,v[2]=t,v[3]=r,v[4]=s,v[5]=i,v[6]=o,v[7]=l,v[8]=c,v[9]=a,v[10]=f,v[11]=y,v[12]=d,v[13]=p,v[14]=m,v[15]=g,v}function br(e,n){if(e===n){var t=n[1],r=n[2],s=n[3],i=n[6],o=n[7],l=n[11];e[1]=n[4],e[2]=n[8],e[3]=n[12],e[4]=t,e[6]=n[9],e[7]=n[13],e[8]=r,e[9]=i,e[11]=n[14],e[12]=s,e[13]=o,e[14]=l}else e[0]=n[0],e[1]=n[4],e[2]=n[8],e[3]=n[12],e[4]=n[1],e[5]=n[5],e[6]=n[9],e[7]=n[13],e[8]=n[2],e[9]=n[6],e[10]=n[10],e[11]=n[14],e[12]=n[3],e[13]=n[7],e[14]=n[11],e[15]=n[15];return e}function Mr(e,n){var t=n[0],r=n[1],s=n[2],i=n[3],o=n[4],l=n[5],c=n[6],a=n[7],f=n[8],y=n[9],d=n[10],p=n[11],m=n[12],g=n[13],v=n[14],E=n[15],P=t*l-r*o,b=t*c-s*o,M=t*a-i*o,$=r*c-s*l,x=r*a-i*l,L=s*a-i*c,I=f*g-y*m,D=f*v-d*m,G=f*E-p*m,K=y*v-d*g,H=y*E-p*g,Q=d*E-p*v,O=P*Q-b*H+M*K+$*G-x*D+L*I;return O?(O=1/O,e[0]=(l*Q-c*H+a*K)*O,e[1]=(s*H-r*Q-i*K)*O,e[2]=(g*L-v*x+E*$)*O,e[3]=(d*x-y*L-p*$)*O,e[4]=(c*G-o*Q-a*D)*O,e[5]=(t*Q-s*G+i*D)*O,e[6]=(v*M-m*L-E*b)*O,e[7]=(f*L-d*M+p*b)*O,e[8]=(o*H-l*G+a*I)*O,e[9]=(r*G-t*H-i*I)*O,e[10]=(m*x-g*M+E*P)*O,e[11]=(y*M-f*x-p*P)*O,e[12]=(l*D-o*K-c*I)*O,e[13]=(t*K-r*D+s*I)*O,e[14]=(g*b-m*$-v*P)*O,e[15]=(f*$-y*b+d*P)*O,e):null}function Cn(e,n,t){var r=n[0],s=n[1],i=n[2],o=n[3],l=n[4],c=n[5],a=n[6],f=n[7],y=n[8],d=n[9],p=n[10],m=n[11],g=n[12],v=n[13],E=n[14],P=n[15],b=t[0],M=t[1],$=t[2],x=t[3];return e[0]=b*r+M*l+$*y+x*g,e[1]=b*s+M*c+$*d+x*v,e[2]=b*i+M*a+$*p+x*E,e[3]=b*o+M*f+$*m+x*P,b=t[4],M=t[5],$=t[6],x=t[7],e[4]=b*r+M*l+$*y+x*g,e[5]=b*s+M*c+$*d+x*v,e[6]=b*i+M*a+$*p+x*E,e[7]=b*o+M*f+$*m+x*P,b=t[8],M=t[9],$=t[10],x=t[11],e[8]=b*r+M*l+$*y+x*g,e[9]=b*s+M*c+$*d+x*v,e[10]=b*i+M*a+$*p+x*E,e[11]=b*o+M*f+$*m+x*P,b=t[12],M=t[13],$=t[14],x=t[15],e[12]=b*r+M*l+$*y+x*g,e[13]=b*s+M*c+$*d+x*v,e[14]=b*i+M*a+$*p+x*E,e[15]=b*o+M*f+$*m+x*P,e}function Or(e,n,t){var r=t[0],s=t[1],i=t[2],o,l,c,a,f,y,d,p,m,g,v,E;return n===e?(e[12]=n[0]*r+n[4]*s+n[8]*i+n[12],e[13]=n[1]*r+n[5]*s+n[9]*i+n[13],e[14]=n[2]*r+n[6]*s+n[10]*i+n[14],e[15]=n[3]*r+n[7]*s+n[11]*i+n[15]):(o=n[0],l=n[1],c=n[2],a=n[3],f=n[4],y=n[5],d=n[6],p=n[7],m=n[8],g=n[9],v=n[10],E=n[11],e[0]=o,e[1]=l,e[2]=c,e[3]=a,e[4]=f,e[5]=y,e[6]=d,e[7]=p,e[8]=m,e[9]=g,e[10]=v,e[11]=E,e[12]=o*r+f*s+m*i+n[12],e[13]=l*r+y*s+g*i+n[13],e[14]=c*r+d*s+v*i+n[14],e[15]=a*r+p*s+E*i+n[15]),e}function Er(e,n,t){var r=t[0],s=t[1],i=t[2];return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=n[3]*r,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=n[7]*s,e[8]=n[8]*i,e[9]=n[9]*i,e[10]=n[10]*i,e[11]=n[11]*i,e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],e}function _r(e,n,t){var r=Math.sin(t),s=Math.cos(t),i=n[4],o=n[5],l=n[6],c=n[7],a=n[8],f=n[9],y=n[10],d=n[11];return n!==e&&(e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15]),e[4]=i*s+a*r,e[5]=o*s+f*r,e[6]=l*s+y*r,e[7]=c*s+d*r,e[8]=a*s-i*r,e[9]=f*s-o*r,e[10]=y*s-l*r,e[11]=d*s-c*r,e}function Ar(e,n,t){var r=Math.sin(t),s=Math.cos(t),i=n[0],o=n[1],l=n[2],c=n[3],a=n[8],f=n[9],y=n[10],d=n[11];return n!==e&&(e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15]),e[0]=i*s-a*r,e[1]=o*s-f*r,e[2]=l*s-y*r,e[3]=c*s-d*r,e[8]=i*r+a*s,e[9]=o*r+f*s,e[10]=l*r+y*s,e[11]=c*r+d*s,e}function qr(e,n){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=n[0],e[13]=n[1],e[14]=n[2],e[15]=1,e}function Rr(e,n){var t=Math.sin(n),r=Math.cos(n);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=r,e[6]=t,e[7]=0,e[8]=0,e[9]=-t,e[10]=r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Pr(e,n){var t=Math.sin(n),r=Math.cos(n);return e[0]=r,e[1]=0,e[2]=-t,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=t,e[9]=0,e[10]=r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Tr(e,n,t){var r=n[0],s=n[1],i=n[2],o=n[3],l=r+r,c=s+s,a=i+i,f=r*l,y=r*c,d=r*a,p=s*c,m=s*a,g=i*a,v=o*l,E=o*c,P=o*a;return e[0]=1-(p+g),e[1]=y+P,e[2]=d-E,e[3]=0,e[4]=y-P,e[5]=1-(f+g),e[6]=m+v,e[7]=0,e[8]=d+E,e[9]=m-v,e[10]=1-(f+p),e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}function jr(e,n,t,r,s){var i=n[0],o=n[1],l=n[2],c=n[3],a=i+i,f=o+o,y=l+l,d=i*a,p=i*f,m=i*y,g=o*f,v=o*y,E=l*y,P=c*a,b=c*f,M=c*y,$=r[0],x=r[1],L=r[2],I=s[0],D=s[1],G=s[2],K=(1-(g+E))*$,H=(p+M)*$,Q=(m-b)*$,O=(p-M)*x,Qe=(1-(d+E))*x,Xe=(v+P)*x,Je=(m+b)*L,Ze=(v-P)*L,en=(1-(d+g))*L;return e[0]=K,e[1]=H,e[2]=Q,e[3]=0,e[4]=O,e[5]=Qe,e[6]=Xe,e[7]=0,e[8]=Je,e[9]=Ze,e[10]=en,e[11]=0,e[12]=t[0]+I-(K*I+O*D+Je*G),e[13]=t[1]+D-(H*I+Qe*D+Ze*G),e[14]=t[2]+G-(Q*I+Xe*D+en*G),e[15]=1,e}function In(e,n,t,r,s){var i=1/Math.tan(n/2),o;return e[0]=i/t,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=i,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,s!=null&&s!==1/0?(o=1/(r-s),e[10]=(s+r)*o,e[14]=2*s*r*o):(e[10]=-1,e[14]=-2*r),e}var Fr=In,kr=Cn;function nn(){var e=new j(3);return j!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function Dn(e){var n=e[0],t=e[1],r=e[2];return Math.hypot(n,t,r)}function tn(e,n,t){var r=new j(3);return r[0]=e,r[1]=n,r[2]=t,r}function Nr(e,n,t){return e[0]=n[0]+t[0],e[1]=n[1]+t[1],e[2]=n[2]+t[2],e}function Cr(e,n,t){return e[0]=n[0]*t,e[1]=n[1]*t,e[2]=n[2]*t,e}function Gn(e,n){var t=n[0],r=n[1],s=n[2],i=t*t+r*r+s*s;return i>0&&(i=1/Math.sqrt(i)),e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e}function Vn(e,n){return e[0]*n[0]+e[1]*n[1]+e[2]*n[2]}function Re(e,n,t){var r=n[0],s=n[1],i=n[2],o=t[0],l=t[1],c=t[2];return e[0]=s*c-i*l,e[1]=i*o-r*c,e[2]=r*l-s*o,e}function Ir(e,n,t){var r=t[0],s=t[1],i=t[2],o=t[3],l=n[0],c=n[1],a=n[2],f=s*a-i*c,y=i*l-r*a,d=r*c-s*l,p=s*d-i*y,m=i*f-r*d,g=r*y-s*f,v=o*2;return f*=v,y*=v,d*=v,p*=2,m*=2,g*=2,e[0]=l+f+p,e[1]=c+y+m,e[2]=a+d+g,e}var Ln=Dn;(function(){var e=nn();return function(n,t,r,s,i,o){var l,c;for(t||(t=3),r||(r=0),s?c=Math.min(s*t+r,n.length):c=n.length,l=r;l<c;l+=t)e[0]=n[l],e[1]=n[l+1],e[2]=n[l+2],i(e,e,o),n[l]=e[0],n[l+1]=e[1],n[l+2]=e[2];return n}})();function Un(){var e=new j(4);return j!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function Bn(e,n){var t=n[0],r=n[1],s=n[2],i=n[3],o=t*t+r*r+s*s+i*i;return o>0&&(o=1/Math.sqrt(o)),e[0]=t*o,e[1]=r*o,e[2]=s*o,e[3]=i*o,e}(function(){var e=Un();return function(n,t,r,s,i,o){var l,c;for(t||(t=4),r||(r=0),s?c=Math.min(s*t+r,n.length):c=n.length,l=r;l<c;l+=t)e[0]=n[l],e[1]=n[l+1],e[2]=n[l+2],e[3]=n[l+3],i(e,e,o),n[l]=e[0],n[l+1]=e[1],n[l+2]=e[2],n[l+3]=e[3];return n}})();function rn(){var e=new j(4);return j!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function Dr(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e}function Wn(e,n,t){t=t*.5;var r=Math.sin(t);return e[0]=r*n[0],e[1]=r*n[1],e[2]=r*n[2],e[3]=Math.cos(t),e}function Gr(e,n,t){var r=n[0],s=n[1],i=n[2],o=n[3],l=t[0],c=t[1],a=t[2],f=t[3];return e[0]=r*f+o*l+s*a-i*c,e[1]=s*f+o*c+i*l-r*a,e[2]=i*f+o*a+r*c-s*l,e[3]=o*f-r*l-s*c-i*a,e}function Pe(e,n,t,r){var s=n[0],i=n[1],o=n[2],l=n[3],c=t[0],a=t[1],f=t[2],y=t[3],d,p,m,g,v;return p=s*c+i*a+o*f+l*y,p<0&&(p=-p,c=-c,a=-a,f=-f,y=-y),1-p>kn?(d=Math.acos(p),m=Math.sin(d),g=Math.sin((1-r)*d)/m,v=Math.sin(r*d)/m):(g=1-r,v=r),e[0]=g*s+v*c,e[1]=g*i+v*a,e[2]=g*o+v*f,e[3]=g*l+v*y,e}function Yn(e,n){var t=n[0]+n[4]+n[8],r;if(t>0)r=Math.sqrt(t+1),e[3]=.5*r,r=.5/r,e[0]=(n[5]-n[7])*r,e[1]=(n[6]-n[2])*r,e[2]=(n[1]-n[3])*r;else{var s=0;n[4]>n[0]&&(s=1),n[8]>n[s*3+s]&&(s=2);var i=(s+1)%3,o=(s+2)%3;r=Math.sqrt(n[s*3+s]-n[i*3+i]-n[o*3+o]+1),e[s]=.5*r,r=.5/r,e[3]=(n[i*3+o]-n[o*3+i])*r,e[i]=(n[i*3+s]+n[s*3+i])*r,e[o]=(n[o*3+s]+n[s*3+o])*r}return e}function Vr(e,n,t,r){var s=.5*Math.PI/180;n*=s,t*=s,r*=s;var i=Math.sin(n),o=Math.cos(n),l=Math.sin(t),c=Math.cos(t),a=Math.sin(r),f=Math.cos(r);return e[0]=i*c*f-o*l*a,e[1]=o*l*f+i*c*a,e[2]=o*c*a-i*l*f,e[3]=o*c*f+i*l*a,e}var sn=Bn;(function(){var e=nn(),n=tn(1,0,0),t=tn(0,1,0);return function(r,s,i){var o=Vn(s,i);return o<-.999999?(Re(e,n,s),Ln(e)<1e-6&&Re(e,t,s),Gn(e,e),Wn(r,e,Math.PI),r):o>.999999?(r[0]=0,r[1]=0,r[2]=0,r[3]=1,r):(Re(e,s,i),r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=1+o,sn(r,r))}})();(function(){var e=rn(),n=rn();return function(t,r,s,i,o,l){return Pe(e,r,o,l),Pe(n,s,i,l),Pe(t,e,n,2*l*(1-l)),t}})();(function(){var e=Nn();return function(n,t,r,s){return e[0]=r[0],e[3]=r[1],e[6]=r[2],e[1]=s[0],e[4]=s[1],e[7]=s[2],e[2]=-t[0],e[5]=-t[1],e[8]=-t[2],sn(n,Yn(n,e))}})();var Te;(function(e){e[e.FINE=0]="FINE",e[e.DEBUG=1]="DEBUG",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.SEVERE=4]="SEVERE",e[e.NONE=5]="NONE"})(Te||(Te={}));const N=Symbol(),je=()=>{},an=(()=>{try{return{}.UMBRELLA_ASSERTS==="1"}catch{}return!1})()?(e,n="assertion failed")=>{if(typeof e=="function"&&!e()||!e)throw new Error(typeof n=="function"?n():n)}:je,Kn=Object.freeze({level:Te.NONE,fine(){},debug(){},info(){},warn(){},severe(){}}),Hn=(e,n={})=>{const t=Reflect.ownKeys(e),r=Reflect.ownKeys(n),s=Symbol("isa");function i(o){for(let l of t){const c=Object.getOwnPropertyDescriptor(o.prototype,l);!c||c.configurable?Object.defineProperty(o.prototype,l,{value:e[l],writable:!0}):console.log(`not patching: ${o.name}.${l.toString()}`)}return Object.defineProperty(o.prototype,s,{value:!0}),o}for(let o of r)Object.defineProperty(i,o,{value:n[o],enumerable:n.propertyIsEnumerable(o)});return Object.defineProperty(i,Symbol.hasInstance,{value:o=>!!o[s]}),i},q=(e,n)=>(an(e.tag!=="swizzle"||e.val.tag==="sym","can't assign to non-symbol swizzle"),{tag:"assign",type:e.type,l:e,r:n}),Fe=(e,n)=>e!=null&&typeof e[n]=="function",Qn=Array.isArray,Xn=e=>e!=null&&typeof e!="function"&&e.length!==void 0,ge=e=>typeof e=="boolean",ie=e=>typeof e=="string",on=e=>e!=null&&typeof e[Symbol.iterator]=="function",Jn=e=>e instanceof Map,Zn=()=>typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node!="undefined",V=e=>typeof e=="number",cn=Object.getPrototypeOf,et=e=>{let n;return e!=null&&typeof e=="object"&&((n=cn(e))===null||cn(n)===null)},nt=/^[iub]?vec[234]$/,tt=/^mat[234]$/,rt=e=>et(e)&&!!e.tag&&!!e.type,U=e=>nt.test(e.type),me=e=>tt.test(e.type);/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function ln(e,n,t,r){var s=arguments.length,i=s<3?n:r===null?r=Object.getOwnPropertyDescriptor(n,t):r,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,n,t,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(i=(s<3?o(i):s>3?o(n,t,i):o(n,t))||i);return s>3&&i&&Object.defineProperty(n,t,i),i}const fn=Object.getPrototypeOf({}),ze="function",vn="string",B=(e,n)=>{let t;if(e===n)return!0;if(e!=null){if(typeof e.equiv===ze)return e.equiv(n)}else return e==n;if(n!=null){if(typeof n.equiv===ze)return n.equiv(e)}else return e==n;return typeof e===vn||typeof n===vn?!1:(t=Object.getPrototypeOf(e),(t==null||t===fn)&&(t=Object.getPrototypeOf(n),t==null||t===fn)?ot(e,n):typeof e!==ze&&e.length!==void 0&&typeof n!==ze&&n.length!==void 0?st(e,n):e instanceof Set&&n instanceof Set?it(e,n):e instanceof Map&&n instanceof Map?at(e,n):e instanceof Date&&n instanceof Date?e.getTime()===n.getTime():e instanceof RegExp&&n instanceof RegExp?e.toString()===n.toString():e!==e&&n!==n)},st=(e,n,t=B)=>{let r=e.length;if(r===n.length)for(;--r>=0&&t(e[r],n[r]););return r<0},it=(e,n,t=B)=>e.size===n.size&&t([...e.keys()].sort(),[...n.keys()].sort()),at=(e,n,t=B)=>e.size===n.size&&t([...e].sort(),[...n].sort()),ot=(e,n,t=B)=>{if(Object.keys(e).length!==Object.keys(n).length)return!1;for(let r in e)if(!n.hasOwnProperty(r)||!t(e[r],n[r]))return!1;return!0},ke=(e,n=t=>t!==void 0?": "+t:"")=>class extends Error{constructor(t){super(e(t)+n(t))}},ct=ke(()=>"illegal argument(s)"),Ne=e=>{throw new ct(e)},lt=ke(()=>"illegal arity"),ft=e=>{throw new lt(e)},vt=ke(()=>"unsupported operation"),ae=e=>{throw new vt(e)},pt=(e,n,t=B)=>{for(let r=e.length;--r>=0;)if(t(n,e[r]))return r;return-1};function pn(e,n){for(let t of n)e.delete(t);return e}const ut=(e,n)=>{if(e===n)return!0;if(!(n instanceof Map)||e.size!==n.size)return!1;for(let t of e.entries())if(!B(n.get(t[0]),t[1]))return!1;return!0},yt=(e,n)=>{if(e===n)return!0;if(!(n instanceof Set)||e.size!==n.size)return!1;for(let t of e.keys())if(!n.has(t))return!1;return!0},dt=e=>Fe(e,"xform")?e.xform():e;class un{constructor(n){this.value=n}deref(){return this.value}}const Ce=e=>e instanceof un,yn=e=>e instanceof un?e.deref():e,ht=e=>e.length===2?[void 0,e[1]]:e.length===3?[e[1],e[2]]:ft(e.length);function gt(...e){const n=e[0],t=n[0],r=n[1],s=n[2];e=ht(e);const i=e[0]==null?t():e[0],o=e[1];return yn(r(Fe(o,"$reduce")?o.$reduce(s,i):Xn(o)?mt(s,i,o):zt(s,i,o)))}const mt=(e,n,t)=>{for(let r=0,s=t.length;r<s;r++)if(n=e(n,t[r]),Ce(n)){n=n.deref();break}return n},zt=(e,n,t)=>{for(let r of t)if(n=e(n,r),Ce(n)){n=n.deref();break}return n},wt=(e,n)=>[e,t=>t,n];function*dn(e,n){const t=dt(e)([je,je,(r,s)=>s])[2];for(let r of n){let s=t(N,r);if(Ce(s)){s=yn(s.deref()),s!==N&&(yield s);return}s!==N&&(yield s)}}const hn=(e,n)=>[e[0],e[1],n];function Ie(e,n){return on(n)?dn(Ie(e),n):t=>{const r=t[2];return hn(t,(s,i)=>r(s,e(i)))}}function De(e,n){return on(n)?dn(De(e),n):t=>{const r=t[2];return hn(t,(s,i)=>e(i)?r(s,i):s)}}const we=Zn()?require("util").inspect:null,$t=(e,n)=>[...Ie(t=>we(t,n),e)].join(", "),xt=(e,n)=>[...Ie(([t,r])=>`${we(t,n)} => ${we(r,n)}`,e)].join(", "),gn=Hn({[Symbol.for("nodejs.util.inspect.custom")](e,n){const t=this[Symbol.toStringTag],r=Object.assign(Object.assign({},n),{depth:n.depth===null?null:n.depth-1});return e>=0?[`${t}(${this.size||0}) {`,we?this instanceof Set?$t(this,r):this instanceof Map?xt(this,r):"":"","}"].join(" "):n.stylize(`[${t}]`,"special")}});function $e(e,n){if(Jn(e))for(let t of n)e.set(t[0],t[1]);else for(let t of n)e.add(t);return e}var oe;const Z=new WeakMap,W=e=>Z.get(e).vals;let F=oe=class extends Set{constructor(n,t={}){super();Z.set(this,{equiv:t.equiv||B,vals:[]}),n&&this.into(n)}*[Symbol.iterator](){yield*W(this)}get[Symbol.species](){return oe}get[Symbol.toStringTag](){return"ArraySet"}get size(){return W(this).length}copy(){const{equiv:n,vals:t}=Z.get(this),r=new oe(null,{equiv:n});return Z.get(r).vals=t.slice(),r}empty(){return new oe(null,this.opts())}clear(){W(this).length=0}first(){if(this.size)return W(this)[0]}add(n){return!this.has(n)&&W(this).push(n),this}into(n){return $e(this,n)}has(n){return this.get(n,N)!==N}get(n,t){const{equiv:r,vals:s}=Z.get(this),i=pt(s,n,r);return i>=0?s[i]:t}delete(n){const{equiv:t,vals:r}=Z.get(this);for(let s=r.length;--s>=0;)if(t(r[s],n))return r.splice(s,1),!0;return!1}disj(n){return pn(this,n)}equiv(n){return yt(this,n)}forEach(n,t){const r=W(this);for(let s=r.length;--s>=0;){const i=r[s];n.call(t,i,i,this)}}*entries(){for(let n of W(this))yield[n,n]}*keys(){yield*W(this)}*values(){yield*W(this)}opts(){return{equiv:Z.get(this).equiv}}};F=oe=ln([gn],F);const St=(e,n)=>Fe(e,"copy")?e.copy():new(e[Symbol.species]||n)(e);var ce;const k=new WeakMap,xe=e=>k.get(e).map;let Se=ce=class extends Map{constructor(n,t){super();const r=Object.assign({equiv:B,keys:F},t);k.set(this,{keys:new r.keys(null,{equiv:r.equiv}),map:new Map,opts:r}),n&&this.into(n)}[Symbol.iterator](){return this.entries()}get[Symbol.species](){return ce}get[Symbol.toStringTag](){return"EquivMap"}get size(){return k.get(this).keys.size}clear(){const{keys:n,map:t}=k.get(this);n.clear(),t.clear()}empty(){return new ce(null,k.get(this).opts)}copy(){const{keys:n,map:t,opts:r}=k.get(this),s=new ce;return k.set(s,{keys:n.copy(),map:new Map(t),opts:r}),s}equiv(n){return ut(this,n)}delete(n){const{keys:t,map:r}=k.get(this);return n=t.get(n,N),n!==N?(r.delete(n),t.delete(n),!0):!1}dissoc(n){return pn(this,n)}forEach(n,t){for(let r of xe(this))n.call(t,r[1],r[0],this)}get(n,t){const{keys:r,map:s}=k.get(this);return n=r.get(n,N),n!==N?s.get(n):t}has(n){return k.get(this).keys.has(n)}set(n,t){const{keys:r,map:s}=k.get(this),i=r.get(n,N);return i!==N?s.set(i,t):(r.add(n),s.set(n,t)),this}into(n){return $e(this,n)}entries(){return xe(this).entries()}keys(){return xe(this).keys()}values(){return xe(this).values()}opts(){return k.get(this).opts}};Se=ce=ln([gn],Se);const mn=(e,n,t)=>{if(e.size<n.size){const r=e;e=n,n=r}return t=t?$e(t,e):St(e,Set),e===n?t:$e(t,n)};class le{constructor(n){if(this.dependencies=new Se,this.dependents=new Se,n)for(let[t,r]of n)r!=null?this.addDependency(t,r):this.addNode(t)}*[Symbol.iterator](){yield*this.sort()}get[Symbol.species](){return le}copy(){const n=new le;for(let t of this.dependencies)n.dependencies.set(t[0],t[1].copy());for(let t of this.dependents)n.dependents.set(t[0],t[1].copy());return n}addNode(n){return!this.dependencies.has(n)&&this.dependencies.set(n,new F),this}addDependency(n,t){(B(n,t)||this.depends(t,n))&&Ne(`Circular dependency between: ${n} & ${t}`);let r=this.dependencies.get(n);return this.dependencies.set(n,r?r.add(t):new F([t])),r=this.dependents.get(t),this.dependents.set(t,r?r.add(n):new F([n])),this}addDependencies(n,t){for(let r of t)this.addDependency(n,r)}removeEdge(n,t){let r=this.dependencies.get(n);return r&&r.delete(t),r=this.dependents.get(t),r&&r.delete(n),this}removeNode(n){return this.dependencies.delete(n),this}depends(n,t){return this.transitiveDependencies(n).has(t)}dependent(n,t){return this.transitiveDependents(n).has(t)}immediateDependencies(n){return this.dependencies.get(n)||new F}immediateDependents(n){return this.dependents.get(n)||new F}isLeaf(n){return this.immediateDependents(n).size===0}isRoot(n){return this.immediateDependencies(n).size===0}nodes(){return mn(new F(this.dependencies.keys()),new F(this.dependents.keys()))}leaves(){return De(n=>this.isLeaf(n),this.nodes())}roots(){return De(n=>this.isRoot(n),this.nodes())}transitiveDependencies(n){return Ge(this.dependencies,n)}transitiveDependents(n){return Ge(this.dependents,n)}sort(){const n=[],t=this.copy();let r=new F(t.leaves());for(;;){if(!r.size)return n.reverse();const s=r.first();r.delete(s);for(let i of[...t.immediateDependencies(s)])t.removeEdge(s,i),t.isLeaf(i)&&r.add(i);n.push(s),t.removeNode(s)}}}const Ge=(e,n)=>{const t=e.get(n);return t?gt(wt(null,(r,s)=>mn(r,Ge(e,s))),t,t):new F},zn=e=>e.tag==="fn"||e.tag==="for"||e.tag=="while"?e.scope.body:e.tag==="if"?e.f?e.t.body.concat(e.f.body):e.t.body:void 0,bt=e=>zn(e)||(e.tag==="scope"?e.body:e.tag==="ternary"?[e.t,e.f]:e.tag==="ret"?[e.val]:e.tag==="call"||e.tag==="call_i"?e.args:e.tag==="sym"&&e.init?[e.init]:e.tag==="decl"?[e.id]:e.tag==="op1"||e.tag==="swizzle"?[e.val]:e.tag==="op2"?[e.l,e.r]:e.tag==="assign"?[e.r]:U(e)||me(e)||rt(e.val)?e.val:void 0),be=(e,n,t,r,s=!0)=>{if(Qn(r))r.forEach(i=>t=be(e,n,t,i,s));else{s&&(t=e(t,r));const i=n(r);i&&(t=be(e,n,t,i,s)),!s&&(t=e(t,r))}return t},wn=(e,n=new le)=>e.deps&&e.deps.length?e.deps.reduce((t,r)=>wn(r,t.addDependency(e,r)),n):n.addNode(e),$n=e=>({tag:"decl",type:e.type,id:e}),fe=(e,n=!1)=>({tag:"scope",type:"void",body:e.filter(t=>t!=null).map(t=>t.tag==="sym"?$n(t):t),global:n}),Br=e=>{const n=e.filter(r=>r.tag!=="fn"),t=e.reduce((r,s)=>s.tag==="fn"?wn(s,r):r,new le);return fe(n.concat(t.sort()),!0)},Wr=(e,n,t)=>({tag:"if",type:"void",test:e,t:fe(n),f:t?fe(t):void 0}),Mt=(e,n,t)=>({tag:"ternary",type:n.type,test:e,t:n,f:t});function xn(...e){const[n,t,r,s]=e.length===2?[,e[0],,e[1]]:e.length===3?[e[0],e[1],,e[2]]:e;return{tag:"for",type:"void",init:n?$n(n):void 0,test:t(n),iter:r?r(n):void 0,scope:fe(s(n))}}const Ot=e=>({tag:"ctrl",type:"void",id:e}),Yr=Ot("discard");let Et=0;const Ve=()=>`_s${(Et++).toString(36)}`;function z(e,...n){let t,r,s;switch(n.length){case 0:ie(e)||(s=e,e=s.type);break;case 1:ie(n[0])?t=n[0]:n[0].tag?s=n[0]:r=n[0];break;case 2:ie(n[0])?[t,r]=n:[r,s]=n;break;case 3:[t,r,s]=n;break;default:Ne()}return{tag:"sym",type:e,id:t||Ve(),opts:r||{},init:s}}const Kr=(e,n,t)=>z(e,n,Object.assign({q:"in",type:"in"},t)),Hr=(e,n,t)=>z(e,n,Object.assign({q:"out",type:"out"},t)),Qr=(e,n,t)=>z(e,n,Object.assign({q:"in",type:"uni"},t)),_t=e=>{const[n,t,r]=ie(e)?[e]:e;return{tag:"arg",type:n,id:t||Ve(),opts:Object.assign({q:"in"},r)}};function _(e,n,t,r){n=n||Ve();const s=t.map(_t),i=r(...s.map(a=>z(a.type,a.id,a.opts))).filter(a=>a!=null),o=be((a,f)=>(f.tag==="ret"&&(an(f.type===e,`wrong return type for function '${n}', expected ${e}, got ${f.type}`),a++),a),zn,0,i);if(e!=="void"&&!o)throw new Error(`function '${n}' must return a value of type ${e}`);const l=be((a,f)=>(f.tag==="call"&&f.fn&&a.push(f.fn),a),bt,[],i),c=(...a)=>At(c,...a);return Object.assign(c,{tag:"fn",type:e,id:n,args:s,deps:l,scope:fe(i)})}const Xr=e=>_("void","main",[],e);function A(e){return{tag:"ret",type:e?e.type:"void",val:e}}function At(e,...n){return ie(e)?{tag:"call",type:n[0],id:e,args:n.slice(1)}:{tag:"call",type:e.type,id:e.id,args:n,fn:e}}const C=(e,n,...t)=>({tag:"call_i",type:n,id:e,args:t}),X=(e,n,t)=>e===n.type&&t===n.info?n:{tag:"lit",type:e,info:t,val:n},Me=e=>X("bool",V(e)?!!e:e),T=e=>X("float",ge(e)?e&1:e),Y=e=>X("int",ge(e)?e&1:V(e)?e|0:e),Le=e=>X("uint",ge(e)?e&1:V(e)?e>>>0:e),Sn=(e,n)=>t=>V(t)||t!==void 0&&!U(t)&&t.type!==e?n(t):t,qt=Sn("float",T),Rt=Sn("bool",Me);Me(!0);const Pt=Me(!1),ve=T(0),Tt=T(1),jt=T(2),bn=T(.5);Y(0);Y(1);Le(0);Le(1);T(Math.PI);T(Math.PI*2);T(Math.PI/2);const Ft=T(Math.SQRT2);T((1+Math.sqrt(5))/2);const Mn=(e,n)=>t=>[t[0]===void 0?n:e(t[0]),...t.slice(1).map(e)],Oe=Mn(qt,ve),kt=Mn(Rt,Pt),Nt=(e,n="")=>e[0]+n.substr(1),Ue=(e,n)=>U(e[0])?Nt(e[0].type,n[e.length]):n[e.length],Ct=(e,n,t)=>X(e,t=n(t),Ue(t,["n","n"])),It=(e,n,t)=>X(e,t=n(t),Ue(t,["n","n","vn"])),On=(e,n,t)=>X(e,t=n(t),t.length===2?U(t[1])?t[0].type[0]+t[1].type[0]:"vn":Ue(t,["n","n",,"vnn"])),Dt=(e,n,t)=>X(e,t=Oe(t),n[t.length]);function J(...e){return Ct("vec2",Oe,e)}function ee(...e){return It("vec3",Oe,e)}function Gt(...e){return On("vec4",Oe,e)}function Vt(...e){return On("bvec4",kt,e)}function Lt(...e){return Dt("mat2",["n","n","vv"],e)}J(0);const Ut=J(1);J(2);ee(0);ee(1);ee(2);const Bt={mat2:"vec2",mat3:"vec3",mat4:"vec4"};function Jr(e,n,t){const r={tag:"idxm",type:Bt[e.type],id:Y(n),val:e};return t!==void 0?{tag:"idx",type:"float",id:Y(t),val:r}:r}const Wt=e=>e.replace("[]",""),En=(e,n)=>{const t=e.type[0];return t==="i"?Y(n):t==="u"?Le(n):t==="b"?Me(n):T(n)},Yt=(e,n,t=!1)=>({tag:"op1",type:n.type,op:e,val:n,post:t}),Kt={mave:"mv",vema:"vm",vefl:"vn",mafl:"vn",flve:"nv",flma:"nv",ivin:"vn",iniv:"nv",uvui:"vn",uiuv:"nv"},pe=(e,n,t,r,s)=>{const i=V(n),o=V(t);let l,c,a;return i?o?(c=T(n),a=T(t),l="float"):(a=t,c=En(a,n),l=a.type):o?(c=n,a=En(c,t),l=c.type):(c=n,a=t,l=r||(U(c)?c.type:U(a)||me(a)?a.type:c.type)),{tag:"op2",type:r||l,info:s||Kt[c.type.substr(0,2)+a.type.substr(0,2)],op:e,l:c,r:a}},_n=e=>Yt("++",e,!0);function h(e,n){return pe("+",e,n)}function ne(e,n){return pe("-",e,n)}function w(e,n){return pe("*",e,n,!V(e)&&!V(n)&&me(e)&&U(n)?n.type:void 0)}function Ee(e,n){return pe("/",e,n)}function Ht(e,n,t){return h(w(e,n),t)}const _e=e=>(n,t)=>pe(e,n,t,"bool"),Zr=_e("=="),Qt=_e("!="),An=_e("<="),es=_e(">");function u(e,n){const t=e.type[0],r=(s,i)=>n.length===1?s:i+n.length;return{tag:"swizzle",type:t==="i"?r("int","ivec"):t==="u"?r("uint","uvec"):t==="b"?r("bool","bvec"):r("float","vec"),val:e,id:n}}const ue=e=>u(e,"x"),Be=e=>u(e,"y"),We=e=>u(e,"z"),ns=e=>u(e,"w");function Xt(e){return u(e,"xy")}function ts(e){return u(e,"xyz")}const Jt=e=>"bvec"+e[e.length-1],qn=(e,n,t)=>C(e,Jt(n.type),n,t);function Zt(e,n){return qn("lessThan",e,n)}function er(e,n){return qn("greaterThan",e,n)}const nr=e=>C("any","bool",e),ye=e=>n=>C(e,n.type,n),Ye=e=>(n,t)=>C(e,n.type,n,t),tr=e=>(n,t,r)=>C(e,n.type,n,t,r),rs=e=>C("normalize",e.type,e),ss=e=>C("length","float",e),R=(e,n)=>C("dot","float",e,n),is=Ye("min"),as=Ye("max"),rr=tr("smoothstep"),Rn=ye("sin"),Pn=Ye("pow"),sr=ye("sqrt"),os=ye("abs"),ir=ye("floor"),S=ye("fract");function cs(e,n,t){const r=C("mix",e.type,e,n,t);return t.type==="float"&&(r.info="n"),r}const Tn=e=>{const n=e.type[0],t=e.type.indexOf("Shadow")>0;return n==="s"?t?"float":"vec4":n==="i"?t?"int":"ivec4":n==="u"?t?"uint":"uvec4":Ne(`unknown sampler type ${e.type}`)},ar=(e,n,t,r)=>{const s=r?C(e,Tn(n),n,...t,r):C(e,Tn(n),n,...t);return!U(s)&&(s.info="n"),s};function ls(e,n,t){return ar("texture",e,[n],t)}const de=Symbol();let or=Kn;function cr(e,n){const t={},r=n?lr(n):{},s=(...i)=>{const o=e(...i),l=t[o]||Ae(t,r,o)||t[de];return l?l(...i):ae(`missing implementation for: "${o.toString()}"`)};return s.add=(i,o)=>(t[i]&&or.warn(`overwriting '${i.toString()}' impl`),t[i]=o,!0),s.addAll=i=>{let o=!0;for(let l in i)o=s.add(l,i[l])&&o;return o},s.remove=i=>t[i]?(delete t[i],!0):!1,s.callable=(...i)=>{const o=e(...i);return!!(t[o]||Ae(t,r,o)||t[de])},s.isa=(i,o)=>{let l=r[i];!l&&(r[i]=l=new Set),l.add(o)},s.impls=()=>{const i=new Set(Object.keys(t));for(let o in r)Ae(t,r,o)&&i.add(o);return t[de]&&i.add(de),i},s.rels=()=>r,s.parents=i=>r[i],s.ancestors=i=>new Set(jn([],r,i)),s.dependencies=function*(){for(let i in r)for(let o of r[i])yield[i,o];for(let i in t)!r[i]&&(yield[i,void 0])},s}const Ae=(e,n,t)=>{const r=n[t];if(!!r)for(let s of r){let i=e[s]||Ae(e,n,s);if(i)return i}},jn=(e,n,t)=>{const r=n[t];if(r)for(let s of r)e.push(s),jn(e,n,s);return e},lr=e=>{const n={};for(let t in e){const r=e[t];n[t]=r instanceof Set?r:new Set(r)}return n},fr=e=>{const n=cr(t=>t.tag);return n.add(de,t=>ae(`no impl for AST node type: '${t.tag}'`)),n.addAll(e),n};_("float","fitNorm1",["float","float","float"],(e,n,t)=>[A(Mt(Qt(n,t),Ee(ne(e,n),ne(t,n)),ve))]);const vr=e=>h(w(e,bn),bn),pr=e=>ne(w(e,jt),Tt),fs=(e,n)=>vr(R(e,n));_("vec2","hash2",["vec2"],e=>[A(S(w(Rn(w(e,Lt(127.1,311.7,269.5,183.3))),43758.5453)))]);_("vec3","hash3",["vec2"],e=>[A(S(w(Rn(ee(R(e,J(127.1,311.7)),R(e,J(269.5,183.3)),R(e,J(419.2,371.9)))),43758.5453)))]);const te=ee(.1031,.103,.0973),qe=Gt(.1031,.103,.0973,.1099);_("float","hash11",["float"],e=>{let n;return[n=z(S(w(e,.1031))),q(n,w(n,h(n,19.19))),q(n,w(n,h(n,n))),A(S(n))]});_("float","hash12",["vec2"],e=>{let n;return[n=z(S(w(u(e,"xyx"),.1031))),q(n,h(n,R(n,h(u(n,"yzx"),19.19)))),A(S(w(h(ue(n),Be(n)),We(n))))]});_("float","hash13",["vec3"],e=>{let n;return[n=z(S(w(u(e,"xyx"),.1031))),q(n,h(n,R(n,h(u(n,"yzx"),19.19)))),A(S(w(h(ue(n),Be(n)),We(n))))]});_("vec2","hash21",["float"],e=>{let n;return[n=z(S(w(ee(e),te))),q(n,h(n,R(n,h(u(n,"yzx"),19.19)))),A(S(w(h(u(n,"xx"),u(n,"yz")),u(n,"zy"))))]});_("vec2","hash22",["vec2"],e=>{let n;return[n=z(S(w(u(e,"xyx"),te))),q(n,h(n,R(n,h(u(n,"yzx"),19.19)))),A(S(w(h(u(n,"xx"),u(n,"yz")),u(n,"zy"))))]});_("vec2","hash23",["vec3"],e=>{let n;return[n=z(S(w(e,te))),q(n,h(n,R(n,h(u(n,"yzx"),19.19)))),A(S(w(h(u(n,"xx"),u(n,"yz")),u(n,"zy"))))]});_("vec3","hash31",["float"],e=>{let n;return[n=z(S(w(e,te))),q(n,h(n,R(n,h(u(n,"yzx"),19.19)))),A(S(w(h(u(n,"xxy"),u(n,"yzz")),u(n,"zyx"))))]});const ur=_("vec3","hash32",["vec2"],e=>{let n;return[n=z(S(w(u(e,"xyx"),te))),q(n,h(n,R(n,h(u(n,"yzx"),19.19)))),A(S(w(h(u(n,"xxy"),u(n,"yzz")),u(n,"zyx"))))]});_("vec3","hash33",["vec3"],e=>{let n;return[n=z(S(w(e,te))),q(n,h(n,R(n,h(u(n,"yzx"),19.19)))),A(S(w(h(u(n,"xxy"),u(n,"yzz")),u(n,"zyx"))))]});_("vec4","hash41",["float"],e=>{let n;return[n=z(S(w(e,qe))),q(n,h(n,R(n,h(u(n,"wzxy"),19.19)))),A(S(w(h(u(n,"xxyz"),u(n,"yzzw")),u(n,"zywx"))))]});_("vec4","hash42",["vec2"],e=>{let n;return[n=z(S(w(u(e,"xyxy"),qe))),q(n,h(n,R(n,h(u(n,"wzxy"),19.19)))),A(S(w(h(u(n,"xxyz"),u(n,"yzzw")),u(n,"zywx"))))]});_("vec4","hash43",["vec3"],e=>{let n;return[n=z(S(w(u(e,"xyzx"),qe))),q(n,h(n,R(n,h(u(n,"wzxy"),19.19)))),A(S(w(h(u(n,"xxyz"),u(n,"yzzw")),u(n,"zywx"))))]});_("vec4","hash44",["vec4"],e=>{let n;return[n=z(S(w(e,qe))),q(n,h(n,R(n,h(u(n,"wzxy"),19.19)))),A(S(w(h(u(n,"xxyz"),u(n,"yzzw")),u(n,"zywx"))))]});const vs=_("float","voronoise2",["vec2","float","float"],(e,n,t)=>{let r,s,i,o,l,c,a,f,y,d;return[r=z(ir(e)),s=z(S(e)),i=z(ee(n,n,1)),o=z(h(1,w(63,Pn(ne(1,t),T(4))))),l=z(ve),c=z(ve),xn(z(Y(-2)),p=>An(p,Y(2)),_n,p=>[xn(z(Y(-2)),m=>An(m,Y(2)),_n,m=>[a=z(J(T(p),T(m))),f=z(w(ur(h(r,a)),i)),y=z(h(ne(a,s),Xt(f))),d=z(Pn(ne(1,rr(ve,Ft,sr(R(y,y)))),o)),q(l,Ht(d,We(f),l)),q(c,h(c,d))])]),A(Ee(l,c))]}),ps=_("vec2","aspectCorrectedUV",["vec2","vec2"],(e,n)=>{let t;return[t=z(pr(Ee(e,n))),q(ue(t),w(ue(t),Ee(ue(n),Be(n)))),A(t)]});_("bool","borderMask",["vec2","float"],(e,n)=>[A(nr(Vt(Zt(e,J(n)),er(h(e,n),Ut))))]);var re;(function(e){e.GLES_100="100",e.GLES_300="300 es"})(re||(re={}));const Fn=/[};]$/,us=e=>{const n=Object.assign({type:"fs",version:re.GLES_300,versionPragma:!0,prelude:""},e),t=n.type==="vs",r=a=>a,s=(a,f=", ")=>a.map(c).join(f),i=a=>`${a.id}(${s(a.args)})`,o=(a,f=!1)=>{const{id:y,type:d,opts:p,init:m}=a,g=[];if(p.type){let v;n.version<re.GLES_300?t?v={in:"attribute",out:"varying",uni:"uniform"}[p.type]:(v={in:"varying",out:null,uni:"uniform"}[p.type],!v&&ae("GLSL 100 doesn't support fragment shader output variables")):(p.loc!=null&&g.push(`layout(location=${p.loc}) `),p.smooth!=null&&g.push(p.smooth+" "),v=p.type==="uni"?"uniform":p.type),g.push(v+" ")}else p.const&&g.push("const "),f&&p.q&&g.push(p.q+" ");return p.prec&&g.push(p.prec+" "),g.push(r(Wt(d))," ",y),p.num&&g.push(`[${p.num}]`),m&&g.push(" = ",c(m)),g.join("")},l=a=>`${c(a.val)}[${c(a.id)}]`,c=fr({arg:a=>o(a,!0),array_init:a=>n.version>=re.GLES_300?`${a.type}(${s(a.init)})`:ae(`array initializers not available in GLSL ${n.version}`),assign:a=>c(a.l)+" = "+c(a.r),ctrl:a=>a.id,call:i,call_i:a=>a.id==="texture"&&n.version<re.GLES_300?`${a.id}${a.args[0].type.substr(7)}(${s(a.args)})`:i(a),decl:a=>o(a.id),fn:a=>`${r(a.type)} ${a.id}(${s(a.args)}) ${c(a.scope)}`,for:a=>`for(${a.init?c(a.init):""}; ${c(a.test)}; ${a.iter?c(a.iter):""}) ${c(a.scope)}`,idx:l,idxm:l,if:a=>{const f=`if (${c(a.test)}) `+c(a.t);return a.f?f+" else "+c(a.f):f},lit:a=>{const f=a.val;switch(a.type){case"bool":return ge(f)?String(f):`bool(${c(f)})`;case"float":return V(f)?f===Math.trunc(f)?f+".0":String(f):`float(${c(f)})`;case"int":case"uint":return V(f)?String(f):`${a.type}(${c(f)})`;default:return U(a)||me(a)?`${a.type}(${s(f)})`:ae(`unknown type: ${a.type}`)}},op1:a=>a.post?`(${c(a.val)}${a.op})`:`(${a.op}${c(a.val)})`,op2:a=>`(${c(a.l)} ${a.op} ${c(a.r)})`,ret:a=>"return"+(a.val?" "+c(a.val):""),scope:a=>{let f=a.body.map(c).reduce((y,d)=>(y.push(Fn.test(d)?d:d+";"),y),[]).join(`
`);return f+=a.body.length&&!Fn.test(f)?";":"",a.global?(n.prelude&&(f=n.prelude+`
`+f),n.versionPragma&&(f=`#version ${n.version}
`+f),f):`{
${f}
}`},swizzle:a=>`${c(a.val)}.${a.id}`,sym:a=>a.id,ternary:a=>`(${c(a.test)} ? ${c(a.t)} : ${c(a.f)})`,while:a=>`while (${c(a.test)}) ${c(a.scope)}`});return Object.assign(c,{gl_FragColor:z("vec4","gl_FragColor"),gl_FragCoord:z("vec4","gl_FragCoord",{const:!0}),gl_FragData:z("vec4[]","gl_FragData",{num:1}),gl_FrontFacing:z("bool","gl_FrontFacing",{const:!0}),gl_PointCoord:z("vec2","gl_PointCoord",{const:!0}),gl_PointSize:z("float","gl_PointSize"),gl_Position:z("vec4","gl_Position")}),c};function yr(e){var n={size:[1,1,1],segments:[1,1,1]};return e&&(Array.isArray(e.size)?n.size=e.size:typeof e.size=="number"&&(n.size=[e.size,e.size,e.size]),Array.isArray(e.segments)?n.segments=e.segments:typeof e.segments=="number"&&(n.segments=[e.segments,e.segments,e.segments])),n}function he(e){for(var n=[],t=0;t<e.length;t++)for(var r=e[t],s=0;s<r.length;s++)n.push(r[s]);return n}function Ke(e){var n=hr(e),t=mr(e),r=he(n),s=dr(e,r);return{positions:r,cells:t,uvs:s,vertexCount:(e.sx+1)*(e.sy+1)}}function dr(e,n){return n.map(function(t){return[t[0]/e.wx+.5,t[1]/e.wy+.5]})}function hr(e){for(var n=e.wy/e.sy,t=e.wy/2,r=e.sy+1,s=Array(r),i=0;i<r;i++)s[i]=gr(e,n*i-t);return s}function gr(e,n){for(var t=e.wx/2,r=e.wx/e.sx,s=e.sx+1,i=Array(s),o=0;o<s;o++)i[o]=[r*o-t,n];return i}function mr(e){function n(a,f){return(e.sx+1)*f+a}for(var t=[],r=0;r<e.sx;r++)for(var s=0;s<e.sy;s++){var i=n(r+0,s+0),o=n(r+1,s+0),l=n(r+1,s+1),c=n(r+0,s+1);t.push([i,o,l]),t.push([l,c,i])}return t}function He(e){return{positions:e.positions,cells:e.cells,uvs:e.uvs,vertexCount:e.vertexCount}}function zr(e){var n=e.size,t=e.segments,r=Ke({wx:n[0],wy:n[1],sx:t[0],sy:t[1]}),s=Ke({wx:n[2],wy:n[1],sx:t[2],sy:t[1]}),i=Ke({wx:n[0],wy:n[2],sx:t[0],sy:t[2]}),o=He(r),l=He(s),c=He(i);return r.positions=r.positions.map(function(a){return[a[0],a[1],n[2]/2]}),o.positions=o.positions.map(function(a){return[a[0],-a[1],-n[2]/2]}),s.positions=s.positions.map(function(a){return[n[0]/2,-a[1],a[0]]}),l.positions=l.positions.map(function(a){return[-n[0]/2,a[1],a[0]]}),i.positions=i.positions.map(function(a){return[a[0],n[1]/2,-a[1]]}),c.positions=c.positions.map(function(a){return[a[0],-n[1]/2,a[1]]}),r.normals=se([0,0,1],r.positions.length),o.normals=se([0,0,-1],o.positions.length),s.normals=se([1,0,0],s.positions.length),l.normals=se([-1,0,0],l.positions.length),i.normals=se([0,1,0],i.positions.length),c.normals=se([0,-1,0],c.positions.length),[r,o,s,l,i,c]}function se(e,n){for(var t=Array(n),r=0;r<n;r++)t[r]=e.slice();return t}function wr(e){var n=zr(e),t=n.map(function(o){return o.positions}),r=n.map(function(o){return o.uvs}),s=n.map(function(o){return o.normals}),i=$r(n);return{positions:he(t),uvs:he(r),cells:he(i),normals:he(s)}}function $r(e){var n=0;return e.map(function(t){var r=t.cells.map(function(s){return s.map(function(i){return i+n})});return n+=t.vertexCount,r})}var ys=function(e){var n=yr(e);return wr(n)};export{ns as $,Ee as A,z as B,Jr as C,Be as D,Wr as E,es as F,R as G,Yr as H,us as I,re as J,rs as K,ne as L,ue as M,h as N,We as O,Xt as P,ls as Q,vr as R,Pn as S,os as T,_ as U,ee as V,as as W,S as X,ir as Y,A as Z,ts as _,Pr as a,ss as a0,u as a1,Sr as a2,rn as a3,nn as a4,Wn as a5,Dr as a6,Re as a7,Gr as a8,Ir as a9,Gn as aa,cs as ab,is as ac,ps as ad,vs as ae,Or as af,fs as ag,br as ah,kr as ai,Vr as aj,jr as ak,ys as al,Tr as am,tn as b,xr as c,Nr as d,qr as e,Rr as f,_r as g,Er as h,Mr as i,Br as j,Kr as k,Xr as l,Cn as m,q as n,Hr as o,Fr as p,Zr as q,Ar as r,Cr as s,Mt as t,Qr as u,T as v,Gt as w,w as x,J as y,pr as z};
