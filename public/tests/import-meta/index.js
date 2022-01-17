import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {fn1} from "./module1.js";
import {fn2} from "./module2.js";
fn1();
fn2();
console.log("index", import.meta.url);
