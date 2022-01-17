import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import "./state.js";
import {repeat} from "../_snowpack/link/src/shared-utils/scheduler.js";
import {events, Q} from "./context.js";
import {scene} from "./renderer.js";
repeat((tpf) => {
  Q.state.device.tpf = tpf;
  Q.emit(events.FRAME);
  Q.painter.compose(scene);
}, "loop");
undefined /* [snowpack] import.meta.hot */ ?.accept();
