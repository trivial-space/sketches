import {
  mul,
  add,
  dot,
  normalize,
  sub,
  length,
  div,
  cross2D
} from "../../../projects/libs/dist/math/vectors.js";
import {
  createDoubleLinkedList
} from "../../../projects/libs/dist/datastructures/double-linked-list.js";
import {doTimes, flatten, zip} from "../../../projects/libs/dist/utils/sequence.js";
import {lerp} from "../../../projects/libs/dist/math/core.js";
import {partial} from "../../../projects/libs/dist/fp/core.js";
export function newLinePoint(vertex, width) {
  return {direction: [0, 0], length: 0, vertex, width};
}
function updatePoint(point, nextPoint) {
  if (point && nextPoint) {
    const dir = sub(nextPoint.vertex, point.vertex);
    const len = length(dir);
    point.length = len;
    point.direction = div(len, dir, dir);
  }
  return point;
}
export function smouthenPoint(node, {
  ratio = 0.25,
  minLength = 3,
  depth = 1,
  recalculate = true,
  interPolate = ["width"]
} = {}) {
  if (node && node.prev && node.next && node.prev.val.length > minLength && node.val.length > minLength) {
    const prev = node.prev;
    const lerp1 = partial(lerp, 1 - ratio);
    const newPrevPoint = newLinePoint(zip(lerp1, node.prev.val.vertex, node.val.vertex));
    for (const key of interPolate) {
      const prevVal = node.prev.val[key];
      const nodeVal = node.val[key];
      if (typeof nodeVal === "number" && typeof prevVal === "number") {
        newPrevPoint[key] = lerp1(prevVal, nodeVal);
      }
      if (Array.isArray(nodeVal) && Array.isArray(prevVal)) {
        newPrevPoint[key] = zip(lerp1, prevVal, nodeVal);
      }
    }
    node.list.prependAt(node, newPrevPoint, recalculate);
    prev.set(prev.val, recalculate);
    const lerp2 = partial(lerp, ratio);
    const newNodePoint = newLinePoint(zip(lerp2, node.val.vertex, node.next.val.vertex));
    for (const key of interPolate) {
      const nodeVal = node.val[key];
      const nextVal = node.next.val[key];
      if (typeof nodeVal === "number" && typeof nextVal === "number") {
        newNodePoint[key] = lerp2(nodeVal, nextVal);
      }
      if (Array.isArray(nodeVal) && Array.isArray(nextVal)) {
        newNodePoint[key] = zip(lerp2, nodeVal, nextVal);
      }
    }
    node.set(newNodePoint, recalculate);
    node.next.set(node.next.val, recalculate);
    if (depth > 1) {
      smouthenPoint(node.prev, {
        ratio,
        minLength,
        depth: depth - 1,
        recalculate,
        interPolate
      });
      smouthenPoint(node, {
        ratio,
        minLength,
        depth: depth - 1,
        recalculate,
        interPolate
      });
    }
  }
}
function getTangent(direction) {
  return [direction[1], -direction[0]];
}
function linePositions(vertex, tangent, width) {
  const p1 = add(mul(width, tangent), vertex);
  const p2 = add(mul(-width, tangent), vertex);
  return [p1, p2];
}
export function isSharpAngle(node) {
  if (!node.prev || !node.next)
    return false;
  const cosAngle = dot(node.prev.val.direction, node.val.direction);
  if (cosAngle < -0.5) {
    return true;
  }
  return false;
}
export function lineMitterPositions(node, thickness) {
  if (!node.prev && !node.next) {
    throw "incomplete Line";
  }
  const point = node.val;
  thickness = point.width || thickness || 1;
  if (!node.prev) {
    const tangent2 = getTangent(point.direction);
    return linePositions(point.vertex, tangent2, thickness);
  }
  if (!node.next) {
    const tangent2 = getTangent(node.prev.val.direction);
    return linePositions(point.vertex, tangent2, thickness);
  }
  const nextTangent = getTangent(node.val.direction);
  const prevTangent = getTangent(node.prev.val.direction);
  const tangent = normalize(add(nextTangent, prevTangent));
  let mitterLenght = thickness / dot(tangent, prevTangent);
  mitterLenght = Math.min(mitterLenght, thickness * 5);
  return linePositions(node.val.vertex, tangent, mitterLenght);
}
function adjustEdgePoints(newPoints, prevPoints, curr, prev, lineWidth) {
  const width = curr.val.width || lineWidth || 1;
  const c = width / dot(normalize(add(mul(-1, prev.val.direction), curr.val.direction)), curr.val.direction);
  const a = Math.sqrt(c * c - width * width);
  if (a > 1e-3) {
    if (cross2D(curr.val.direction, prev.val.direction) > 0) {
      add(newPoints[0], mul(-a, curr.val.direction), newPoints[0]);
      add(newPoints[1], mul(a, curr.val.direction), newPoints[1]);
      add(prevPoints[0], mul(a, prev.val.direction), prevPoints[0]);
      add(prevPoints[1], mul(-a, prev.val.direction), prevPoints[1]);
    } else {
      add(newPoints[0], mul(a, curr.val.direction), newPoints[0]);
      add(newPoints[1], mul(-a, curr.val.direction), newPoints[1]);
      add(prevPoints[0], mul(-a, prev.val.direction), prevPoints[0]);
      add(prevPoints[1], mul(a, prev.val.direction), prevPoints[1]);
    }
  }
}
export function createLine(opts) {
  return createDoubleLinkedList([], {
    onNextUpdated: (n) => {
      updatePoint(n.val, n.next && n.next.val);
      opts?.onNextUpdated?.(n);
    },
    onPrevUpdated: opts?.onPrevUpdated
  });
}
export function getLineLength(line) {
  let lineLength = 0;
  for (const node of line.nodes) {
    lineLength += node.val.length;
  }
  return lineLength;
}
export function splitLineAtSharpAngle(line) {
  const lines = [];
  let currentLine = createLine();
  for (const node of line.nodes) {
    if (isSharpAngle(node)) {
      currentLine.append({
        vertex: node.val.vertex,
        width: node.val.width,
        direction: node.prev.val.direction,
        length: 0
      });
      lines.push(currentLine);
      currentLine = createLine();
    }
    currentLine.append(node.val);
  }
  lines.push(currentLine);
  return lines;
}
export function smouthenLine(topLine, smouthCount = 1) {
  doTimes(() => {
    for (const node of topLine.nodes) {
      smouthenPoint(node, {
        minLength: -1,
        interPolate: [
          "currentLength",
          "direction",
          "length",
          "uv",
          "localUV",
          "width"
        ]
      });
    }
  }, smouthCount);
}
export function splitAfterLength(lines, length2) {
  const result = [];
  let currentLength = 0;
  let currentLines = [];
  result.push(currentLines);
  for (const line of lines) {
    let currentLine = createLine();
    for (const val of line) {
      currentLength += val.length;
      if (currentLine.size > 1 && currentLength >= length2) {
        currentLine.append(val);
        currentLines.push(currentLine);
        currentLength = 0;
        currentLine = createLine();
        currentLines = [];
        result.push(currentLines);
      }
      currentLine.append(val);
    }
    if (currentLine.size > 1) {
      currentLines.push(currentLine);
    }
  }
  return result;
}
export function lineToFormCollection(line, {
  lineWidth,
  storeType = "STATIC",
  smouthCount = 0
} = {}) {
  if (line.size < 2) {
    return [{attribs: {}, itemCount: 0}];
  }
  const outlines = lineToOutlinesAttributes(line, lineWidth);
  if (smouthCount) {
    outlines.forEach(({bottomLine, topLine}) => {
      smouthenLine(topLine, smouthCount);
      smouthenLine(bottomLine, smouthCount);
    });
  }
  return outlines.map((outline) => {
    return lineOutlineToFormData(outline, storeType);
  });
}
export function lineToAnimatedFormCollection(line, {
  lineWidth,
  storeType = "STATIC",
  smouthCount = 0,
  splitAfterLength: splitAfterLength2
} = {}) {
  if (line.size < 2) {
    return [[{attribs: {}, itemCount: 0}]];
  }
  const outlines = lineToOutlinesAttributes(line, lineWidth);
  const splitOutlines = splitAfterLength2 ? splitOutlineAfterLength(outlines, splitAfterLength2) : [outlines];
  if (smouthCount) {
    splitOutlines.forEach((outlines2) => outlines2.forEach(({bottomLine, topLine}) => {
      smouthenLine(topLine, smouthCount);
      smouthenLine(bottomLine, smouthCount);
    }));
  }
  return splitOutlines.map((outlines2) => outlines2.map((outline) => {
    return lineOutlineToFormData(outline, storeType);
  }));
}
function lineOutlineToFormData({bottomLine, topLine}, storeType) {
  const points = [];
  const uvs = [];
  const localUvs = [];
  const lengths = [];
  const widths = [];
  let top = topLine.first;
  let bottom = bottomLine.first;
  while (top && bottom) {
    points.push(top.val.vertex, bottom.val.vertex);
    uvs.push(top.val.uv, bottom.val.uv);
    localUvs.push(top.val.localUV, bottom.val.localUV);
    lengths.push(top.val.currentLength, bottom.val.currentLength);
    widths.push(top.val.width, bottom.val.width);
    top = top.next;
    bottom = bottom.next;
  }
  const data = {
    attribs: {
      position: {
        buffer: new Float32Array(flatten(points)),
        storeType
      },
      uv: {
        buffer: new Float32Array(flatten(uvs)),
        storeType
      },
      localUv: {
        buffer: new Float32Array(flatten(localUvs)),
        storeType
      },
      length: {
        buffer: new Float32Array(lengths),
        storeType
      },
      width: {
        buffer: new Float32Array(widths),
        storeType
      }
    },
    drawType: "TRIANGLE_STRIP",
    itemCount: points.length
  };
  return data;
}
function lineToOutlinesAttributes(line, lineWidth) {
  const lineLength = getLineLength(line);
  const lineFragments = splitLineAtSharpAngle(line);
  let currentLength = 0;
  let swap = false;
  let prev = null;
  let prevPoints = null;
  return lineFragments.map((line2) => {
    swap = !swap;
    let currentLocalLength = 0;
    const lengthNodes = [...line2];
    lengthNodes.pop();
    let localLineLength = lengthNodes.map((n) => n.length).reduce((a, b) => a + b, 0);
    let uvY = currentLength / lineLength;
    let localUvY = currentLocalLength / localLineLength;
    const topLine = createLine();
    const bottomLine = createLine();
    topLine.append({
      ...line2.first.val,
      uv: [0.5, uvY],
      localUV: [0.5, localUvY],
      currentLength,
      width: 0
    });
    bottomLine.append({
      ...line2.first.val,
      uv: [0.5, uvY],
      localUV: [0.5, localUvY],
      currentLength,
      width: 0
    });
    for (const curr of line2.nodes) {
      uvY = currentLength / lineLength;
      localUvY = currentLocalLength / localLineLength;
      const width = curr.val.width || lineWidth || 1;
      const newPoints = lineMitterPositions(curr, lineWidth);
      if (curr === line2.first && prev && prevPoints) {
        adjustEdgePoints(newPoints, prevPoints, curr, prev, lineWidth);
      }
      topLine.append({
        ...curr.val,
        vertex: newPoints[0],
        uv: [swap ? 0 : 1, uvY],
        localUV: [swap ? 0 : 1, localUvY],
        currentLength,
        width
      });
      bottomLine.append({
        ...curr.val,
        vertex: newPoints[1],
        uv: [swap ? 1 : 0, uvY],
        localUV: [swap ? 1 : 0, localUvY],
        currentLength,
        width
      });
      if (curr.next) {
        currentLength += curr.val.length;
        currentLocalLength += curr.val.length;
      }
      prev = curr;
      prevPoints = newPoints;
    }
    topLine.append({
      ...line2.last.val,
      uv: [0.5, uvY],
      localUV: [0.5, 1],
      currentLength,
      width: 0
    });
    bottomLine.append({
      ...line2.last.val,
      uv: [0.5, uvY],
      localUV: [0.5, 1],
      currentLength,
      width: 0
    });
    return {bottomLine, topLine};
  });
}
function splitOutlineAfterLength(outlines, length2) {
  const tops = [];
  const bottoms = [];
  for (const outline of outlines) {
    tops.push(outline.topLine);
    bottoms.push(outline.bottomLine);
  }
  const splitTops = splitAfterLength(tops, length2);
  const splitBottoms = splitAfterLength(bottoms, length2);
  const result = [];
  splitTops.forEach((partTop, i) => {
    const partBottom = splitBottoms[i];
    result.push(zip((topLine, bottomLine) => ({bottomLine, topLine}), partTop, partBottom));
  });
  return result;
}
