import {makeClear} from "../../_snowpack/link/projects/painter/dist/utils/context.js";
import {plane} from "../../_snowpack/link/projects/painter/dist/utils/geometry/plane.js";
import {events, Q} from "./context.js";
import frag from "./shaders/geo-frag.js";
import vert from "./shaders/geo-vert.js";
import lightFrag from "./shaders/light-frag.js";
import {initPerspectiveViewport} from "../../_snowpack/link/src/shared-utils/vr/perspectiveViewport.js";
const {state: s, gl} = Q;
initPerspectiveViewport(Q, {
  fovy: Math.PI * 0.3,
  position: [11, 2, -9],
  rotationY: 2
});
const geometry = plane(10, 10, 0, 0);
const planeForm = Q.getForm("plane").update(geometry);
const geoShade = Q.getShade("geo").update({
  frag,
  vert
});
const texture = Q.getLayer("tex").update({texture: {}});
const img = new Image();
img.onload = () => {
  texture.update({
    texture: {
      asset: img,
      minFilter: "LINEAR_MIPMAP_LINEAR",
      magFilter: "LINEAR"
    }
  });
};
img.src = "tree.jpg";
const groundSketch = Q.getSketch("ground").update({
  form: planeForm,
  shade: geoShade,
  uniforms: {
    transform: () => s.scene.groundTransform,
    color: () => s.scene.groundColor
  }
});
const lightSketch = Q.getSketch("light").update({
  form: planeForm,
  shade: geoShade,
  uniforms: [
    {
      transform: () => s.scene.lightTransforms[0],
      color: () => s.scene.lightColor
    },
    {
      transform: () => s.scene.lightTransforms[1],
      color: () => s.scene.lightBackColor
    }
  ],
  drawSettings: {
    enable: [gl.CULL_FACE]
  }
});
const bufferSpec = {type: "FLOAT"};
export const scene = Q.getLayer("scene").update({
  sketches: [lightSketch, groundSketch],
  uniforms: {
    view: () => s.viewPort.camera.viewMat,
    projection: () => s.viewPort.camera.projectionMat
  },
  drawSettings: {
    enable: [gl.DEPTH_TEST],
    clearBits: makeClear(gl, "color", "depth")
  },
  bufferStructure: [bufferSpec, bufferSpec, bufferSpec, bufferSpec]
});
export const light = Q.getEffect("light").update({
  frag: lightFrag,
  uniforms: {
    eyePosition: () => s.viewPort.camera.position,
    lightMat: () => s.scene.lightTransforms[0],
    view: () => s.viewPort.camera.viewMat,
    tex: () => texture.image(),
    positions: scene.image(0),
    normals: scene.image(1),
    uvs: scene.image(2),
    colors: scene.image(3)
  },
  drawSettings: {
    enable: [gl.BLEND],
    clearBits: makeClear(gl, "color")
  }
});
Q.listen("renderer", events.RESIZE, () => {
  scene.update();
});
