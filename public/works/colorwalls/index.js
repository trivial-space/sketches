import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {addToLoop, startLoop} from "../../_snowpack/link/src/shared-utils/frameLoop.js";
import {events, Q} from "./context.js";
import {scene} from "./renderer.js";
addToLoop((tpf) => {
  Q.get("device").tpf = tpf;
  Q.emit(events.FRAME);
  Q.painter.compose(scene.mirrorScene, scene.scene);
}, "loop");
startLoop();
undefined /* [snowpack] import.meta.hot */ ?.accept();
