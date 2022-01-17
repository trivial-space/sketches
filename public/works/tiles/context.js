import {
  baseEvents,
  getPainterContext
} from "../../_snowpack/link/src/shared-utils/painterState.js";
export const canvas = document.getElementById("canvas");
export const Q = getPainterContext(canvas);
export const events = {
  ...baseEvents,
  INIT: "init",
  ON_IMAGES_LOADED: "on_image_loaded",
  NEW_ACTIVE_TILES: "new_active_tiles"
};
