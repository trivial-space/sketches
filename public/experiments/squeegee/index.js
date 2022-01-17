import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import "./state.js";
import {events, Q} from "./context.js";
import {scene} from "./renderer.js";
import {addToLoop, startLoop} from "../../_snowpack/link/src/shared-utils/frameLoop.js";
Q.state.device.sizeMultiplier = window.devicePixelRatio;
addToLoop((tpf) => {
  Q.state.device.tpf = Math.min(tpf, 60);
  Q.emit(events.FRAME);
  Q.painter.compose(scene).show(scene);
}, "loop");
Q.listen("index", events.RESIZE, () => {
  scene.update();
});
startLoop();
undefined /* [snowpack] import.meta.hot */ ?.accept();
