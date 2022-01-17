import {
  mul,
  add,
  cross,
  dot,
  normalize,
  sub
} from "../../../projects/libs/dist/math/vectors.js";
import {quat, vec3} from "../../../../pkg/gl-matrix.js";
import {
  flatten,
  reverse,
  repeat,
  concat,
  window
} from "../../../projects/libs/dist/utils/sequence.js";
import {side} from "../../../projects/libs/dist/geometry/primitives.js";
export function lineSegment({
  vertex = [0, 0, 0],
  normal = [0, 0, 1],
  direction = [0, 1, 0],
  length = 1
} = {}) {
  return {vertex, normal, direction, length};
}
const rotQuatNormal = quat.create();
const rotQuatDirection = quat.create();
const rotQuatTangent = quat.create();
const rotQuat = quat.create();
const vec3Temp = vec3.create();
export function walkLine3D({length, directionAngle = 0, normalAngle = 0, tangentAngle = 0}, segment = lineSegment()) {
  if (normalAngle) {
    quat.setAxisAngle(rotQuatNormal, segment.normal, normalAngle);
  } else {
    quat.identity(rotQuatNormal);
  }
  if (directionAngle) {
    quat.setAxisAngle(rotQuatDirection, segment.direction, directionAngle);
  } else {
    quat.identity(rotQuatDirection);
  }
  if (tangentAngle) {
    quat.setAxisAngle(rotQuatTangent, vec3.cross(vec3Temp, segment.direction, segment.normal), tangentAngle);
  } else {
    quat.identity(rotQuatTangent);
  }
  quat.multiply(rotQuat, quat.multiply(rotQuat, rotQuatDirection, rotQuatNormal), rotQuatTangent);
  const newNormal = vec3.transformQuat(vec3.create(), segment.normal, rotQuat);
  vec3.normalize(newNormal, newNormal);
  const newDirection = vec3.transformQuat(vec3.create(), segment.direction, rotQuat);
  vec3.normalize(newDirection, newDirection);
  const newVertex = vec3.create();
  vec3.scale(newVertex, segment.direction, segment.length);
  vec3.add(newVertex, newVertex, segment.vertex);
  return lineSegment({
    vertex: newVertex,
    direction: newDirection,
    normal: newNormal,
    length
  });
}
function getSegmentTangent(seg) {
  return seg.direction.length === 2 ? [seg.direction[1], -seg.direction[0]] : cross(seg.normal, seg.direction);
}
export function lineSegmentStartPoints(thickness = 1, segment) {
  const tangent = getSegmentTangent(segment);
  const p1 = add(mul(thickness, tangent), segment.vertex);
  const p2 = add(mul(-thickness, tangent), segment.vertex);
  return [p1, p2];
}
export function lineSegmentEndPoints(thickness = 1, segment) {
  return lineSegmentStartPoints(thickness, {
    ...segment,
    vertex: add(segment.vertex, mul(segment.length, segment.direction))
  });
}
export function splitSharpAngleSegments(thickness, segmentBefore, segmentNext) {
  const cosAngle = dot(segmentBefore.direction, segmentNext.direction);
  if (cosAngle < -0.8) {
    console.log("adding sharp angle segment!");
    const nextTangent = getSegmentTangent(segmentNext);
    const beforeTangent = getSegmentTangent(segmentBefore);
    const tangent = normalize(sub(nextTangent, beforeTangent));
    const dir = side([segmentBefore.vertex, segmentNext.vertex], add(segmentNext.vertex, segmentNext.direction)) >= 0 ? -1 : 1;
    const v1 = add(segmentNext.vertex, mul(dir * -1 * thickness / 2, tangent));
    return [
      {
        ...segmentBefore,
        direction: normalize(sub(v1, segmentBefore.vertex))
      },
      {
        ...segmentNext,
        vertex: v1,
        direction: mul(dir, tangent),
        length: thickness
      },
      {
        ...segmentNext,
        vertex: add(segmentNext.vertex, mul(dir * thickness / 2, tangent))
      }
    ];
  } else {
    return [segmentBefore, segmentNext];
  }
}
export function lineSegmentsJoinPoints(thickness = 1, segmentBefore, segmentNext) {
  thickness = typeof thickness === "number" ? thickness : (thickness(segmentBefore) + thickness(segmentNext)) / 2;
  const nextTangent = getSegmentTangent(segmentNext);
  const beforeTangent = getSegmentTangent(segmentBefore);
  const tangent = normalize(add(nextTangent, beforeTangent));
  let mitterLenght = thickness / dot(tangent, beforeTangent);
  mitterLenght = Math.min(mitterLenght, thickness * 5);
  const p1 = add(mul(mitterLenght, tangent), segmentNext.vertex);
  const p2 = add(mul(-mitterLenght, tangent), segmentNext.vertex);
  return [p1, p2];
}
export function lineToTriangleStripGeometry(line, lineWidth, {
  withBackFace = false,
  withNormals = false,
  withUVs = false,
  storeType
} = {}) {
  line = [line[0]].concat(window(2, line).flatMap(([before, next]) => {
    const width = typeof lineWidth === "number" ? lineWidth : (lineWidth(before) + lineWidth(next)) / 2;
    return splitSharpAngleSegments(width, before, next).slice(1);
  }));
  const lineLength = line.reduce((len, seg) => len + seg.length, 0);
  let points = [];
  let normals = [];
  let uvs = [];
  let currentLength = 0;
  for (let i = 0; i < line.length; i++) {
    const cur = line[i];
    const next = line[i + 1];
    const thickness = typeof lineWidth === "number" ? lineWidth : lineWidth(cur);
    currentLength += cur.length;
    if (i === 0) {
      points = lineSegmentStartPoints(thickness, cur);
      normals = [cur.normal, cur.normal];
      uvs = [
        [0, 0],
        [1, 0]
      ];
    }
    if (next) {
      points = concat(points, lineSegmentsJoinPoints(lineWidth, cur, next));
      const newNormal = normalize(add(cur.normal, next.normal));
      normals = concat(normals, repeat(2, newNormal));
      const uvY = currentLength / lineLength;
      uvs.push([0, uvY], [1, uvY]);
    } else {
      points = concat(points, lineSegmentEndPoints(thickness, cur));
      normals = concat(normals, [cur.normal, cur.normal]);
      uvs.push([0, 1], [1, 1]);
    }
  }
  if (withBackFace) {
    const backLine = reverse(line);
    currentLength = 0;
    for (let i = 0; i < line.length; i++) {
      const cur = backLine[i];
      const next = backLine[i + 1];
      const thickness = typeof lineWidth === "number" ? lineWidth : lineWidth(cur);
      currentLength += cur.length;
      if (i === 0) {
        points = concat(points, lineSegmentEndPoints(thickness, cur));
        normals = concat(normals, repeat(2, mul(-1, cur.normal)));
        uvs = uvs.concat([
          [0, 1],
          [1, 1]
        ]);
      }
      if (next) {
        points = concat(points, lineSegmentsJoinPoints(lineWidth, next, cur));
        const newNormal = mul(-1, normalize(add(cur.normal, next.normal)));
        normals = concat(normals, repeat(2, newNormal));
        const uvY = (lineLength - currentLength) / lineLength;
        uvs.push([0, uvY], [1, uvY]);
      } else {
        points = concat(points, lineSegmentStartPoints(thickness, cur));
        normals = concat(normals, repeat(2, mul(-1, cur.normal)));
        uvs.push([0, 0], [1, 0]);
      }
    }
  }
  const data = {
    attribs: {
      position: {
        buffer: new Float32Array(flatten(points)),
        storeType
      }
    },
    drawType: "TRIANGLE_STRIP",
    itemCount: points.length
  };
  if (withNormals) {
    data.attribs.normal = {
      buffer: new Float32Array(flatten(normals)),
      storeType
    };
  }
  if (withUVs) {
    data.attribs.uv = {
      buffer: new Float32Array(flatten(uvs)),
      storeType
    };
  }
  return data;
}
