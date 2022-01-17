export function deepmerge(obj1, obj2) {
    if (typeof obj1 === 'object' &&
        typeof obj2 === 'object' &&
        !Array.isArray(obj1) &&
        !Array.isArray(obj2) &&
        obj1 !== obj2) {
        const result = Object.assign({}, obj1);
        for (const key in obj2) {
            const val1 = obj1[key];
            const val2 = obj2[key];
            if (typeof val2 !== 'undefined') {
                result[key] = deepmerge(val1, val2);
            }
            else {
                delete result[key];
            }
        }
        return result;
    }
    return obj2;
}
export function deepOverride(obj1, obj2, opt) {
    const ignore = opt && opt.ignore;
    if (typeof obj1 === 'object' &&
        typeof obj2 === 'object' &&
        !Array.isArray(obj1) &&
        !Array.isArray(obj2) &&
        obj1 !== obj2) {
        for (const key in obj1) {
            if (obj1.hasOwnProperty(key) &&
                !(ignore && key in ignore && ignore[key] === true)) {
                const val1 = obj1[key];
                const val2 = obj2[key];
                if (val2 !== undefined) {
                    obj1[key] = deepOverride(val1, val2, {
                        ignore: ignore && ignore[key],
                    });
                }
            }
        }
        return obj1;
    }
    return obj2;
}
export function mapObj(fn, coll, res = {}) {
    for (const key in coll) {
        res[key] = fn(coll[key], key);
    }
    return res;
}
//# sourceMappingURL=object.js.map