import {events, paint, Q} from "./context.js";
import base from "./glsl/base.frag.js";
const paintLayer = Q.getLayer("paint");
const bufferSize = 256;
const effect = Q.getEffect("layer").update({
  frag: base,
  uniforms: {
    size: bufferSize,
    paint: () => paintLayer.image(),
    previous: () => "0"
  }
});
export const automaton = Q.getLayer("automaton").update({
  effects: effect,
  width: bufferSize,
  height: bufferSize,
  selfReferencing: true,
  bufferStructure: [
    {
      flipY: true
    }
  ]
});
Q.listen("renderer", events.FRAME, () => {
  paintLayer.update({texture: {asset: paint}});
});
