import { randInt, randIntInRange } from '../math/random.js';
export function pickRandom(arr) {
    return arr[randInt(arr.length)];
}
export function doTimes(fn, count) {
    for (let i = 0; i < count; i++) {
        fn(i);
    }
}
export function times(fn, count, res = []) {
    for (let i = 0; i < count; i++) {
        res[i] = fn(i);
    }
    return res;
}
export function repeat(count, item) {
    return times(() => item, count);
}
export function concat(arr, ...arrs) {
    return arr.concat(...arrs);
}
export function zip(fn, as, bs, res = []) {
    const length = Math.min(as.length, bs.length);
    for (let i = 0; i < length; i++) {
        res[i] = fn(as[i], bs[i]);
    }
    return res;
}
export function flatten(array, res = []) {
    for (const subarray of array) {
        const currentLength = res.length;
        for (let i = 0; i < subarray.length; i++) {
            res[i + currentLength] = subarray[i];
        }
    }
    return res;
}
export function mapcat(fn, array, res = []) {
    return flatten(map(fn, array, res));
}
export const flatMap = mapcat;
export function reverse(arr, res = []) {
    for (let i = 0; i < arr.length; i++) {
        res[i] = arr[arr.length - 1 - i];
    }
    return res;
}
export function shuffle(arr, res = []) {
    for (let i = 0; i < arr.length; i++) {
        const j = randIntInRange(i, arr.length);
        const temp = res[i] !== undefined ? res[i] : arr[i];
        res[i] = res[j] !== undefined ? res[j] : arr[j];
        res[j] = temp;
    }
    return res;
}
export function map(fn, coll, res = []) {
    for (let i = 0; i < coll.length; i++) {
        res[i] = fn(coll[i], i);
    }
    return res;
}
export function each(fn, coll) {
    for (const key in coll) {
        fn(coll[key], key);
    }
}
export function reduce(fn, start, arr) {
    for (let i = 0; i < arr.length; i++) {
        start = fn(start, arr[i]);
    }
    return start;
}
export function fold(fn, arr) {
    const [start, ...rest] = arr;
    return reduce(fn, start, rest);
}
export const last = (arr) => arr[arr.length - 1];
export function window(n, arr) {
    return arr.slice(n - 1).map((_, i) => times(j => arr[i + j], n));
}
export function range(first, last, step = 1) {
    const arr = [];
    for (let j = first; j <= last; j += step) {
        arr.push(j);
    }
    return arr;
}
//# sourceMappingURL=sequence.js.map