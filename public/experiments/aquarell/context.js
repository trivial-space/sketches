import {
  baseEvents,
  getPainterContext
} from "../../_snowpack/link/src/shared-utils/painterState.js";
export const canvas = document.getElementById("canvas");
export const paint = document.getElementById("paint");
export const Q = getPainterContext(canvas);
export const events = {
  ...baseEvents,
  PROCESS_PAINT: "process_paint",
  CLEANUP_PAINT: "cleanup_paint"
};
