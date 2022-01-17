import {PerspectiveCamera} from "../../_snowpack/link/src/shared-utils/vr/camera.js";
import {events, Q} from "./context.js";
export class ViewPort {
  constructor() {
    this.distance = 1;
    this.camera = new PerspectiveCamera({
      fovy: Math.PI * 0.5,
      position: [0, 0, 0]
    });
  }
}
Q.listen("viewPort", events.RESIZE, (s) => {
  const v = s.viewPort;
  const cam = v.camera;
  v.distance = s.tiles.colCount * s.tiles.tileSize * 0.47;
  cam.aspect = s.device.canvas.width / s.device.canvas.height;
  cam.needsUpdateProjection = true;
  cam.position = [0, 0, v.distance / cam.aspect];
  cam.needsUpdateView = true;
  cam.update();
});
Q.set("viewPort", new ViewPort());
