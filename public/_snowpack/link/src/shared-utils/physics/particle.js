import {add, div, mul, vec} from "../../../projects/libs/dist/math/vectors.js";
export class Particle {
  constructor() {
    this.mass = 1;
    this.damping = 1;
  }
  applyForce(newForce) {
    const {force} = this;
    add(force, newForce, force);
  }
  accelerate() {
    const {vel, pos, force, mass, damping} = this;
    if (mass !== 1) {
      div(mass, force, force);
    }
    add(vel, force, vel);
    if (damping !== 1) {
      mul(damping, vel, vel);
    }
    add(pos, vel, pos);
    mul(0, force, force);
  }
}
export function createParticle2D({
  pos,
  vel,
  force,
  mass = 1,
  damping = 1
}) {
  const p = new Particle();
  p.pos = vec(pos || [0, 0]);
  p.vel = vec(vel || [0, 0]);
  p.force = vec(force || [0, 0]);
  p.mass = mass;
  p.damping = damping;
  return p;
}
export function createParticle3D({
  pos,
  vel,
  force,
  mass = 1,
  damping = 1
}) {
  const p = new Particle();
  p.pos = vec(pos || [0, 0, 0]);
  p.vel = vec(vel || [0, 0, 0]);
  p.force = vec(force || [0, 0, 0]);
  p.mass = mass;
  p.damping = damping;
  return p;
}
