import { length } from './vectors.js';
// === polar coordinates ===
/**
 * @param radius distance from origin
 * @param angle counter clockwise
 */
export function polarCoord(radius, angle) {
    return [radius, angle];
}
export function cartesianToPolar2D(v) {
    return polarCoord(length(v), Math.atan2(v[1], v[0]));
}
export function polarToCartesian2D([r, phi]) {
    return [r * Math.cos(phi), r * Math.sin(phi)];
}
// === sphere coordinates ===
/**
 * Sphere coordinate vector.
 *
 * Angles rotate counterclockwise. Sphere coordinate [1, 0, 0] corresponds to cartesian coord [0, 0, 1].
 *
 * @param radius distance from origin
 * @param angleY polar angle, rotating around y axis, 0 - PI (0° - 180°)
 * @param angleZ azimuth angle, rotating around z axis, 0 - 2*PI (0° - 360°)
 */
export function sphereCoord(radius, angleY, angleZ) {
    return [radius, angleY, angleZ];
}
export function cartesianToSphere3D([x, y, z]) {
    const radius = Math.sqrt(x * x + y * y + z * z);
    if (radius === 0) {
        return sphereCoord(0, 0, 0);
    }
    let azimuthAngleZ = x === 0 ? (y >= 0 ? 0 : Math.PI) : Math.atan2(y, x);
    const polarAngleY = Math.acos(z / radius);
    if (azimuthAngleZ < 0)
        azimuthAngleZ += Math.PI * 2;
    return sphereCoord(radius, polarAngleY, azimuthAngleZ);
}
export function sphereToCartesian3D(vec) {
    const radius = vec[0], polar = vec[1], azimuth = vec[2];
    if (radius === 0) {
        return [0, 0, 0];
    }
    return [
        radius * Math.sin(polar) * Math.cos(azimuth),
        radius * Math.sin(polar) * Math.sin(azimuth),
        radius * Math.cos(polar),
    ];
}
//# sourceMappingURL=coords.js.map