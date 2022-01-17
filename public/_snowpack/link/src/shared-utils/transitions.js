import {baseEvents} from "./painterState.js";
export const linear = (step) => step;
export class Transition {
  constructor(options) {
    this.easeFn = linear;
    this.duration = 1e3;
    this.delay = 0;
    this.repeat = false;
    this.done = false;
    Object.assign(this, options);
    this.progress = -this.delay;
    this.oldValue = this.easeFn(0);
  }
  update(step) {
    if (this.done) {
      return 0;
    }
    this.progress += step;
    if (this.progress <= 0) {
      return 0;
    }
    if (this.progress <= step && this.onStart) {
      this.onStart();
    }
    const newValue = this.progress < this.duration ? this.easeFn(this.progress / this.duration) : this.easeFn(1);
    const value = newValue - this.oldValue;
    this.oldValue = newValue;
    if (this.onUpdate)
      this.onUpdate(value);
    if (this.progress >= this.duration) {
      if (this.repeat === true || typeof this.repeat === "number" && this.repeat > 0) {
        if (typeof this.repeat === "number") {
          this.repeat--;
        }
        this.progress = 0;
      } else {
        if (this.onComplete) {
          this.onComplete();
        }
        this.done = true;
      }
    }
    return value;
  }
}
let transitions = [];
let initialized = false;
export function pushTransition(Q, transitionProps) {
  if (!initialized) {
    Q.listen("_transitionRunner", baseEvents.FRAME, (s) => {
      transitions = transitions.filter((t2) => !t2.done);
      transitions.forEach((t2) => t2.update(s.device.tpf));
    });
    initialized = true;
  }
  const t = new Transition(transitionProps);
  transitions.push(t);
  return t;
}
