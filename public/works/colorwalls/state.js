import {mat4, quat} from "../../_snowpack/pkg/gl-matrix.js";
import {events, Q} from "./context.js";
let time = 0;
export const wallsTransform = mat4.create();
const rotation = quat.create();
Q.listen("state", events.FRAME, (s) => {
  time += s.device.tpf;
  quat.fromEuler(rotation, Math.sin(7e-4 * time) * 1.1, time * 1e-3, Math.sin(8e-4 * time) * 1.1);
  mat4.fromRotationTranslationScaleOrigin(wallsTransform, rotation, [0, -8, 0], [0.8, 0.8, 0.8], [0, 60, 0]);
});
