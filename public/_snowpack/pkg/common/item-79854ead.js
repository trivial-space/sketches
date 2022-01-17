const isBoolean = (x) => typeof x === "boolean";

const isString = (x) => typeof x === "string";

const isNumber = (x) => typeof x === "number";

const OBJP = Object.getPrototypeOf;
/**
 * Similar to {@link isObject}, but also checks if prototype is that of
 * `Object` (or `null`).
 *
 * @param x -
 */
const isPlainObject = (x) => {
    let p;
    return (x != null &&
        typeof x === "object" &&
        ((p = OBJP(x)) === null || OBJP(p) === null));
};

const RE_VEC = /^[iub]?vec[234]$/;
const RE_MAT = /^mat[234]$/;
/**
 * Returns true if given `t` is a {@link Term}-like object.
 *
 * @param t
 */
const isTerm = (t) => isPlainObject(t) && !!t.tag && !!t.type;
/**
 * Returns true, if given term evaluates to a vector value (vec, ivec, bvec).
 */
const isVec = (t) => RE_VEC.test(t.type);
/**
 * Returns true, if given term evaluates to a matrix value.
 */
const isMat = (t) => RE_MAT.test(t.type);

const defError = (prefix, suffix = (msg) => (msg !== undefined ? ": " + msg : "")) => class extends Error {
    constructor(msg) {
        super(prefix(msg) + suffix(msg));
    }
};

const IllegalArgumentError = defError(() => "illegal argument(s)");
const illegalArgs = (msg) => {
    throw new IllegalArgumentError(msg);
};

let symID = 0;
/**
 * Generates a new symbol name, e.g. `_sa2`. Uses base36 for counter to
 * keep names short.
 */
const gensym = () => `_s${(symID++).toString(36)}`;

function sym(type, ...xs) {
    let id;
    let opts;
    let init;
    switch (xs.length) {
        case 0:
            if (!isString(type)) {
                init = type;
                type = init.type;
            }
            break;
        case 1:
            if (isString(xs[0])) {
                id = xs[0];
            }
            else if (xs[0].tag) {
                init = xs[0];
            }
            else {
                opts = xs[0];
            }
            break;
        case 2:
            if (isString(xs[0])) {
                [id, opts] = xs;
            }
            else {
                [opts, init] = xs;
            }
            break;
        case 3:
            [id, opts, init] = xs;
            break;
        default:
            illegalArgs();
    }
    return {
        tag: "sym",
        type,
        id: id || gensym(),
        opts: opts || {},
        init: init,
    };
}
const input = (type, id, opts) => sym(type, id, Object.assign({ q: "in", type: "in" }, opts));
const output = (type, id, opts) => sym(type, id, Object.assign({ q: "out", type: "out" }, opts));
const uniform = (type, id, opts) => sym(type, id, Object.assign({ q: "in", type: "uni" }, opts));

const lit = (type, val, info) => type === val.type && info === val.info
    ? val
    : {
        tag: "lit",
        type,
        info,
        val,
    };
const bool = (x) => lit("bool", isNumber(x) ? !!x : x);
const float = (x) => lit("float", isBoolean(x) ? x & 1 : x);
const int = (x) => lit("int", isBoolean(x) ? x & 1 : isNumber(x) ? x | 0 : x);
const uint = (x) => lit("uint", isBoolean(x) ? x & 1 : isNumber(x) ? x >>> 0 : x);
const wrap = (type, ctor) => (x) => isNumber(x)
    ? ctor(x)
    : x !== undefined && !isVec(x) && x.type !== type
        ? ctor(x)
        : x;
/**
 * Takes a plain number or numeric term and wraps it as float literal if
 * needed.
 *
 * @param x -
 */
const wrapFloat = wrap("float", float);
/**
 * Takes a plain number or numeric term and wraps it as boolean literal
 * if needed.
 *
 * @param x -
 */
const wrapBool = wrap("bool", bool);
const TRUE = bool(true);
const FALSE = bool(false);
const FLOAT0 = float(0);
const FLOAT1 = float(1);
const FLOAT2 = float(2);
const FLOAT05 = float(0.5);
const INT0 = int(0);
const INT1 = int(1);
const UINT0 = uint(0);
const UINT1 = uint(1);
const PI = float(Math.PI);
const TAU = float(Math.PI * 2);
const HALF_PI = float(Math.PI / 2);
const SQRT2 = float(Math.SQRT2);
const PHI = float((1 + Math.sqrt(5)) / 2);
const $gvec = (wrap, init) => (xs) => [xs[0] === undefined ? init : wrap(xs[0]), ...xs.slice(1).map(wrap)];
const $vec = $gvec(wrapFloat, FLOAT0);
const $bvec = $gvec(wrapBool, FALSE);
const $vinfo = (v, info = "") => v[0] + info.substr(1);
const $info = (xs, info) => isVec(xs[0]) ? $vinfo(xs[0].type, info[xs.length]) : info[xs.length];
const $gvec2 = (type, ctor, xs) => lit(type, (xs = ctor(xs)), $info(xs, ["n", "n"]));
const $gvec3 = (type, ctor, xs) => lit(type, (xs = ctor(xs)), $info(xs, ["n", "n", "vn"]));
const $gvec4 = (type, ctor, xs) => lit(type, (xs = ctor(xs)), xs.length === 2
    ? isVec(xs[1])
        ? xs[0].type[0] + xs[1].type[0]
        : "vn"
    : $info(xs, ["n", "n", , "vnn"]));
const $gmat = (type, info, xs) => lit(type, (xs = $vec(xs)), info[xs.length]);
// prettier-ignore
function vec2(...xs) {
    return $gvec2("vec2", $vec, xs);
}
function vec3(...xs) {
    return $gvec3("vec3", $vec, xs);
}
function vec4(...xs) {
    return $gvec4("vec4", $vec, xs);
}
function bvec4(...xs) {
    return $gvec4("bvec4", $bvec, xs);
}
function mat2(...xs) {
    return $gmat("mat2", ["n", "n", "vv"], xs);
}
const VEC2_0 = vec2(0);
const VEC2_1 = vec2(1);
const VEC2_2 = vec2(2);
const VEC3_0 = vec3(0);
const VEC3_1 = vec3(1);
const VEC3_2 = vec3(2);

/**
 * Returns base type for given term. Used for array ops.
 *
 * @example
 * ```ts
 * itemType("vec2[]") => "vec2"
 * ```
 */
const itemType = (type) => type.replace("[]", "");
/**
 * Takes a numeric term and a plain number, returns number wrapped in
 * typed literal compatible with term.
 *
 * @param t -
 * @param x -
 */
const numberWithMatchingType = (t, x) => {
    const id = t.type[0];
    return id === "i"
        ? int(x)
        : id === "u"
            ? uint(x)
            : id === "b"
                ? bool(x)
                : float(x);
};

export { FLOAT0 as F, SQRT2 as S, VEC2_1 as V, illegalArgs as a, isVec as b, input as c, vec2 as d, vec3 as e, float as f, defError as g, isMat as h, int as i, isTerm as j, gensym as k, isString as l, isNumber as m, numberWithMatchingType as n, output as o, isBoolean as p, itemType as q, FLOAT05 as r, sym as s, FLOAT2 as t, uniform as u, vec4 as v, FLOAT1 as w, mat2 as x, bvec4 as y };
