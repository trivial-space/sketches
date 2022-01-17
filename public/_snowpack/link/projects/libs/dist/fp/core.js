export function curry(fn) {
    function curried(a, b) {
        if (typeof b !== 'undefined')
            return fn(a, b);
        return (b) => fn(a, b);
    }
    return curried;
}
export function partial(fn, ...args) {
    return fn.bind(null, ...args);
}
export function pipe(fn1, fn2, fn3, fn4, fn5, fn6) {
    return (...args) => {
        let res = fn2(fn1(...args));
        if (fn3) {
            res = fn3(res);
        }
        if (fn4) {
            res = fn4(res);
        }
        if (fn5) {
            res = fn5(res);
        }
        if (fn6) {
            res = fn6(res);
        }
        return res;
    };
}
//# sourceMappingURL=core.js.map