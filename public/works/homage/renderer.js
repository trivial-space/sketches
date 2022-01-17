import {mat4} from "../../_snowpack/pkg/gl-matrix.js";
import {getBlurByAlphaEffect} from "../../_snowpack/link/src/shared-utils/shaders/effects/blur.js";
import {zip} from "../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {makeClear} from "../../_snowpack/link/projects/painter/dist/utils/context.js";
import {events, getCanvasSize, Q} from "./context.js";
import {boxForm, planeForm} from "./geometries.js";
import {groundShade, objectShade, screenShade} from "./shaders.js";
import * as videos from "./state/videos.js";
import {initPerspectiveViewport} from "../../_snowpack/link/src/shared-utils/vr/perspectiveViewport.js";
import * as screens from "./state/screens.js";
import * as ground from "./state/ground.js";
const {gl, state: s} = Q;
initPerspectiveViewport(Q, {
  fovy: Math.PI * 0.4,
  lookSpeed: 2
});
const drawSettings = {
  clearBits: makeClear(gl, "color", "depth")
};
Q.painter.updateDrawSettings({
  clearColor: [0, 0, 0, 1]
});
export const videoTextureData = {
  flipY: true,
  minFilter: "LINEAR",
  wrap: "CLAMP_TO_EDGE"
};
export const videoTextures = videos.names.map((n) => Q.getLayer(n));
const reflSize = 256;
export const videoLights = videoTextures.map((t, i) => {
  const id = "vref" + i;
  return Q.getLayer(id).update({
    bufferStructure: [
      {
        minFilter: "LINEAR",
        magFilter: "LINEAR"
      }
    ],
    width: reflSize,
    height: reflSize,
    effects: getBlurByAlphaEffect(Q, id, {
      strength: 4,
      size: [reflSize, reflSize],
      startLayer: t
    })
  });
});
export const screenSketch = Q.getSketch("screens").update({
  form: planeForm,
  shade: screenShade,
  uniforms: zip((transform, tex) => ({
    transform,
    video: () => tex.image()
  }), screens.screenTransforms, videoTextures),
  drawSettings
});
const pedestalSketch = Q.getSketch("pedestals").update({
  form: boxForm,
  shade: objectShade,
  uniforms: screens.pedestalTransforms.map((transform) => ({
    transform
  }))
});
const blurEffect = getBlurByAlphaEffect(Q, "blur", {
  strength: 4,
  strengthOffset: 0.3,
  blurRatioVertical: 3,
  size: [256, 256]
});
export const mirrorScene = Q.getLayer("mirrorScene").update({
  sketches: [screenSketch, pedestalSketch],
  effects: blurEffect,
  drawSettings,
  uniforms: {
    view: () => mat4.multiply(ground.groundMirrorView, s.viewPort.camera.viewMat, ground.mirrorMatrix),
    projection: () => s.viewPort.camera.projectionMat,
    withDistance: 1,
    groundHeight: () => ground.position[1]
  },
  width: 256,
  height: 256,
  bufferStructure: [
    {
      magFilter: "LINEAR",
      minFilter: "LINEAR"
    }
  ]
});
const groundSketch = Q.getSketch("ground").update({
  form: planeForm,
  shade: groundShade,
  uniforms: {
    reflection: () => mirrorScene.image(),
    transform: ground.transform,
    lights: screens.lights,
    lightSize: screens.lightSize,
    lightTex: () => videoLights.map((v) => v.image()),
    size: getCanvasSize
  }
});
export const scene = Q.getLayer("scene").update({
  sketches: [screenSketch, pedestalSketch, groundSketch],
  drawSettings,
  uniforms: {
    view: () => s.viewPort.camera.viewMat,
    projection: () => s.viewPort.camera.projectionMat,
    withDistance: 0
  },
  directRender: true
});
Q.listen("renderer", events.RESIZE, () => {
  scene.update();
});
