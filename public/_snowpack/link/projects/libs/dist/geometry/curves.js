// Bezier Curves
import { add, mul } from '../math/vectors.js';
// The formula for a 2-points curve:
// P = (1-t)*P1 + t*P2
// For 3 control points:
// P = (1−t)^2*P1 + 2(1−t)t*P2 + t^2*P3
// For 4 control points:
// P = (1−t)^3*P1 + 3(1−t)^2*t*P2 + 3(1−t)t^2*P3 + t^3*P4
export function bezierCurve2P(p1, p2, t) {
    const tmp1 = mul(1 - t, p1);
    const tmp2 = mul(t, p2);
    return add(tmp1, tmp2, tmp1);
}
export function bezierCurve3P(p1, p2, p3, t) {
    const _t = 1 - t;
    const tmp1 = mul(_t * _t, p1);
    const tmp2 = mul(2 * _t * t, p2);
    add(tmp1, tmp2, tmp1);
    mul(t * t, p3, tmp2);
    return add(tmp1, tmp2, tmp1);
}
export function bezierCurve4P(p1, p2, p3, p4, t) {
    const _t = 1 - t;
    const tmp1 = mul(_t * _t * _t, p1);
    const tmp2 = mul(3 * _t * _t * t, p2);
    add(tmp1, tmp2, tmp1);
    mul(3 * _t * t * t, p3, tmp2);
    add(tmp1, tmp2, tmp1);
    mul(t * t * t, p4, tmp2);
    return add(tmp1, tmp2, tmp1);
}
//# sourceMappingURL=curves.js.map