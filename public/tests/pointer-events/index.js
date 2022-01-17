import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {pointer} from "../../_snowpack/link/projects/libs/dist/events/pointer.js";
const code = document.getElementById("pointer-event-state");
if (code) {
  pointer({enableRightButton: true}, (val) => {
    code.innerHTML = JSON.stringify(val, null, "   ");
  });
}
undefined /* [snowpack] import.meta.hot */ ?.accept();
