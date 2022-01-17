import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

export function fn2() {
  console.log("fn2, module2", import.meta.url);
}
console.log("loading module2 ff");
