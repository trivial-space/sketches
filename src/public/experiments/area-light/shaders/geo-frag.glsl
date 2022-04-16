#version 300 es
precision highp float;

uniform vec4 color;

in vec4 vPosition;
in vec4 vNormal;
in vec4 vUv;

layout(location=0) out vec4 fragPosition;
layout(location=1) out vec4 fragNormal;
layout(location=2) out vec4 fragUV;
layout(location=3) out vec4 fragColor;

void main() {
	fragPosition = vPosition;
	fragNormal = vNormal;
	fragUV = vUv;
	fragColor = color;
}
