import { cross, dot, normalize, sub } from './vectors.js';
export function planeFromNormalAndCoplanarPoint(n, point) {
    const d = dot(n, point);
    return [n[0], n[1], n[2], -d];
}
export function planeFromThreeCoplanarPoints(p1, p2, p3) {
    return planeFromNormalAndCoplanarPoint(normalFromThreeCoplanarPoints(p1, p2, p3), p1);
}
export function normalFromThreeCoplanarPoints(p1, p2, p3) {
    return normalize(cross(sub(p3, p2), sub(p1, p2)));
}
/*            | 1-2Nx2   -2NxNy  -2NxNz  -2NxD |
Mreflection = |  -2NxNy 1-2Ny2   -2NyNz  -2NyD |
              |  -2NxNz  -2NyNz 1-2Nz2   -2NzD |
              |    0       0       0       1   |
http://khayyam.kaplinski.com/2011/09/reflective-water-with-glsl-part-i.html

              mat.m._00 = 1-2*a*a;	mat.m._01 = -2*a*b;	mat.m._02 = -2*a*c;	mat.m._03 = -2*a*d;
              mat.m._10 = -2*a*b; mat.m._11 = 1-2*b*b;	mat.m._12 = -2*b*c;	mat.m._13 = -2*b*d;
              mat.m._20 = -2*a*c;	mat.m._21 = -2*b*c;	mat.m._22 = 1-2*c*c;	mat.m._23 = -2*c*d;
              mat.m._30 = 0.0f;	mat.m._31 = 0.0f;	mat.m._32 = 0.0f;	mat.m._33 = 1.0f;
https://www.opengl.org/discussion_boards/showthread.php/147784-Mirror-Matrices
*/
export function mirrorMatrixFromPlane(plane) {
    const [a, b, c, d] = plane;
    // prettier-ignore
    return [
        1 - 2 * a * a, -2 * a * b, -2 * a * c, 0,
        -2 * a * b, 1 - 2 * b * b, -2 * b * c, 0,
        -2 * a * c, -2 * b * c, 1 - 2 * c * c, 0,
        -2 * a * d, -2 * b * d, -2 * c * d, 1,
    ];
}
export function getYawQuat(rotYAngle) {
    rotYAngle *= 0.5;
    return [0, Math.sin(rotYAngle), 0, Math.cos(rotYAngle)];
}
export function getPitchQuat(rotXAngle) {
    rotXAngle *= 0.5;
    return [Math.sin(rotXAngle), 0, 0, Math.cos(rotXAngle)];
}
export function getRollQuat(rotZAngle) {
    rotZAngle *= 0.5;
    return [0, 0, Math.sin(rotZAngle), Math.cos(rotZAngle)];
}
//# sourceMappingURL=geometry.js.map