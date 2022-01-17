import {
  baseEvents,
  getPainterContext
} from "../../_snowpack/link/src/shared-utils/painterState.js";
export const canvas = document.getElementById("canvas");
export const events = {
  ...baseEvents
};
export const Q = getPainterContext(canvas);
