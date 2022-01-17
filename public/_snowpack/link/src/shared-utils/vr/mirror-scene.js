import {baseEvents} from "../painterState.js";
import {mat4} from "../../../../pkg/gl-matrix.js";
import {getBlurByAlphaEffect} from "../shaders/effects/blur.js";
import {makeXZPlane} from "../geometry/helpers.js";
import {groundVert, makeGroundFrag} from "./mirror-scene-shaders.js";
const sceneId = "mirror-scene-ground";
export function createMirrorScene(Q, objectSketches, options = {}) {
  const {
    width,
    height,
    scale = 1,
    renderWithDistanceAlphaUniformName = "withDistance",
    groundShaderColorFn,
    blurStrengh = 20,
    blurRatioVertical = 2,
    blurStrenghOffset = 0.3,
    reflectionStrength = 1
  } = options;
  const groundForm = Q.getForm(sceneId).update(makeXZPlane(100, 3));
  const floorTransform = mat4.create();
  mat4.scale(floorTransform, floorTransform, [scale, scale, scale]);
  const floorMirrorView = mat4.create();
  const mirrorMatrix = mat4.fromValues(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  const groundShade = Q.getShade(sceneId).update({
    vert: groundVert,
    frag: makeGroundFrag(groundShaderColorFn)
  });
  const blurEffect = getBlurByAlphaEffect(Q, "blur", {
    strength: blurStrengh,
    strengthOffset: blurStrenghOffset,
    blurRatioVertical
  });
  const mirrorScene = Q.getLayer(sceneId).update({
    sketches: objectSketches,
    effects: blurEffect,
    uniforms: {
      view: () => mat4.multiply(floorMirrorView, Q.state.viewPort.camera.viewMat, mirrorMatrix),
      projection: () => Q.state.viewPort.camera.projectionMat,
      [renderWithDistanceAlphaUniformName]: 1
    },
    drawSettings: {
      clearBits: Q.gl.DEPTH_BUFFER_BIT | Q.gl.COLOR_BUFFER_BIT
    },
    width,
    height
  });
  const groundSketch = Q.getSketch(sceneId).update({
    form: groundForm,
    shade: groundShade,
    uniforms: {
      transform: floorTransform,
      reflection: () => mirrorScene.image(),
      size: () => [
        width || Q.painter.canvas.width,
        height || Q.painter.canvas.height
      ],
      reflectionStrength
    }
  });
  const scene = Q.getLayer("scene").update({
    sketches: [groundSketch].concat(objectSketches),
    uniforms: {
      view: () => Q.state.viewPort.camera.viewMat,
      projection: () => Q.state.viewPort.camera.projectionMat,
      [renderWithDistanceAlphaUniformName]: 0
    },
    drawSettings: {
      clearBits: Q.gl.DEPTH_BUFFER_BIT | Q.gl.COLOR_BUFFER_BIT
    },
    width,
    height
  });
  if (!(width || height)) {
    Q.listen(sceneId, baseEvents.RESIZE, () => {
      scene.update();
      mirrorScene.update();
    });
  }
  return {scene, mirrorScene};
}
