import {div, length, mul, sub} from "../../../projects/libs/dist/math/vectors.js";
const temp = [];
export function springForce(springLength, springStrength, agentPos, receiverPos) {
  const vec = sub(receiverPos, agentPos, temp);
  const len = length(vec);
  const norm = div(len, vec, temp);
  return mul((springLength - len) * springStrength, norm);
}
const temp2 = [];
export function directionForce(strength, direction) {
  const len = length(direction);
  let norm = direction;
  if (len != 1) {
    norm = div(len, direction, temp2);
  }
  return mul(strength, norm);
}
