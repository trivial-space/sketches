precision mediump float;

varying vec3 vColor;
varying vec3 normal;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
