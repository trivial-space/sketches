import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {events, Q} from "./context.js";
import {repeat} from "../../_snowpack/link/src/shared-utils/scheduler.js";
import {scene, noiseTex2, lineTex, noiseLayer} from "./renderer.js";
repeat((tpf) => {
  Q.state.device.tpf = tpf;
  Q.emit(events.FRAME);
  Q.painter.compose(noiseTex2, noiseLayer, lineTex, scene.mirrorScene, scene.scene).show(scene.scene);
}, "loop");
undefined /* [snowpack] import.meta.hot */ ?.accept();
