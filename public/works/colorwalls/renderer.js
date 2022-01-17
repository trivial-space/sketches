import {Q} from "./context.js";
import {wallsForm} from "./geometries.js";
import wallsFrag from "./glsl/walls.frag.js";
import wallsVert from "./glsl/walls.vert.js";
import {wallsTransform} from "./state.js";
import {initPerspectiveViewport} from "../../_snowpack/link/src/shared-utils/vr/perspectiveViewport.js";
import {createMirrorScene} from "../../_snowpack/link/src/shared-utils/vr/mirror-scene.js";
initPerspectiveViewport(Q, {
  position: [0, 3.4, 25],
  fovy: Math.PI * 0.4,
  lookSpeed: 2
});
Q.painter.updateDrawSettings({
  enable: [Q.gl.DEPTH_TEST]
});
const wallsShade = Q.getShade("walls").update({
  vert: wallsVert,
  frag: wallsFrag
});
const wallsSketch = Q.getSketch("walls").update({
  form: wallsForm,
  shade: wallsShade,
  uniforms: {
    transform: wallsTransform
  }
});
export const scene = createMirrorScene(Q, [wallsSketch], {
  scale: 0.4,
  blurRatioVertical: 2.5,
  blurStrenghOffset: 2.5
});
scene.scene.update({directRender: true});
