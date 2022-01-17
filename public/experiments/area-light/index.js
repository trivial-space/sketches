import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import "./state.js";
import {repeat} from "../../_snowpack/link/src/shared-utils/scheduler.js";
import {events, Q} from "./context.js";
import {light, scene} from "./renderer.js";
repeat((tpf) => {
  Q.get("device").tpf = tpf;
  Q.emit(events.FRAME);
  Q.painter.compose(scene);
  Q.painter.draw({effects: light});
}, "loop");
undefined /* [snowpack] import.meta.hot */ ?.accept();
