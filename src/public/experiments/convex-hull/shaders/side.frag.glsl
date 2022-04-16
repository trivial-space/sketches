precision mediump float;

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

