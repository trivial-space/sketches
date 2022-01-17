import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import "./state/tiles.js";
import "./viewport.js";
import {repeat} from "../../_snowpack/link/src/shared-utils/scheduler.js";
import {events, Q} from "./context.js";
import {tiles} from "./renderer.js";
Q.listen("start", events.ON_IMAGES_LOADED, (s) => {
  repeat((tpf) => {
    s.device.tpf = tpf;
    Q.emit(events.FRAME);
    Q.painter.draw({sketches: tiles});
  }, "loop");
});
Q.emit(events.INIT);
undefined /* [snowpack] import.meta.hot */ ?.accept();
