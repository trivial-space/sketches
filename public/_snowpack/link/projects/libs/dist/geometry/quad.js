import { flatten, times } from '../utils/sequence.js';
import { lerpVecs, rotateLeft, translate } from './primitives.js';
export function top(q) {
    return [q[0], q[1]];
}
export function right(q) {
    return [q[1], q[2]];
}
export function bottom(q) {
    return [q[2], q[3]];
}
export function left(q) {
    return [q[3], q[0]];
}
export function combineEdges(e1, e2) {
    return e1.concat(rotateLeft(e2));
}
export function extrudeTop(direction, edge) {
    return combineEdges(translate(direction, edge), edge);
}
export function extrudeRight(direction, edge) {
    return rotateLeft(extrudeTop(direction, edge));
}
export function extrudeBottom(direction, edge) {
    return combineEdges(edge, translate(direction, edge));
}
export function extrudeLeft(direction, edge) {
    return rotateLeft(extrudeBottom(direction, edge));
}
export function divideHorizontal(leftRatio, rightRatio, [v1, v2, v3, v4]) {
    const v11 = lerpVecs(leftRatio, v1, v4);
    const v22 = lerpVecs(rightRatio, v2, v3);
    return [[v1, v2, v22, v11], [v11, v22, v3, v4]];
}
export function divideVertical(topRatio, bottomRatio, [v1, v2, v3, v4]) {
    const v11 = lerpVecs(topRatio, v1, v2);
    const v44 = lerpVecs(bottomRatio, v4, v3);
    return [[v1, v11, v44, v4], [v11, v2, v3, v44]];
}
// Triangles in WebGL go counter clockwise: https://webglfundamentals.org/webgl/lessons/webgl-3d-orthographic.html
// Make triangles conform stackGL cells specification
export const quadTriangles = [[0, 2, 1], [0, 3, 2]];
export function triangulate(quadCount) {
    return flatten(times(i => quadTriangles.map(t => t.map(j => 4 * i + j)), quadCount));
}
//# sourceMappingURL=quad.js.map