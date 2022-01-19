import"./modulepreload-polyfill.b7f2da20.js";import{g as f,t as d,n as v,r as g,s as m}from"./painterState.2081fc22.js";import{p as h}from"./coords.52a43cba.js";import{a as u}from"./vectors.212c15dd.js";import{c as b}from"./points.c0fbbf77.js";import"./pointer.1f73fbf8.js";import"./ast.22bf2736.js";import"./vendor.86045b5f.js";const e=document.getElementById("canvas"),t=f(e),L=40,x=Math.min(e.height,e.width)*.4,i=[],r=d(()=>u(h([Math.sqrt(Math.abs(v()*2-1))*x,Math.random()*2*Math.PI]),[e.width/2,e.height/2]),L);for(let o=0;o<r.length-1;o++)for(let n=o+1;n<r.length;n++)i.push([r[o],r[n],r[(n+1)%r.length]]);var y=`precision mediump float;
#define GLSLIFY 1

uniform sampler2D previous;
uniform sampler2D current;

varying vec2 coords;

void main() {
	vec4 p = texture2D(previous, coords);
	vec4 c = texture2D(current, coords);
	vec3 color = max(p.rgb, c.rgb);
	gl_FragColor = vec4(color, 1.0);
}

`,C=`precision mediump float;
#define GLSLIFY 1

const float r = 0.5;
varying vec4 vColor;

void main() {
	vec2 pos = gl_PointCoord.xy;
	pos -= r;
	float x = pos.x;
	float y = pos.y;
	float light = x * x + y * y - r * r;
 	light = clamp(-(light * 4.0), 0.0, 1.0);

	gl_FragColor = vec4(vec3(vColor.rgb) * 0.7, light);
}
`,F=`precision mediump float;
#define GLSLIFY 1

uniform vec2 p1;
uniform vec2 p2;
uniform vec2 p3;
uniform vec2 size;
uniform sampler2D source;

varying vec2 coords;

void main() {
	vec2 v = p2 - p1;
	vec2 p = p3 - p1;
	vec2 pos = coords * size;
	vec2 f = pos - p1;

	// f - (f * v) * v

	// 2D Cross product
	float directionPoint = v.x * p.y - v.y * p.x;
	float directionFrag = v.x * f.y - v.y * f.x;

	float vLength = length(v);
	vec2 vn = v / vLength;
	float dist = length(pos - (p1 + vn * clamp(dot(f, vn), 0.0, vLength)));
	vec3 color = vec3(1.0, coords) * max(100.0 - dist, 0.0) / 100.0;
	if (
		directionPoint == 0.0
		|| sign(directionFrag) != sign(directionPoint)
		|| vLength < length(f)
		|| vLength < length(pos - p2)
	) {
		color = vec3(0.0);
	}

	float alpha = 0.4;
	vec4 old = texture2D(source, coords);
	color = pow(color, vec3(2.0));
	gl_FragColor = vec4(mix(color, old.rgb, 1.0 - alpha), 1.0);
}

`;const{gl:s}=t,S=b(t,"points",{frag:C,pointSize:12,color:[1,1,0,1],positions:r}),a=t.getEffect("sides").update({frag:F}),p=t.getLayer("points").update({sketches:S.sketch,effects:a,drawSettings:{clearColor:[0,0,0,1],clearBits:s.COLOR_BUFFER_BIT,enable:[s.BLEND],blendFunc:[s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA]}}),D=t.getEffect("blend").update({frag:y,uniforms:{previous:"0",current:()=>p.image()}}),l=t.getLayer("main").update({effects:D,selfReferencing:!0});let c=0;g(()=>{const o=i[c];a.update({uniforms:{size:[e.width,e.height],p1:o[0],p2:o[1],p3:o[2],source:"0"}}),t.painter.compose(p,l).show(l),console.log(c++),c===i.length&&m("render")},"render");console.log(i.length);
