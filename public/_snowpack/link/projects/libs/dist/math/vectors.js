import { equalArray } from '../utils/predicates.js';
export function vec(v) {
    if (typeof v === 'number') {
        return new Float32Array(v);
    }
    return new Float32Array(v);
}
export function vecDouble(v) {
    if (typeof v === 'number') {
        return new Float64Array(v);
    }
    return new Float64Array(v);
}
export function add(vec1, vec2, res = []) {
    for (let i = 0; i < vec1.length; i++) {
        res[i] = vec1[i] + vec2[i];
    }
    return res;
}
export function sub(vec1, vec2, res = []) {
    for (let i = 0; i < vec1.length; i++) {
        res[i] = vec1[i] - vec2[i];
    }
    return res;
}
export function mul(scalar, vec, res = []) {
    for (let i = 0; i < vec.length; i++) {
        res[i] = vec[i] * scalar;
    }
    return res;
}
export function div(scalar, vec, res = []) {
    for (let i = 0; i < vec.length; i++) {
        res[i] = vec[i] / scalar;
    }
    return res;
}
export function length(vec) {
    let sum = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < vec.length; i++) {
        const val = vec[i];
        sum += val * val;
    }
    return Math.sqrt(sum);
}
export function normalize(vec, res = []) {
    return div(length(vec), vec, res);
}
export function limit(maxLength, vec) {
    const l = length(vec);
    if (maxLength < l) {
        return mul(maxLength / l, vec);
    }
    else {
        return vec;
    }
}
export function dot(v1, v2) {
    let d = 0;
    for (let i = 0; i < v1.length; i++) {
        d += v1[i] * v2[i];
    }
    return d;
}
export function cross(v1, v2, res = []) {
    res[0] = v1[1] * v2[2] - v1[2] * v2[1];
    res[1] = v1[2] * v2[0] - v1[0] * v2[2];
    res[2] = v1[0] * v2[1] - v1[1] * v2[0];
    return res;
}
export function cross2D(v1, v2) {
    return v1[0] * v2[1] - v1[1] * v2[0];
}
export const isEqual = equalArray;
//# sourceMappingURL=vectors.js.map