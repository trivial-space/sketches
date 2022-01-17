import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {obj} from "./module1.js";
obj.incJ();
console.log("loading index");
console.log("i", obj.i, "j", obj.j, "k", obj.k);
undefined /* [snowpack] import.meta.hot */ ?.accept();
