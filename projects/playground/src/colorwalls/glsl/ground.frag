precision mediump float;

uniform sampler2D reflection;
uniform vec2 size;

varying vec3 vNormal;
varying vec3 vPos;

void main() {
	vec4 color = texture2D(reflection, gl_FragCoord.xy / size);
	float distance = max(50.0 - length(vPos), 0.0) / 50.0;
	vec2 grid = fract(vPos.xz / 3.0) * 0.03;
	vec2 lines = floor(fract(vPos.xz / 3.0) + 0.03) * 0.05;
	gl_FragColor = vec4((color.rgb * color.a / 2.0 + vec3(distance * 0.3)) * vec3(distance + 0.3 + grid.x + grid.y - max(lines.x, lines.y)), 1.0);
}
