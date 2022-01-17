import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

export function fn1() {
  console.log("fn1, module1", import.meta.url);
}
