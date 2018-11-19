#extension GL_EXT_draw_buffers : require
precision highp float;

uniform vec4 color;

varying vec4 vPosition;
varying vec4 vNormal;
varying vec4 vUv;

void main() {
	gl_FragData[0] = vPosition;
	gl_FragData[1] = vNormal;
	gl_FragData[2] = vUv;
	gl_FragData[3] = color;
}
