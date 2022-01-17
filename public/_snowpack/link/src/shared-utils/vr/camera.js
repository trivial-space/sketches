import {mat4, vec3} from "../../../../pkg/gl-matrix.js";
import {KeyCodes} from "../../../projects/libs/dist/events/keyboard.js";
import {Buttons} from "../../../projects/libs/dist/events/pointer.js";
export class Camera {
  constructor(props) {
    this.position = [0, 0, 0];
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationXMat = mat4.create();
    this.rotationYMat = mat4.create();
    this.projectionMat = mat4.create();
    this.viewMat = mat4.create();
    this.needsUpdateView = true;
    Object.assign(this, props);
    this.updateRotationX();
    this.updateRotationY();
  }
  updateRotationX(amount = 0) {
    this.rotationX += amount;
    mat4.fromXRotation(this.rotationXMat, this.rotationX);
    this.needsUpdateView = true;
  }
  updateRotationY(amount = 0) {
    this.rotationY += amount;
    mat4.fromYRotation(this.rotationYMat, this.rotationY);
    this.needsUpdateView = true;
  }
  moveForward(dist) {
    const v = vec3.fromValues(this.rotationYMat[8], this.rotationYMat[9], this.rotationYMat[10]);
    vec3.add(this.position, this.position, vec3.scale(v, v, -dist));
    this.needsUpdateView = true;
  }
  moveLeft(dist) {
    const v = vec3.fromValues(this.rotationYMat[0], this.rotationYMat[1], this.rotationYMat[2]);
    vec3.add(this.position, this.position, vec3.scale(v, v, -dist));
    this.needsUpdateView = true;
  }
  moveUp(dist) {
    const v = vec3.fromValues(this.rotationYMat[4], this.rotationYMat[5], this.rotationYMat[6]);
    vec3.add(this.position, this.position, vec3.scale(v, v, dist));
    this.needsUpdateView = true;
  }
  update() {
    if (this.needsUpdateView) {
      mat4.fromTranslation(this.viewMat, this.position);
      mat4.multiply(this.viewMat, this.viewMat, this.rotationYMat);
      mat4.multiply(this.viewMat, this.viewMat, this.rotationXMat);
      mat4.invert(this.viewMat, this.viewMat);
      this.needsUpdateView = false;
    }
  }
}
export class PerspectiveCamera extends Camera {
  constructor(props) {
    super(props);
    this.fovy = Math.PI * 0.6;
    this.aspect = 1;
    this.near = 0.1;
    this.far = 1e3;
    this.needsUpdateProjection = true;
    Object.assign(this, props);
    this.update();
  }
  update() {
    super.update();
    if (this.needsUpdateProjection) {
      mat4.perspective(this.projectionMat, this.fovy, this.aspect, this.near, this.far);
      this.needsUpdateProjection = false;
    }
  }
}
export function WithInputNavigation(Cam) {
  return class extends Cam {
    updatePosFromInput(speed, keys, pointer) {
      if (!(keys || pointer))
        return;
      if (keys?.[KeyCodes.UP] || keys?.[KeyCodes.W] || pointer?.holding && !pointer.pressed[Buttons.RIGHT]) {
        this.moveForward(speed);
      }
      if (keys?.[KeyCodes.DOWN] || keys?.[KeyCodes.S] || pointer?.pressed[Buttons.RIGHT]) {
        this.moveForward(-speed);
      }
      if (keys?.[KeyCodes.LEFT] || keys?.[KeyCodes.A]) {
        this.moveLeft(speed);
      }
      if (keys?.[KeyCodes.RIGHT] || keys?.[KeyCodes.D]) {
        this.moveLeft(-speed);
      }
    }
  };
}
export function WithInputRotation(Cam) {
  return class extends Cam {
    constructor() {
      super(...arguments);
      this._oldMouse = {x: 0, y: 0};
    }
    updateRotFromPointer(speed, m) {
      const old = this._oldMouse;
      if (m.dragging) {
        const deltaX = old.x - m.drag.x;
        const deltaY = old.y - m.drag.y;
        old.x = m.drag.x;
        old.y = m.drag.y;
        deltaY && this.updateRotationX(deltaY * speed);
        deltaX && this.updateRotationY(deltaX * speed);
      } else {
        old.x && (old.x = 0);
        old.y && (old.y = 0);
      }
    }
  };
}
