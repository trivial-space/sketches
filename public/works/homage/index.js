import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {addToLoop, startLoop} from "../../_snowpack/link/src/shared-utils/frameLoop.js";
import {events, Q} from "./context.js";
import {
  mirrorScene,
  scene,
  videoLights,
  videoTextureData,
  videoTextures
} from "./renderer.js";
import {videos} from "./state/videos.js";
const d = Q.get("device");
videos.then((vs) => {
  function startVideos() {
    vs.forEach((v) => v.play());
    d.canvas.removeEventListener("mousedown", startVideos);
    d.canvas.removeEventListener("touchstart", startVideos);
  }
  d.canvas.addEventListener("mousedown", startVideos);
  d.canvas.addEventListener("touchstart", startVideos);
  addToLoop((tpf) => {
    d.tpf = tpf;
    Q.emit(events.FRAME);
    videoTextures.forEach((t, i) => t.update({texture: {...videoTextureData, asset: vs[i]}}));
    Q.painter.compose(...videoLights, mirrorScene, scene);
  }, "render");
  startLoop();
});
undefined /* [snowpack] import.meta.hot */ ?.accept();
