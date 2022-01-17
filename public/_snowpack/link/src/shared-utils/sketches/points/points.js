import {point2DVert, point3DVert, pointFrag} from "./points-shaders.js";
import {flatten} from "../../../../projects/libs/dist/utils/sequence.js";
export function createPoints2DSketch(Q, id, pointsData) {
  const update = (newData = {}) => {
    const data = {positions: [], ...pointsData, ...newData};
    const shade = Q.getShade(id).update({
      frag: data.frag || pointFrag,
      vert: point2DVert
    });
    const form = Q.getForm(id).update(createPointsForm(data));
    const sketch2 = Q.getSketch(id).update({
      form,
      shade,
      uniforms: {
        uPointSize: (data.pointSize || 1) * Q.state.device.sizeMultiplier,
        uSize: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
        uColor: data.color || [0, 0, 0, 0]
      },
      drawSettings: data.drawSettings
    });
    return sketch2;
  };
  const sketch = update();
  return {sketch, update};
}
export function createPoints3DSketch(Q, id, pointsData) {
  const update = (newData = {}) => {
    const data = {positions: [], ...pointsData, ...newData};
    const shade = Q.getShade(id).update({
      frag: data.frag || pointFrag,
      vert: point3DVert
    });
    const form = Q.getForm(id).update(createPointsForm(data));
    const sketch2 = Q.getSketch(id).update({
      form,
      shade,
      uniforms: {
        uPointSize: data.pointSize || 1,
        uSize: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
        uColor: data.color || [0, 0, 0, 0],
        uViewMat: data.viewMat,
        uProjectionMat: data.projectionMat,
        uUseProjection: data.scalePerspective || false
      },
      drawSettings: data.drawSettings
    });
    return sketch2;
  };
  const sketch = update();
  return {sketch, update};
}
function createPointsForm({positions = [], ...data}) {
  const formData = {
    drawType: "POINTS",
    attribs: {
      position: {
        buffer: new Float32Array(flatten(positions)),
        storeType: data.dynamicForm ? "DYNAMIC" : "STATIC"
      }
    },
    itemCount: positions.length
  };
  if (data.colors) {
    formData.attribs.color = {
      buffer: new Float32Array(flatten(data.colors)),
      storeType: data.dynamicForm ? "DYNAMIC" : "STATIC"
    };
  }
  return formData;
}
