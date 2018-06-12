precision mediump float;

varying vec3 vColor;
varying vec3 vNormal;

void main() {
	vec3 color = (vNormal.rgb + 1.0) / 2.0;
  gl_FragColor = vec4(vColor, 1.0);
}
