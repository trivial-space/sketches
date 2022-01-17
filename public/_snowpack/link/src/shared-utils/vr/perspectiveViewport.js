import {baseEvents} from "../painterState.js";
import {
  PerspectiveCamera,
  WithInputNavigation,
  WithInputRotation
} from "./camera.js";
export class ViewPort {
  constructor() {
    this.moveSpeed = 2;
    this.lookSpeed = 2;
    this.camera = new (WithInputNavigation(WithInputRotation(PerspectiveCamera)))({
      fovy: Math.PI * 0.3,
      position: [0, 0, 5]
    });
  }
}
export function initPerspectiveViewport(ctx, {lookSpeed, moveSpeed, position, rotationY, rotationX, fovy} = {}) {
  const v = new ViewPort();
  if (lookSpeed) {
    v.lookSpeed = lookSpeed;
  }
  if (moveSpeed) {
    v.moveSpeed = moveSpeed;
  }
  if (fovy) {
    v.camera.fovy = fovy;
    v.camera.needsUpdateProjection = true;
  }
  if (position) {
    v.camera.position = position;
    v.camera.needsUpdateView = true;
  }
  if (rotationX) {
    v.camera.rotationX = rotationX;
    v.camera.updateRotationX();
  }
  if (rotationY) {
    v.camera.rotationY = rotationY;
    v.camera.updateRotationY();
  }
  ctx.set("viewPort", v, {
    reset: {moveSpeed: true, lookSpeed: true}
  });
  ctx.listen("viewPort", baseEvents.FRAME, ({device: d, viewPort: v2}) => {
    const tpf = d.tpf / 1e3;
    v2.camera.updatePosFromInput(v2.moveSpeed * tpf, d.keys, d.pointer);
    const p = d.pointer;
    const dragInfo = {
      dragging: p.dragging,
      drag: {
        x: d.sizeMultiplier * p.drag.x / d.canvas.width,
        y: d.sizeMultiplier * p.drag.y / d.canvas.height
      }
    };
    v2.camera.updateRotFromPointer(v2.lookSpeed, dragInfo);
    v2.camera.update();
    return;
  });
  ctx.listen("viewPort", baseEvents.RESIZE, ({device: d, viewPort: v2}) => {
    v2.camera.aspect = d.canvas.width / d.canvas.height;
    v2.camera.needsUpdateProjection = true;
  });
}
