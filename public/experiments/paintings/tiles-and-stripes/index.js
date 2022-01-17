import {events, Q} from "./context.js";
import {makeBrushStroke} from "../../../_snowpack/link/src/shared-utils/sketches/brushStrokes/brushStrokes.js";
import {getNoiseTextureData} from "../../../_snowpack/link/src/shared-utils/texture-helpers.js";
import {
  lineToFormCollection
} from "../../../_snowpack/link/src/shared-utils/geometry/lines_2d.js";
import {
  brushStrokeFrag,
  brushStrokeVert
} from "../../../_snowpack/link/src/shared-utils/sketches/brushStrokes/brushStrokeLineShader.js";
import {subdivideTiles} from "./tiles.js";
import {doTimes} from "../../../_snowpack/link/projects/libs/dist/utils/sequence.js";
const lineWidth = Q.state.device.canvas.height / 32;
const shade = Q.getShade("line").update({
  frag: brushStrokeFrag,
  vert: brushStrokeVert
});
export const noiseTex = Q.getLayer("noiseTex").update({
  texture: getNoiseTextureData({
    width: 256,
    height: 256,
    startX: 3,
    startY: 3,
    data: {
      magFilter: "LINEAR",
      minFilter: "LINEAR",
      wrap: "REPEAT"
    }
  })
});
export const scene = Q.getLayer("scene").update({
  drawSettings: {
    clearBits: 0,
    enable: [Q.gl.BLEND],
    blendFuncSeparate: [
      Q.gl.SRC_ALPHA,
      Q.gl.ONE_MINUS_SRC_ALPHA,
      Q.gl.SRC_ALPHA,
      Q.gl.ONE
    ]
  }
});
Q.listen("index", events.RESIZE, () => {
  scene.update({
    uniforms: {
      noiseTex: noiseTex.image(),
      size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
      texScale: [20, 1],
      edgeSharpness: 3
    },
    sketches: [
      Q.getEffect("").update({
        frag: "precision mediump float; void main(void) {gl_FragColor = vec4(1.0);}"
      })
    ]
  });
  Q.painter.compose(scene);
  animate();
});
let tiles = [
  {
    color: [1, 1, 1],
    top: 0,
    left: 0,
    width: Q.gl.drawingBufferWidth,
    height: Q.gl.drawingBufferHeight
  }
];
doTimes(() => {
  tiles = subdivideTiles(tiles, lineWidth);
}, 7);
const animations = tiles.map((t) => {
  return createLineAnimation(makeBrushStroke({
    left: t.left - lineWidth / 3,
    top: t.top + lineWidth / 1.5,
    width: t.width + lineWidth / 3,
    height: t.height - lineWidth * 1.5,
    offsetX: lineWidth * 0.7,
    offsetY: lineWidth * 0.4,
    steps: Math.floor(t.height / (lineWidth * 1.2)),
    curveHeight: lineWidth,
    heightFactorFunction: (n) => n * 1.5 - 0.6
  }), t.color);
});
function animate() {
  for (const run of animations) {
    run();
  }
}
function createLineAnimation(line, color) {
  const data = lineToFormCollection(line, {
    lineWidth,
    storeType: "DYNAMIC",
    smouthCount: 3
  });
  function render() {
    const sketches = data.map((d, i) => Q.getForm("form" + i).update(d)).map((form, i) => Q.getSketch("line" + i).update({
      form,
      shade,
      uniforms: {color}
    }));
    scene.update({sketches});
    Q.painter.compose(scene).show(scene);
  }
  return render;
}
