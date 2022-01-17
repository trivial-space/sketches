import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {repeat} from "../../_snowpack/link/src/shared-utils/scheduler.js";
import {events, Q} from "./context.js";
import "./paint.js";
import {automaton} from "./renderer.js";
repeat((tpf) => {
  Q.get("device").tpf = tpf;
  Q.emit(events.PROCESS_PAINT);
  Q.emit(events.FRAME);
  Q.painter.compose(automaton).show(automaton);
  Q.emit(events.CLEANUP_PAINT);
}, "loop");
undefined /* [snowpack] import.meta.hot */ ?.accept();
