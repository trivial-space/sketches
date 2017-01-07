uniform sampler2D image;
uniform vec3 color;
uniform vec4 connections;

varying vec2 vUv;

void main() {
  vec4 tex = texture2D(image, vUv);
  if (tex.r > 0.9) {
    discard;
  }

  float up = 0.0;
  float right = 0.0;
  float down = 0.0;
  float left = 0.0;
  float x = vUv.x - 0.5;
  float y = vUv.y;

  if (connections[0] > 0.0) {
    up = x * x * 2.0 + y * y * 2.0;
    up = 1.0 - up;
    up = max(0.0, up);
    up *= up;
  }

  if (connections[1] > 0.0) {
    x = vUv.x - 1.0;
    y = vUv.y - 0.5;
    right = x * x * 2.0 + y * y * 2.0;
    right = 1.0 - right;
    right = max(0.0, right);
    right *= right;
  }

  if (connections[2] > 0.0) {
    x = vUv.x - 0.5;
    y = vUv.y - 1.0;
    down = x * x * 2.0 + y * y * 2.0;
    down = 1.0 - down;
    down = max(0.0, down);
    down *= down;
  }

  if (connections[3] > 0.0) {
    x = vUv.x;
    y = vUv.y - 0.5;
    left = x * x * 2.0 + y * y * 2.0;
    left = 1.0 - left;
    left = max(0.0, left);
    left *= left;
  }

  // smooth out border
  /* col /= resolution.x * resolution.y * 0.5; */
  /* col = sqrt(col); */

  gl_FragColor = vec4(up + right + left + down, 0.8 - color.gb * (1.0 - tex.r), 1.0);
  // gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = connections;
}
