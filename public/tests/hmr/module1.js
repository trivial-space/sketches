import {createObject} from "./module2.js";
export const obj = createObject();
obj.incI();
console.log("loading module1");
console.log("i", obj.i, "j", obj.j, "k", obj.k);
