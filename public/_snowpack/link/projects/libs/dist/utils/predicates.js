export const and = (p1, p2) => (a, b) => p1(a, b) && p2(a, b);
export const not = (p) => (...args) => !p(...args);
export const notEmpty = a => a && a.length;
export const unequal = (a, b) => a !== b;
export const equal = (a, b) => a === b;
export function equalArray(arr1, arr2) {
    if (arr1 === arr2) {
        return true;
    }
    if (!arr2 || !arr1) {
        return false;
    }
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}
export function equalObject(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }
    if (!obj2) {
        return false;
    }
    const k1 = Object.keys(obj1);
    const k2 = Object.keys(obj2);
    if (!equalArray(k1, k2)) {
        return false;
    }
    for (const key of k1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=predicates.js.map