import {line2DVert, line3DVert, lineFrag} from "./lines-shaders.js";
import {flatten, times} from "../../../../projects/libs/dist/utils/sequence.js";
import {triangulate} from "../../../../projects/libs/dist/geometry/quad.js";
import {createPoints2DSketch, createPoints3DSketch} from "../points/points.js";
function createLinesForm({segments, points = [], ...data}) {
  const formData = {
    drawType: "TRIANGLES",
    attribs: {
      position1: {
        buffer: new Float32Array(flatten(segments ? segments.flatMap(([p, n]) => [p, p, n, n]) : flatten(times((i) => {
          const p = points[i];
          const n = points[i + 1];
          return [p, p, n, n];
        }, points.length - 1)))),
        storeType: data.dynamicForm ? "DYNAMIC" : "STATIC"
      },
      position2: {
        buffer: new Float32Array(flatten(segments ? segments.flatMap(([p, n]) => [n, n, p, p]) : flatten(times((i) => {
          const p = points[i];
          const n = points[i + 1];
          return [n, n, p, p];
        }, points.length - 1)))),
        storeType: data.dynamicForm ? "DYNAMIC" : "STATIC"
      },
      direction: {
        buffer: new Float32Array(segments ? segments.flatMap(() => [1, -1, 1, -1]) : flatten(times(() => [1, -1, 1, -1], points.length - 1))),
        storeType: data.dynamicForm ? "DYNAMIC" : "STATIC"
      }
    },
    itemCount: segments ? segments.length * 6 : points.length && (points.length - 1) * 6,
    elements: {
      buffer: new Uint32Array(flatten(triangulate(segments ? segments.length : points.length - 1))),
      storeType: data.dynamicForm ? "DYNAMIC" : "STATIC"
    }
  };
  if (data.colors) {
    formData.attribs.color = {
      buffer: new Float32Array(flatten(segments ? data.colors.flatMap((c) => [c, c, c, c]) : flatten(times((i) => {
        const p = data.colors[i];
        const n = data.colors[i + 1];
        return [p, p, n, n];
      }, points.length - 1)))),
      storeType: data.dynamicForm ? "DYNAMIC" : "STATIC"
    };
  } else {
    const c = [0, 0, 0, 0];
    formData.attribs.color = {
      buffer: new Float32Array(flatten(segments ? segments.flatMap(() => [c, c, c, c]) : flatten(times((i) => [c, c, c, c], points.length - 1)))),
      storeType: data.dynamicForm ? "DYNAMIC" : "STATIC"
    };
  }
  return formData;
}
export function createLines2DSketch(Q, id, linesData) {
  const sketch = Q.getSketch(id);
  let points;
  if (linesData.withPoints) {
    points = createPoints2DSketch(Q, id + "_edge_points", {});
  }
  const update = (newData = {}) => {
    const data = {
      points: [],
      ...linesData,
      ...newData
    };
    const shade = Q.getShade(id).update({
      frag: data.frag || lineFrag,
      vert: line2DVert
    });
    const form = Q.getForm(id).update(createLinesForm(data));
    sketch.update({
      form,
      shade,
      uniforms: {
        uLineWidth: (data.lineWidth || 1) * Q.state.device.sizeMultiplier,
        uSize: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
        uColor: data.color || [0, 0, 0, 0]
      },
      drawSettings: data.drawSettings
    });
    if (data.withPoints) {
      points.update({
        drawSettings: data.drawSettings && {
          ...data.drawSettings,
          clearBits: void 0,
          clearColor: void 0
        },
        pointSize: data.lineWidth,
        positions: data.segments ? data.segments.flatMap(([p1, p2]) => [p1, p2]) : data.points,
        color: data.color,
        colors: data.colors && data.segments ? data.colors.flatMap((c) => [c, c]) : data.colors,
        dynamicForm: data.dynamicForm
      });
    }
  };
  if ((linesData.points?.length || 0) >= 2 || linesData.segments?.length) {
    update();
  }
  return {sketch, update, pointsSketch: points?.sketch};
}
export function createLines3DSketch(Q, id, linesData) {
  const sketch = Q.getSketch(id);
  let points;
  if (linesData.withPoints) {
    points = createPoints3DSketch(Q, id + "_edge_points", {});
  }
  const update = (newData = {}) => {
    const data = {
      points: [],
      ...linesData,
      ...newData
    };
    const shade = Q.getShade(id).update({
      frag: data.frag || lineFrag,
      vert: line3DVert
    });
    const form = Q.getForm(id).update(createLinesForm(data));
    sketch.update({
      form,
      shade,
      uniforms: {
        uLineWidth: data.lineWidth || 1,
        uSize: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
        uColor: data.color || [0, 0, 0, 0],
        uViewMat: data.viewMat,
        uProjectionMat: data.projectionMat,
        uUseProjection: data.scalePerspective || false
      },
      drawSettings: data.drawSettings
    });
    if (data.withPoints) {
      points.update({
        drawSettings: data.drawSettings && {
          ...data.drawSettings,
          clearBits: void 0,
          clearColor: void 0
        },
        pointSize: data.lineWidth,
        positions: data.segments ? data.segments.flatMap(([p1, p2]) => [p1, p2]) : data.points,
        color: data.color,
        colors: data.colors && data.segments ? data.colors.flatMap((c) => [c, c]) : data.colors,
        dynamicForm: data.dynamicForm,
        projectionMat: data.projectionMat,
        scalePerspective: data.scalePerspective,
        viewMat: data.viewMat
      });
    }
  };
  if ((linesData.points?.length || 0) >= 2 || linesData.segments?.length) {
    update();
  }
  return {sketch, update, pointsSketch: points?.sketch};
}
