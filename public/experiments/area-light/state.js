import {mat4} from "../../_snowpack/pkg/gl-matrix.js";
import {events, Q} from "./context.js";
export class SceneState {
  constructor() {
    this.time = 0;
    this.groundColor = [0.7, 0.6, 0.9, 1];
    this.groundTransform = mat4.create();
    this.rotationSpeed = 2e-4;
    this.lightRotation = -Math.PI * 0.8;
    this.lightPosition = [0, 3.5, 0];
    this.lightColor = [1, 1, 1, 0];
    this.lightBackColor = [0, 0, 0.2, 0];
    this.lightTransforms = [mat4.create(), mat4.create()];
    mat4.rotateX(this.groundTransform, this.groundTransform, Math.PI / 2);
    mat4.scale(this.groundTransform, this.groundTransform, [10, 10, 10]);
    this.update(0);
  }
  update(tpf) {
    this.time += tpf;
    this.lightRotation += this.rotationSpeed * tpf;
    this.lightPosition[1] += Math.sin(this.time / 2e3) * 0.05;
    mat4.fromTranslation(this.lightTransforms[0], this.lightPosition);
    mat4.rotateX(this.lightTransforms[0], this.lightTransforms[0], this.lightRotation);
    mat4.rotateX(this.lightTransforms[1], this.lightTransforms[0], Math.PI);
  }
}
Q.listen("entities", events.FRAME, (s) => {
  s.scene.update(s.device.tpf);
});
Q.set("scene", new SceneState());
