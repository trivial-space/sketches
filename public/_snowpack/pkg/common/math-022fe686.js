import { g as defError, a as illegalArgs, b as isVec, h as isMat, j as isTerm, k as gensym, s as sym, l as isString, m as isNumber, f as float, n as numberWithMatchingType } from './item-79854ead.js';

var process = {};

/**
 * Internal use only. **Do NOT use in user land code!**
 *
 * @internal
 */
const SEMAPHORE = Symbol();
/**
 * No-effect placeholder function.
 */
const NO_OP = () => { };

/**
 * Takes a `test` result or predicate function without args and throws
 * error with given `msg` if test failed (i.e. is falsy).
 *
 * @remarks
 * The function is only enabled if `"production" != "production"`
 * or if the `UMBRELLA_ASSERTS` env var is set to 1.
 */
const assert = (() => {
    try {
        return ("production" !== "production" ||
            process.env.UMBRELLA_ASSERTS === "1");
    }
    catch (e) { }
    return false;
})()
    ? (test, msg = "assertion failed") => {
        if ((typeof test === "function" && !test()) || !test) {
            throw new Error(typeof msg === "function" ? msg() : msg);
        }
    }
    : NO_OP;

/**
 * Class behavior mixin based on:
 * {@link http://raganwald.com/2015/06/26/decorators-in-es7.html}
 *
 * Additionally only injects/overwrites properties in target, which are
 * NOT marked with `@nomixin` (i.e. haven't set their `configurable`
 * property descriptor flag to `false`)
 *
 * @param behaviour - to mixin
 * @param sharedBehaviour -
 * @returns decorator function
 */
const mixin = (behaviour, sharedBehaviour = {}) => {
    const instanceKeys = Reflect.ownKeys(behaviour);
    const sharedKeys = Reflect.ownKeys(sharedBehaviour);
    const typeTag = Symbol("isa");
    function _mixin(clazz) {
        for (let key of instanceKeys) {
            const existing = Object.getOwnPropertyDescriptor(clazz.prototype, key);
            if (!existing || existing.configurable) {
                Object.defineProperty(clazz.prototype, key, {
                    value: behaviour[key],
                    writable: true,
                });
            }
            else {
                console.log(`not patching: ${clazz.name}.${key.toString()}`);
            }
        }
        Object.defineProperty(clazz.prototype, typeTag, { value: true });
        return clazz;
    }
    for (let key of sharedKeys) {
        Object.defineProperty(_mixin, key, {
            value: sharedBehaviour[key],
            enumerable: sharedBehaviour.propertyIsEnumerable(key),
        });
    }
    Object.defineProperty(_mixin, Symbol.hasInstance, {
        value: (x) => !!x[typeTag],
    });
    return _mixin;
};

const assign = (l, r) => {
    assert(l.tag !== "swizzle" || l.val.tag === "sym", "can't assign to non-symbol swizzle");
    return {
        tag: "assign",
        type: l.type,
        l,
        r,
    };
};

const implementsFunction = (x, fn) => x != null && typeof x[fn] === "function";

const isArray = Array.isArray;

const isArrayLike = (x) => x != null && typeof x !== "function" && x.length !== undefined;

const isIterable = (x) => x != null && typeof x[Symbol.iterator] === "function";

const isMap = (x) => x instanceof Map;

const isNode = () => typeof process === "object" &&
    typeof process.versions === "object" &&
    typeof process.versions.node !== "undefined";

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

