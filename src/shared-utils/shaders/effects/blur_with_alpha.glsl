precision mediump float;

// copied from 'glsl-fast-gaussian-blur/9'
vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
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
		gl_FragColor = blur(source, uv, size, vec2(dist, 0));
	} else {
		gl_FragColor = blur(source, uv, size, vec2(0, dist));
	}
}
