import {mat4} from "../_snowpack/pkg/gl-matrix.js";
import {normalRand} from "../_snowpack/link/projects/libs/dist/math/random.js";
import {times} from "../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {events, Q} from "./context.js";
export class Quad {
  constructor() {
    this.transform = mat4.create();
    this.color = times(normalRand, 3);
  }
  update(tpf) {
    mat4.rotateY(this.transform, this.transform, tpf * 3e-3);
  }
}
export class Entities {
  constructor() {
    this.quad = new Quad();
  }
}
Q.listen("entities", events.FRAME, (s) => {
  const en = s.entities;
  const tpf = s.device.tpf;
  en.quad.update(tpf);
});
Q.set("entities", new Entities(), {reset: {quad: {color: true}}});
