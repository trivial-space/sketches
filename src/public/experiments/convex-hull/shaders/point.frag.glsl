precision mediump float;

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
