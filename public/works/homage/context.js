import {
  baseEvents,
  getPainterContext
} from "../../_snowpack/link/src/shared-utils/painterState.js";
export const canvas = document.getElementById("canvas");
export const Q = getPainterContext(canvas);
export const getCanvasSize = () => [canvas.width, canvas.height];
export const events = {
  ...baseEvents
};