const OBJP = Object.getPrototypeOf({});
const FN = "function";
const STR = "string";
const equiv = (a, b) => {
    let proto;
    if (a === b) {
        return true;
    }
    if (a != null) {
        if (typeof a.equiv === FN) {
            return a.equiv(b);
        }
    }
    else {
        return a == b;
    }
    if (b != null) {
        if (typeof b.equiv === FN) {
            return b.equiv(a);
        }
    }
    else {
        return a == b;
    }
    if (typeof a === STR || typeof b === STR) {
        return false;
    }
    if (((proto = Object.getPrototypeOf(a)), proto == null || proto === OBJP) &&
        ((proto = Object.getPrototypeOf(b)), proto == null || proto === OBJP)) {
        return equivObject(a, b);
    }
    if (typeof a !== FN &&
        a.length !== undefined &&
        typeof b !== FN &&
        b.length !== undefined) {
        return equivArrayLike(a, b);
    }
    if (a instanceof Set && b instanceof Set) {
        return equivSet(a, b);
    }
    if (a instanceof Map && b instanceof Map) {
        return equivMap(a, b);
    }
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    if (a instanceof RegExp && b instanceof RegExp) {
        return a.toString() === b.toString();
    }
    // NaN
    return a !== a && b !== b;
};
const equivArrayLike = (a, b, _equiv = equiv) => {
    let l = a.length;
    if (l === b.length) {
        while (--l >= 0 && _equiv(a[l], b[l]))
            ;
    }
    return l < 0;
};
const equivSet = (a, b, _equiv = equiv) => a.size === b.size && _equiv([...a.keys()].sort(), [...b.keys()].sort());
const equivMap = (a, b, _equiv = equiv) => a.size === b.size && _equiv([...a].sort(), [...b].sort());
const equivObject = (a, b, _equiv = equiv) => {
    if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }
    for (let k in a) {
        if (!b.hasOwnProperty(k) || !_equiv(a[k], b[k])) {
            return false;
        }
    }
    return true;
};

const IllegalArityError = defError(() => "illegal arity");
const illegalArity = (n) => {
    throw new IllegalArityError(n);
};

/**
 * Similar to `Array.findIndex()`, but uses {@link @thi.ng/equiv#equiv}
 * as default predicate.
 *
 * @param buf - array
 * @param x - search value
 * @param equiv - equivalence predicate
 */
const findIndex = (buf, x, equiv$1 = equiv) => {
    for (let i = buf.length; --i >= 0;) {
        if (equiv$1(x, buf[i]))
            return i;
    }
    return -1;
};

function dissoc(coll, keys) {
    for (let k of keys) {
        coll.delete(k);
    }
    return coll;
}

const equivMap$1 = (a, b) => {
    if (a === b) {
        return true;
    }
    if (!(b instanceof Map) || a.size !== b.size) {
        return false;
    }
    for (let p of a.entries()) {
        if (!equiv(b.get(p[0]), p[1])) {
            return false;
        }
    }
    return true;
};
const equivSet$1 = (a, b) => {
    if (a === b) {
        return true;
    }
    if (!(b instanceof Set) || a.size !== b.size) {
        return false;
    }
    for (let k of a.keys()) {
        if (!b.has(k)) {
            return false;
        }
    }
    return true;
};

const ensureTransducer = (x) => implementsFunction(x, "xform") ? x.xform() : x;

class Reduced {
    constructor(val) {
        this.value = val;
    }
    deref() {
        return this.value;
    }
}
const isReduced = (x) => x instanceof Reduced;
const unreduced = (x) => (x instanceof Reduced ? x.deref() : x);

const parseArgs = (args) => args.length === 2
    ? [undefined, args[1]]
    : args.length === 3
        ? [args[1], args[2]]
        : illegalArity(args.length);
function reduce(...args) {
    const rfn = args[0];
    const init = rfn[0];
    const complete = rfn[1];
    const reduce = rfn[2];
    args = parseArgs(args);
    const acc = args[0] == null ? init() : args[0];
    const xs = args[1];
    return unreduced(complete(implementsFunction(xs, "$reduce")
        ? xs.$reduce(reduce, acc)
        : isArrayLike(xs)
            ? reduceArray(reduce, acc, xs)
            : reduceIterable(reduce, acc, xs)));
}
const reduceArray = (rfn, acc, xs) => {
    for (let i = 0, n = xs.length; i < n; i++) {
        acc = rfn(acc, xs[i]);
        if (isReduced(acc)) {
            acc = acc.deref();
            break;
        }
    }
    return acc;
};
const reduceIterable = (rfn, acc, xs) => {
    for (let x of xs) {
        acc = rfn(acc, x);
        if (isReduced(acc)) {
            acc = acc.deref();
            break;
        }
    }
    return acc;
};
/**
 * Convenience helper for building a full {@link Reducer} using the identity
 * function (i.e. `(x) => x`) as completion step (true for 90% of all
 * bundled transducers).
 *
 * @param init - init step of reducer
 * @param rfn - reduction step of reducer
 */
