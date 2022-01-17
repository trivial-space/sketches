export function sign(num) {
    if (num > 0) {
        return 1;
    }
    else if (num < 0) {
        return -1;
    }
    else {
        return 0;
    }
}
export function lerp(step, start, end) {
    return start + step * (end - start);
}
export function clamp(min, max, value) {
    return Math.max(min, Math.min(value, max));
}
export const DEG_TO_RAD_FACTOR = Math.PI / 180;
export function degToRad(degrees) {
    return degrees * DEG_TO_RAD_FACTOR;
}
//# sourceMappingURL=core.js.map