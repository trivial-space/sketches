var m=Object.defineProperty,p=Object.defineProperties;var D=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var h=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var l=(o,r,e)=>r in o?m(o,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[r]=e,c=(o,r)=>{for(var e in r||(r={}))h.call(r,e)&&l(o,e,r[e]);if(f)for(var e of f(r))x.call(r,e)&&l(o,e,r[e]);return o},u=(o,r)=>p(o,D(r));var z=`precision mediump float;
#define GLSLIFY 1
vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

uniform sampler2D source;
uniform vec2 size;
uniform float direction;
uniform float strength;
uniform float strengthOffset;

varying vec2 coords;

void main() {
	vec2 uv = coords;
	vec4 refl = texture2D(source, uv);
	float dist = refl.a * strength + strengthOffset;

	if (direction == 0.0) {
		gl_FragColor = blur9(source, uv, size, vec2(dist, 0));
	} else {
		gl_FragColor = blur9(source, uv, size, vec2(0, dist));
	}
}
`;function w(o,r,{strength:e,size:n,layerOpts:v,startLayer:s,strengthOffset:a=0,blurRatioVertical:t=1,scaleFactor:g=.6}){const i=[];for(;e>=1/t;)i.push({strength:e,direction:0,source:"0"}),i.push({strength:e*t,direction:1,source:"0"}),e*=g;return s&&(i[0].source=()=>s.image()),o.getEffect(r).update(u(c({},v),{frag:z,drawSettings:{disable:[o.gl.DEPTH_TEST]},uniforms:i.map(d=>u(c({},d),{blurRatioVertical:t,strengthOffset:a,size:n||(()=>[o.gl.canvas.width,o.gl.canvas.height])}))}))}export{w as g};
