import {alter, M} from "../../../_snowpack/link/src/shared-utils/fp.js";
import {randInt, randIntInRange} from "../../../_snowpack/link/projects/libs/dist/math/random.js";
import {
  add,
  div,
  length,
  mul,
  normalize,
  sub
} from "../../../_snowpack/link/projects/libs/dist/math/vectors.js";
import {flatten, times} from "../../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {canvas} from "./context.js";
export const nodeCount = 40;
export const nameSpaceCount = 6;
const springLength = 200;
export const nodes = times((i) => ({
  id: i,
  pos: [Math.random() * canvas.width, Math.random() * canvas.height],
  ns: randInt(nameSpaceCount),
  force: [0, 0]
}), nodeCount);
export const connections = flatten(times((i) => {
  if (i < nodeCount - 3) {
    const i1 = randIntInRange(i + 1, nodeCount - 1);
    const cs = [[i, i1]];
    const i2 = randIntInRange(i + 1, nodeCount - 1);
    if (i2 !== i1) {
      cs.push([i, i2]);
    }
    return cs;
  } else {
    return [];
  }
}, nodeCount));
function updateForces(force, dir, from, to) {
  const update = (f) => (v) => f.combine(mul, dir).pull(add, v).value;
  alter(from, "force", update(force));
  alter(to, "force", update(force.map((f) => -f)));
}
export function updateNodes(tpf) {
  for (const c of connections) {
    const n1 = nodes[c[0]];
    const n2 = nodes[c[1]];
    const vec = M.of(n2.pos).pull(sub, n1.pos);
    const dir = vec.map(normalize);
    const force = vec.map(length).map((l) => l - springLength).map((v) => v * 2);
    updateForces(force, dir, n1, n2);
  }
  for (let i = 0; i < nodes.length - 1; i++) {
    const n1 = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const n2 = nodes[j];
      const vec = M.of(n2.pos).pull(sub, n1.pos);
      const dir = vec.map(normalize);
      const dist = vec.map(length);
      const force = dist.map((l) => -Math.max(100 - l, 0));
      updateForces(force, dir, n1, n2);
      if (n2.ns === n1.ns) {
        const force2 = dist.map((d) => d - 100);
        updateForces(force2, dir, n1, n2);
      } else {
        const force2 = dist.map((d) => -Math.max(200 - d, 0));
        updateForces(force2, dir, n1, n2);
      }
    }
  }
  for (const node of nodes) {
    const force = node.force;
    const l = length(force) - 3;
    if (l > 0) {
      const n = div(l + 3, force);
      node.pos = add(node.pos, mul(l * (tpf / 500), n));
      node.force = [0, 0];
    }
  }
  return nodes;
}
