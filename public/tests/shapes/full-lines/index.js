import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import "./state.js";
import {events, Q} from "./context.js";
import {scene} from "./renderer.js";
import {addToLoop, startLoop} from "../../../_snowpack/link/src/shared-utils/frameLoop.js";
Q.state.time = 0;
addToLoop((tpf) => {
  Q.state.device.tpf = tpf;
  Q.state.time += tpf / 1e3;
  Q.emit(events.FRAME);
  Q.painter.compose(scene);
}, "loop");
startLoop();
undefined /* [snowpack] import.meta.hot */ ?.accept();
