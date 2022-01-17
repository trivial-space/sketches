import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import "./state.js";
import {events, Q} from "./context.js";
import {scene} from "./renderer.js";
Q.state.time = 0;
Q.state.device.sizeMultiplier = window.devicePixelRatio;
Q.listen("index", events.RESIZE, () => {
  scene.update();
  Q.painter.compose(scene);
  console.log(scene._targets[0].width, Q.gl.drawingBufferWidth);
});
undefined /* [snowpack] import.meta.hot */ ?.accept();
