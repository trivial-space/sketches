import {events, Q} from "./context.js";
import {
  walkLine3D,
  lineSegment,
  lineSegmentStartPoints,
  lineSegmentsJoinPoints
} from "../../_snowpack/link/src/shared-utils/geometry/lines_3d.js";
const speed = 3;
const segmentLength = 4.3;
let isStraight = false;
function nextStep() {
  isStraight = !isStraight;
  return {
    currentTime: 0,
    duration: isStraight ? segmentLength * 300 : segmentLength * 300,
    turn: isStraight ? 0 : Math.random() >= 0.5 ? Math.PI : -Math.PI
  };
}
const segment = lineSegment({
  direction: [0, 1, 0],
  normal: [0, 0, 1],
  vertex: [0, -3, 0]
});
const lineWidth = 1.6;
export class Squeegee {
  constructor() {
    this.step = nextStep();
    this.segment = segment;
    this.lineEndPoints = lineSegmentStartPoints(lineWidth, segment);
  }
  update(tpf) {
    const part = tpf / this.step.duration;
    this.step.currentTime += tpf;
    const newSegment = walkLine3D({
      length: speed * tpf / 1e3,
      normalAngle: part * this.step.turn
    }, this.segment);
    this.lineStartPoints = this.lineEndPoints;
    this.lineEndPoints = lineSegmentsJoinPoints(lineWidth, this.segment, newSegment);
    this.segment = newSegment;
    if (this.step.currentTime >= this.step.duration) {
      this.step = nextStep();
    }
  }
}
Q.set("squeegee", new Squeegee());
Q.listen("Squeegee", events.FRAME, (s) => {
  s.squeegee.update(s.device.tpf);
});