const reducer = (init, rfn) => [init, (acc) => acc, rfn];

/**
 * Optimized version of {@link iterator} for transducers which are
 * guaranteed to:
 *
 * 1) Only produce none or a single result per input
 * 2) Do not require a `completion` reduction step
 *
 * @param xform -
 * @param xs -
 */
function* iterator1(xform, xs) {
    const reduce = (ensureTransducer(xform)([NO_OP, NO_OP, (_, x) => x]))[2];
    for (let x of xs) {
        let y = reduce(SEMAPHORE, x);
        if (isReduced(y)) {
            y = unreduced(y.deref());
            if (y !== SEMAPHORE) {
                yield y;
            }
            return;
        }
        if (y !== SEMAPHORE) {
            yield y;
        }
    }
}

/**
 * Reducer composition helper, internally used by various transducers
 * during initialization. Takes existing reducer `rfn` (a 3-tuple) and a
 * reducing function `fn`. Returns a new reducer tuple.
 *
 * @remarks
 * `rfn[2]` reduces values of type `B` into an accumulator of type `A`.
 * `fn` accepts values of type `C` and produces interim results of type
 * `B`, which are then (possibly) passed to the "inner" `rfn[2]`
 * function. Therefore the resulting reducer takes inputs of `C` and an
 * accumulator of type `A`.
 *
 * It is assumed that `fn` internally calls `rfn[2]` to pass its own
 * results for further processing by the nested reducer `rfn`.
 *
 * @example
 * ```ts
 * compR(rfn, fn)
 * // [rfn[0], rfn[1], fn]
 * ```
 *
 * @param rfn -
 * @param fn -
 */
const compR = (rfn, fn) => [rfn[0], rfn[1], fn];

function map(fn, src) {
    return isIterable(src)
        ? iterator1(map(fn), src)
        : (rfn) => {
            const r = rfn[2];
            return compR(rfn, (acc, x) => r(acc, fn(x)));
        };
}

function filter(pred, src) {
    return isIterable(src)
        ? iterator1(filter(pred), src)
        : (rfn) => {
            const r = rfn[2];
            return compR(rfn, (acc, x) => (pred(x) ? r(acc, x) : acc));
        };
}

const inspect = isNode() ? require("util").inspect : null;
const inspectSet = (coll, opts) => [...map((x) => inspect(x, opts), coll)].join(", ");
const inspectMap = (coll, opts) => [
    ...map(([k, v]) => `${inspect(k, opts)} => ${inspect(v, opts)}`, coll),
].join(", ");
/**
 * NodeJS inspection mixin
 *
 * @remarks
 * Reference:
 * https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects
 *
 * @internal
 */
const inspectable = mixin({
    [Symbol.for("nodejs.util.inspect.custom")](depth, opts) {
        const name = this[Symbol.toStringTag];
        const childOpts = Object.assign(Object.assign({}, opts), { depth: opts.depth === null ? null : opts.depth - 1 });
        return depth >= 0
            ? [
                `${name}(${this.size || 0}) {`,
                inspect
                    ? this instanceof Set
                        ? inspectSet(this, childOpts)
                        : this instanceof Map
                            ? inspectMap(this, childOpts)
                            : ""
                    : "",
                "}",
            ].join(" ")
            : opts.stylize(`[${name}]`, "special");
    },
});

function into(dest, src) {
    if (isMap(dest)) {
        for (let x of src) {
            dest.set(x[0], x[1]);
        }
    }
    else {
        for (let x of src) {
            dest.add(x);
        }
    }
    return dest;
}

var ArraySet_1;
const __private = new WeakMap();
const __vals = (inst) => __private.get(inst).vals;
/**
 * An alternative set implementation to the native ES6 Set type. Uses
 * customizable equality/equivalence predicate and so is more useful
 * when dealing with structured data. Implements full API of native Set
 * and by the default uses {@link @thi.ng/equiv#equiv} for equivalence
 * checking.
 *
 * Additionally, the type also implements the {@link @thi.ng/api#ICopy},
 * {@link @thi.ng/api#IEmpty} and {@link @thi.ng/api#IEquiv} interfaces
 * itself.
 */
