import { partial } from '../fp/core.js';
import { lerp } from '../math/core.js';
import { add, cross, cross2D, normalize, sub } from '../math/vectors.js';
import { zip } from '../utils/sequence.js';
export function interpolate(fn, step, start, end) {
    return zip(partial(fn, step), start, end);
}
export const lerpVecs = partial(interpolate, lerp);
export function split(part, [v1, v2]) {
    const p = lerpVecs(part, v1, v2);
    return [
        [v1, p],
        [p, v2],
    ];
}
export function translate(vec, p) {
    return p.map(v => add(vec, v));
}
export function rotateLeftInPlace(p) {
    p.unshift(p.pop());
    return p;
}
export function rotateRightInPlace(p) {
    p.push(p.shift());
    return p;
}
export function rotateLeft(p) {
    return rotateLeftInPlace(p.concat());
}
export function rotateRight(p) {
    return rotateRightInPlace(p.concat());
}
/**
 * Unit normal on a clockwise polygon.
 */
export function normal(p) {
    return normalize(cross(sub(p[0], p[1]), sub(p[2], p[1])));
}
/**
 * Returns a positive number if v is right of e,
 * a negative number, iv v ist left of e, and 0, if v is colinear to e.
 * @param e Edge
 * @param v Point
 */
export function side(e, v) {
    return cross2D(sub(v, e[0]), sub(e[1], e[0]));
}
//# sourceMappingURL=primitives.js.map