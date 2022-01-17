import frag from "./blur_with_alpha.js";
export function getBlurByAlphaEffect(Q, id, {
  strength,
  size,
  layerOpts,
  startLayer,
  strengthOffset = 0,
  blurRatioVertical = 1,
  scaleFactor = 0.6
}) {
  const passData = [];
  while (strength >= 1 / blurRatioVertical) {
    passData.push({
      strength,
      direction: 0,
      source: "0"
    });
    passData.push({
      strength: strength * blurRatioVertical,
      direction: 1,
      source: "0"
    });
    strength *= scaleFactor;
  }
  if (startLayer) {
    passData[0].source = () => startLayer.image();
  }
  return Q.getEffect(id).update({
    ...layerOpts,
    frag,
    drawSettings: {
      disable: [Q.gl.DEPTH_TEST]
    },
    uniforms: passData.map((data) => ({
      ...data,
      blurRatioVertical,
      strengthOffset,
      size: size || (() => [Q.gl.canvas.width, Q.gl.canvas.height])
    }))
  });
}
