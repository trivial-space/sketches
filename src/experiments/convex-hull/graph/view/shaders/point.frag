precision mediump float;

const float r = 0.5;

void main() {
	vec2 pos = gl_PointCoord.xy;
	pos -= r;
	float x = pos.x;
	float y = pos.y;
	float light = x * x + y * y - r * r;
 	light = clamp(-(light * 2.0), 0.0, 1.0);

	// smooth out border
	/* col /= resolution.x * resolution.y * 0.5; */
	/* col = sqrt(col); */

	// invert color
	gl_FragColor = vec4(vec3(light), light);
}