let ArraySet = ArraySet_1 = class ArraySet extends Set {
    constructor(vals, opts = {}) {
        super();
        __private.set(this, { equiv: opts.equiv || equiv, vals: [] });
        vals && this.into(vals);
    }
    *[Symbol.iterator]() {
        yield* __vals(this);
    }
    get [Symbol.species]() {
        return ArraySet_1;
    }
    get [Symbol.toStringTag]() {
        return "ArraySet";
    }
    get size() {
        return __vals(this).length;
    }
    copy() {
        const { equiv, vals } = __private.get(this);
        const s = new ArraySet_1(null, { equiv });
        __private.get(s).vals = vals.slice();
        return s;
    }
    empty() {
        return new ArraySet_1(null, this.opts());
    }
    clear() {
        __vals(this).length = 0;
    }
    first() {
        if (this.size) {
            return __vals(this)[0];
        }
    }
    add(key) {
        !this.has(key) && __vals(this).push(key);
        return this;
    }
    into(keys) {
        return into(this, keys);
    }
    has(key) {
        return this.get(key, SEMAPHORE) !== SEMAPHORE;
    }
    /**
     * Returns the canonical value for `x`, if present. If the set
     * contains no equivalent for `x`, returns `notFound`.
     *
     * @param key - search key
     * @param notFound - default value
     */
    get(key, notFound) {
        const { equiv, vals } = __private.get(this);
        const i = findIndex(vals, key, equiv);
        return i >= 0 ? vals[i] : notFound;
    }
    delete(key) {
        const { equiv, vals } = __private.get(this);
        for (let i = vals.length; --i >= 0;) {
            if (equiv(vals[i], key)) {
                vals.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    disj(keys) {
        return dissoc(this, keys);
    }
    equiv(o) {
        return equivSet$1(this, o);
    }
    /**
     * The value args given to the callback `fn` MUST be treated as
     * readonly/immutable. This could be enforced via TS, but would
     * break ES6 Set interface contract.
     *
     * @param fn
     * @param thisArg
     */
    forEach(fn, thisArg) {
        const vals = __vals(this);
        for (let i = vals.length; --i >= 0;) {
            const v = vals[i];
            fn.call(thisArg, v, v, this);
        }
    }
    *entries() {
        for (let v of __vals(this)) {
            yield [v, v];
        }
    }
    *keys() {
        yield* __vals(this);
    }
    *values() {
        yield* __vals(this);
    }
    opts() {
        return { equiv: __private.get(this).equiv };
    }
};
ArraySet = ArraySet_1 = __decorate([
    inspectable
], ArraySet);

const copy = (x, ctor) => implementsFunction(x, "copy")
    ? x.copy()
    : new (x[Symbol.species] || ctor)(x);

var EquivMap_1;
const __private$1 = new WeakMap();
const __map = (map) => __private$1.get(map).map;
let EquivMap = EquivMap_1 = class EquivMap extends Map {
    /**
     * Creates a new instance with optional initial key-value pairs and
     * provided options. If no `opts` are given, uses `ArraySet` for
     * storing canonical keys and {@link @thi.ng/equiv#equiv} for
     * checking key equivalence.
     *
     * @param pairs - key-value pairs
     * @param opts - config options
     */
    constructor(pairs, opts) {
        super();
        const _opts = Object.assign({ equiv, keys: ArraySet }, opts);
        __private$1.set(this, {
            keys: new _opts.keys(null, { equiv: _opts.equiv }),
            map: new Map(),
            opts: _opts,
        });
        if (pairs) {
            this.into(pairs);
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    get [Symbol.species]() {
        return EquivMap_1;
    }
    get [Symbol.toStringTag]() {
        return "EquivMap";
    }
    get size() {
        return __private$1.get(this).keys.size;
    }
    clear() {
        const { keys, map } = __private$1.get(this);
        keys.clear();
        map.clear();
    }
    empty() {
        return new EquivMap_1(null, __private$1.get(this).opts);
    }
    copy() {
        const { keys, map, opts } = __private$1.get(this);
        const m = new EquivMap_1();
        __private$1.set(m, {
            keys: keys.copy(),
            map: new Map(map),
            opts,
        });
        return m;
    }
    equiv(o) {
        return equivMap$1(this, o);
    }
    delete(key) {
        const { keys, map } = __private$1.get(this);
        key = keys.get(key, SEMAPHORE);
        if (key !== SEMAPHORE) {
            map.delete(key);
            keys.delete(key);
            return true;
        }
        return false;
    }
    dissoc(keys) {
        return dissoc(this, keys);
    }
    /**
     * The key & value args given the callback `fn` MUST be treated as
     * readonly/immutable. This could be enforced via TS, but would
     * break ES6 Map interface contract.
     *
     * @param fn
     * @param thisArg
     */
    forEach(fn, thisArg) {
        for (let pair of __map(this)) {
            fn.call(thisArg, pair[1], pair[0], this);
        }
    }
    get(key, notFound) {
        const { keys, map } = __private$1.get(this);
        key = keys.get(key, SEMAPHORE);
        if (key !== SEMAPHORE) {
            return map.get(key);
        }
        return notFound;
    }
    has(key) {
        return __private$1.get(this).keys.has(key);
    }
    set(key, value) {
        const { keys, map } = __private$1.get(this);
        const k = keys.get(key, SEMAPHORE);
        if (k !== SEMAPHORE) {
            map.set(k, value);
        }
        else {
            keys.add(key);
            map.set(key, value);
        }
        return this;
    }
    into(pairs) {
        return into(this, pairs);
    }
    entries() {
        return __map(this).entries();
    }
    keys() {
        return __map(this).keys();
    }
    values() {
        return __map(this).values();
    }
    opts() {
        return __private$1.get(this).opts;
    }
};
EquivMap = EquivMap_1 = __decorate([
    inspectable
], EquivMap);

/**
 * Computes union of sets `a` and `b` and writes results to new set or
 * optionally given set `out` (assumed to be empty for correct results).
 *
 * @param a - first set
 * @param b - other set
 * @param out - result set
 */
const union = (a, b, out) => {
    if (a.size < b.size) {
        const t = a;
        a = b;
        b = t;
    }
    out = out ? into(out, a) : copy(a, Set);
    return a === b ? out : into(out, b);
};

class DGraph {
    constructor(edges) {
        this.dependencies = new EquivMap();
        this.dependents = new EquivMap();
        if (edges) {
            for (let [a, b] of edges) {
                b != null ? this.addDependency(a, b) : this.addNode(a);
            }
        }
    }
    *[Symbol.iterator]() {
        yield* this.sort();
    }
    get [Symbol.species]() {
        return DGraph;
    }
    copy() {
        const g = new DGraph();
        for (let e of this.dependencies) {
            g.dependencies.set(e[0], e[1].copy());
        }
        for (let e of this.dependents) {
            g.dependents.set(e[0], e[1].copy());
        }
        return g;
    }
    addNode(node) {
        !this.dependencies.has(node) &&
            this.dependencies.set(node, new ArraySet());
        return this;
    }
    addDependency(node, dep) {
        if (equiv(node, dep) || this.depends(dep, node)) {
            illegalArgs(`Circular dependency between: ${node} & ${dep}`);
        }
        let deps = this.dependencies.get(node);
        this.dependencies.set(node, deps ? deps.add(dep) : new ArraySet([dep]));
        deps = this.dependents.get(dep);
        this.dependents.set(dep, deps ? deps.add(node) : new ArraySet([node]));
        return this;
    }
    addDependencies(node, deps) {
        for (let d of deps) {
            this.addDependency(node, d);
        }
    }
    removeEdge(node, dep) {
        let deps = this.dependencies.get(node);
        if (deps) {
            deps.delete(dep);
        }
        deps = this.dependents.get(dep);
        if (deps) {
            deps.delete(node);
        }
        return this;
    }
    removeNode(x) {
        this.dependencies.delete(x);
        return this;
    }
    depends(x, y) {
        return this.transitiveDependencies(x).has(y);
    }
    dependent(x, y) {
        return this.transitiveDependents(x).has(y);
    }
    immediateDependencies(x) {
        return this.dependencies.get(x) || new ArraySet();
    }
    immediateDependents(x) {
        return this.dependents.get(x) || new ArraySet();
    }
    isLeaf(x) {
        return this.immediateDependents(x).size === 0;
    }
    isRoot(x) {
        return this.immediateDependencies(x).size === 0;
    }
    nodes() {
        return union(new ArraySet(this.dependencies.keys()), new ArraySet(this.dependents.keys()));
    }
    leaves() {
        return filter((node) => this.isLeaf(node), this.nodes());
    }
    roots() {
        return filter((node) => this.isRoot(node), this.nodes());
    }
    transitiveDependencies(x) {
        return transitive(this.dependencies, x);
    }
    transitiveDependents(x) {
        return transitive(this.dependents, x);
    }
    sort() {
        const sorted = [];
        const g = this.copy();
        let queue = new ArraySet(g.leaves());
        while (true) {
            if (!queue.size) {
                return sorted.reverse();
            }
            const node = queue.first();
            queue.delete(node);
            for (let d of [...g.immediateDependencies(node)]) {
                g.removeEdge(node, d);
                if (g.isLeaf(d)) {
                    queue.add(d);
                }
            }
            sorted.push(node);
            g.removeNode(node);
        }
    }
}
const transitive = (nodes, x) => {
    const deps = nodes.get(x);
    if (deps) {
        return reduce(reducer(null, (acc, k) => union(acc, transitive(nodes, k))), deps, deps);
    }
    return new ArraySet();
};

/**
 * Helper function for {@link walk}. Returns child nodes for any control
 * flow nodes containing a child scope.
 *
 * {@link allChildren}
 */
const scopedChildren = (t) => t.tag === "fn" || t.tag === "for" || t.tag == "while"
    ? t.scope.body
    : t.tag === "if"
        ? t.f
            ? t.t.body.concat(t.f.body)
            : t.t.body
        : undefined;
/**
 * Helper function for {@link walk}. Returns an array of all child nodes for
 * a given term (if any).
 *
 * {@link scopedChildren}
 */
const allChildren = (t) => scopedChildren(t) ||
    (t.tag === "scope"
        ? t.body
        : t.tag === "ternary"
            ? [t.t, t.f]
            : t.tag === "ret"
                ? [t.val]
                : t.tag === "call" || t.tag === "call_i"
                    ? t.args
                    : t.tag === "sym" && t.init
                        ? [t.init]
                        : t.tag === "decl"
                            ? [t.id]
                            : t.tag === "op1" || t.tag === "swizzle"
                                ? [t.val]
                                : t.tag === "op2"
                                    ? [t.l, t.r]
                                    : t.tag === "assign"
                                        ? [t.r]
                                        : isVec(t) || isMat(t)
                                            ? t.val
                                            : isTerm(t.val)
                                                ? t.val
                                                : undefined);
/**
 * Traverses given AST in depth-first order and applies `visit` and
 * `children` fns to each node. Descends only further if `children`
 * returns an array of child nodes. The `visit` function must accept 2
 * args: the accumulator (`acc`) given to {@link walk} and a tree node. The
 * return value of `visit` becomes the new `acc` value, much like in a
 * reduce operation. {@link walk} itself returns the final `acc`.
 *
 * If `pre` is true (default), the `visit` function will be called prior
 * to visiting a node's children. If false, the visitor is called on the
 * way back up.
 *
 * @param visit -
 * @param children -
 * @param acc -
 * @param tree -
 * @param pre -
 */
const walk = (visit, children, acc, tree, pre = true) => {
    if (isArray(tree)) {
        tree.forEach((x) => (acc = walk(visit, children, acc, x, pre)));
    }
    else {
        pre && (acc = visit(acc, tree));
        const c = children(tree);
        c && (acc = walk(visit, children, acc, c, pre));
        !pre && (acc = visit(acc, tree));
    }
    return acc;
};
/**
 * Builds dependency graph of given function, by recursively adding all
 * function dependencies. Returns graph.
 *
 * @param fn -
 * @param graph -
 */
const buildCallGraph = (fn, graph = new DGraph()) => fn.deps && fn.deps.length
    ? fn.deps.reduce((graph, d) => buildCallGraph(d, graph.addDependency(fn, d)), graph)
    : graph.addNode(fn);
const decl = (id) => ({
    tag: "decl",
    type: id.type,
    id,
});
/**
 * Wraps the given AST node array in `scope` node, optionally as global
 * scope (default false). The interpretation of the global flag is
 * dependent on the target code gen. I.e. for GLSL / JS, the flag
 * disables wrapping the scope's body in `{}`, but else has no
 * difference. In general this node type only serves as internal
 * mechanism for various control flow AST nodes and should not need to
 * be used directly from user land code (though might be useful to
 * create custom / higher level control flow nodes).
 *
 * @param body -
 * @param global -
 */
const scope = (body, global = false) => ({
    tag: "scope",
    type: "void",
    body: (body
        .filter((x) => x != null)
        .map((x) => (x.tag === "sym" ? decl(x) : x))),
    global,
});
/**
 * Takes an array of global sym/var definitions ({@link input},
 * {@link output}, {@link uniform}) and functions defined via
 * {@link (defn:1)}. Constructs the call graph of all transitively used
 * functions and bundles everything in topological order within a global
 * scope object, which is then returned to the user and can be passed to
 * a target codegen for full program output.
 *
 * - {@link scope}
 * - {@link input}
 * - {@link output}
 * - {@link uniform}
 *
 * @param body -
 */
const program = (body) => {
    const syms = body.filter((x) => x.tag !== "fn");
    const g = body.reduce((acc, x) => (x.tag === "fn" ? buildCallGraph(x, acc) : acc), new DGraph());
    return scope(syms.concat(g.sort()), true);
};

const ifThen = (test, truthy, falsey) => ({
    tag: "if",
    type: "void",
    test,
    t: scope(truthy),
    f: falsey ? scope(falsey) : undefined,
});
const ternary = (test, t, f) => ({
    tag: "ternary",
    type: t.type,
    test,
    t,
    f,
});
function forLoop(...xs) {
    const [init, test, iter, body] = xs.length === 2
        ? [, xs[0], , xs[1]]
        : xs.length === 3
            ? [xs[0], xs[1], , xs[2]]
            : xs;
    return {
        tag: "for",
        type: "void",
        init: init ? decl(init) : undefined,
        test: test(init),
        iter: iter ? iter(init) : undefined,
        scope: scope(body(init)),
    };
}
const ctrl = (id) => ({
    tag: "ctrl",
    type: "void",
    id,
});
const discard = ctrl("discard");

const defArg = (a) => {
    const [type, id, opts] = isString(a) ? [a] : a;
    return {
        tag: "arg",
        type,
        id: id || gensym(),
        opts: Object.assign({ q: "in" }, opts),
    };
};
// prettier-ignore
function defn(type, id, _args, _body) {
    id = id || gensym();
    const args = _args.map(defArg);
    const body = (_body(...args.map((x) => sym(x.type, x.id, x.opts))).filter((x) => x != null));
    // count & check returns
    const returns = walk((n, t) => {
        if (t.tag === "ret") {
            assert(t.type === type, `wrong return type for function '${id}', expected ${type}, got ${t.type}`);
            n++;
        }
        return n;
    }, scopedChildren, 0, body);
    if (type !== "void" && !returns) {
        throw new Error(`function '${id}' must return a value of type ${type}`);
    }
    // verify all non-builtin functions called are also
    // provided as deps to ensure complete call graph later
    const deps = walk((acc, t) => {
        if (t.tag === "call" && t.fn) {
            acc.push(t.fn);
        }
        return acc;
    }, allChildren, [], body);
    const $ = (...xs) => funcall($, ...xs);
    return Object.assign($, {
        tag: "fn",
        type,
        id,
        args,
        deps,
        scope: scope(body)
    });
}
/**
 * Syntax sugar for defining `void main()` functions.
 *
 * @param body -
 */
const defMain = (body) => defn("void", "main", [], body);
function ret(val) {
    return {
        tag: "ret",
        type: val ? val.type : "void",
        val,
    };
}
// prettier-ignore
function funcall(fn, ...args) {
    return isString(fn)
        ? {
            tag: "call",
            type: args[0],
            id: fn,
            args: args.slice(1)
        }
        : {
            tag: "call",
            type: fn.type,
            id: fn.id,
            args,
            fn
        };
}
const builtinCall = (id, type, ...args) => ({
    tag: "call_i",
    type,
    id,
    args,
});

const op1 = (op, val, post = false) => ({
    tag: "op1",
    type: val.type,
    op,
    val,
    post,
});
const OP_INFO = {
    mave: "mv",
    vema: "vm",
    vefl: "vn",
    mafl: "vn",
    flve: "nv",
    flma: "nv",
    ivin: "vn",
    iniv: "nv",
    uvui: "vn",
    uiuv: "nv",
};
const op2 = (op, _l, _r, rtype, info) => {
    const nl = isNumber(_l);
    const nr = isNumber(_r);
    let type;
    let l;
    let r;
    if (nl) {
        if (nr) {
            // (number, number)
            l = float(_l);
            r = float(_r);
            type = "float";
        }
        else {
            // (number, term)
            r = _r;
            l = numberWithMatchingType(r, _l);
            type = r.type;
        }
    }
    else if (nr) {
        // (term, number)
        l = _l;
        r = numberWithMatchingType(l, _r);
        type = l.type;
    }
    else {
        // (term, term)
        l = _l;
        r = _r;
        type =
            rtype ||
                (isVec(l)
                    ? l.type
                    : isVec(r)
                        ? r.type
                        : isMat(r)
                            ? r.type
                            : l.type);
    }
    return {
        tag: "op2",
        type: rtype || type,
        info: info || OP_INFO[l.type.substr(0, 2) + r.type.substr(0, 2)],
        op,
        l: l,
        r: r,
    };
};
const inc = (t) => op1("++", t, true);
// prettier-ignore
function add(l, r) {
    return op2("+", l, r);
}
function sub(l, r) {
    return op2("-", l, r);
}
function mul(l, r) {
    return op2("*", l, r, !isNumber(l) && !isNumber(r) && isMat(l) && isVec(r)
        ? r.type
        : undefined);
}
function div(l, r) {
    return op2("/", l, r);
}
// prettier-ignore
function madd(a, b, c) {
    return add(mul(a, b), c);
}
const cmp = (op) => (a, b) => op2(op, a, b, "bool");
const eq = cmp("==");
const neq = cmp("!=");
const lte = cmp("<=");
const gt = cmp(">");

function $(val, id) {
    const type = val.type[0];
    const rtype = (a, b) => id.length === 1 ? a : (b + id.length);
    return {
        tag: "swizzle",
        type: type === "i"
            ? rtype("int", "ivec")
            : type === "u"
                ? rtype("uint", "uvec")
                : type === "b"
                    ? rtype("bool", "bvec")
                    : rtype("float", "vec"),
        val,
        id,
    };
}
const $x = (val) => $(val, "x");
const $y = (val) => $(val, "y");
const $z = (val) => $(val, "z");
const $w = (val) => $(val, "w");
function $xy(val) {
    return $(val, "xy");
}
function $xyz(val) {
    return $(val, "xyz");
}

const primOp1 = (name) => (a) => builtinCall(name, a.type, a);
const primOp2 = (name) => (a, b) => builtinCall(name, a.type, a, b);
const primOp3 = (name) => (a, b, c) => builtinCall(name, a.type, a, b, c);
/**
 * Returns normalized version of given vector.
 *
 * @param v -
 */
const normalize = (v) => builtinCall("normalize", v.type, v);
/**
 * Returns length / magnitude of given vector.
 *
 * @param v -
 */
const length = (v) => builtinCall("length", "float", v);
/**
 * Returns dot product of given vectors.
 *
 * @param a -
 * @param b -
 */
const dot = (a, b) => builtinCall("dot", "float", a, b);
const min = primOp2("min");
const max = primOp2("max");
const smoothstep = primOp3("smoothstep");
const sin = primOp1("sin");
const pow = primOp2("pow");
const sqrt = primOp1("sqrt");
const abs = primOp1("abs");
const floor = primOp1("floor");
const fract = primOp1("fract");
function mix(a, b, c) {
    const f = builtinCall("mix", a.type, a, b, c);
    c.type === "float" && (f.info = "n");
    return f;
}

export { $y as $, defn as A, ret as B, fract as C, floor as D, max as E, neq as F, sin as G, forLoop as H, lte as I, inc as J, smoothstep as K, sqrt as L, madd as M, assign as a, builtinCall as b, $x as c, defMain as d, add as e, $w as f, $z as g, pow as h, $xyz as i, div as j, gt as k, $xy as l, mul as m, abs as n, normalize as o, program as p, mix as q, min as r, sub as s, ternary as t, discard as u, dot as v, eq as w, ifThen as x, length as y, $ as z };
