import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {
  baseEvents,
  getPainterContext
} from "../../_snowpack/link/src/shared-utils/painterState.js";
export const canvas = document.getElementById("canvas");
export const Q = getPainterContext(canvas);
export const events = {
  ...baseEvents
};
undefined /* [snowpack] import.meta.hot */ ?.accept();
