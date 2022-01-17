import {times} from "../../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {events, Q} from "./context.js";
import {noise2d} from "../../../_snowpack/link/projects/libs/dist/math/noise.js";
import {
  walkLine3D,
  lineSegment
} from "../../../_snowpack/link/src/shared-utils/geometry/lines_3d.js";
const last = (arr) => arr[arr.length - 1];
Q.set("lines", {line1: []});
Q.listen("lines", events.FRAME, (s) => {
  s.lines.line1 = times((x) => x, 100).reduce((segments, i) => {
    return segments.concat(walkLine3D({
      length: 1,
      normalAngle: noise2d(i / 6, s.time / 40) / 2,
      tangentAngle: 0.1
    }, last(segments)));
  }, [lineSegment({direction: [0, 0, 1], normal: [-1, 0, 0]})]);
});
