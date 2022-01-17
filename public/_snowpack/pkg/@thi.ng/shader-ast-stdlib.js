import { b as builtinCall, A as defn, B as ret, t as ternary, j as div, s as sub, F as neq, e as add, m as mul, v as dot, C as fract, G as sin, a as assign, z as $, g as $z, $ as $y, c as $x, D as floor, h as pow, H as forLoop, I as lte, J as inc, l as $xy, K as smoothstep, L as sqrt, M as madd } from '../common/math-022fe686.js';
import { F as FLOAT0, r as FLOAT05, t as FLOAT2, w as FLOAT1, x as mat2, e as vec3, d as vec2, v as vec4, s as sym, f as float, i as int, S as SQRT2, y as bvec4, V as VEC2_1 } from '../common/item-79854ead.js';

const $bvec = (t) => ("bvec" + t[t.length - 1]);
const $call = (fn, a, b) => builtinCall(fn, $bvec(a.type), a, b);
function lessThan(a, b) {
    return $call("lessThan", a, b);
}
function greaterThan(a, b) {
    return $call("greaterThan", a, b);
}
const _any = (v) => builtinCall("any", "bool", v);

/**
 * Returns normalized value of `x` WRT to interval [a,b]. Returns 0, if
 * `a` equals `b`.
 *
 * @param x -
 * @param a -
 * @param b -
 */
const fitNorm1 = defn("float", "fitNorm1", ["float", "float", "float"], (x, a, b) => [ret(ternary(neq(a, b), div(sub(x, a), sub(b, a)), FLOAT0))]);
/**
 * Inline function. Fits value `x` in [-1..+1] interval to [0..1]
 * interval. No clamping performed.
 *
 * @param x -
 */
const fit1101 = (x) => add(mul(x, FLOAT05), FLOAT05);
/**
 * Inline function. Fits value `x` in [0..1] interval to [-1..+1]
 * interval. No clamping performed.
 *
 * @param x -
 */
const fit0111 = (x) => sub(mul(x, FLOAT2), FLOAT1);

/**
 * Inline function. Computes Half-Lambertian term. Both vectors must be
 * pre-normalized.
 *
 * {@link https://developer.valvesoftware.com/wiki/Half_Lambert}
 *
 * @param n -
 * @param ldir -
 */
const halfLambert = (n, ldir) => fit1101(dot(n, ldir));

/**
 * iq's hash PRNG producing 2D results.
 *
 * @param p -
 */
const hash2 = defn("vec2", "hash2", ["vec2"], (p) => [
    ret(fract(mul(sin(mul(p, mat2(127.1, 311.7, 269.5, 183.3))), 43758.5453))),
]);
/**
 * iq's hash PRNG producing 3D results.
 *
 * @param p -
 */
const hash3 = defn("vec3", "hash3", ["vec2"], (p) => [
    ret(fract(mul(sin(vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)))), 43758.5453))),
]);
const H = vec3(0.1031, 0.103, 0.0973);
const H4 = vec4(0.1031, 0.103, 0.0973, 0.1099);
/**
 * 1D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash11 = defn("float", "hash11", ["float"], (p) => {
    let x;
    return [
        (x = sym(fract(mul(p, 0.1031)))),
        assign(x, mul(x, add(x, 19.19))),
        assign(x, mul(x, add(x, x))),
        ret(fract(x)),
    ];
});
/**
 * 2D -> 1D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash12 = defn("float", "hash12", ["vec2"], (p) => {
    let x;
    return [
        (x = sym(fract(mul($(p, "xyx"), 0.1031)))),
        assign(x, add(x, dot(x, add($(x, "yzx"), 19.19)))),
        ret(fract(mul(add($x(x), $y(x)), $z(x)))),
    ];
});
/**
 * 3D -> 1D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash13 = defn("float", "hash13", ["vec3"], (p) => {
    let x;
    return [
        (x = sym(fract(mul($(p, "xyx"), 0.1031)))),
        assign(x, add(x, dot(x, add($(x, "yzx"), 19.19)))),
        ret(fract(mul(add($x(x), $y(x)), $z(x)))),
    ];
});
/**
 * 1D -> 2D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash21 = defn("vec2", "hash21", ["float"], (p) => {
    let x;
    return [
        (x = sym(fract(mul(vec3(p), H)))),
        assign(x, add(x, dot(x, add($(x, "yzx"), 19.19)))),
        ret(fract(mul(add($(x, "xx"), $(x, "yz")), $(x, "zy")))),
    ];
});
/**
 * 2D -> 2D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash22 = defn("vec2", "hash22", ["vec2"], (p) => {
    let x;
    return [
        (x = sym(fract(mul($(p, "xyx"), H)))),
        assign(x, add(x, dot(x, add($(x, "yzx"), 19.19)))),
        ret(fract(mul(add($(x, "xx"), $(x, "yz")), $(x, "zy")))),
    ];
});
/**
 * 3D -> 2D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash23 = defn("vec2", "hash23", ["vec3"], (p) => {
    let x;
    return [
        (x = sym(fract(mul(p, H)))),
        assign(x, add(x, dot(x, add($(x, "yzx"), 19.19)))),
        ret(fract(mul(add($(x, "xx"), $(x, "yz")), $(x, "zy")))),
    ];
});
/**
 * 1D -> 3D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash31 = defn("vec3", "hash31", ["float"], (p) => {
    let x;
    return [
        (x = sym(fract(mul(p, H)))),
        assign(x, add(x, dot(x, add($(x, "yzx"), 19.19)))),
        ret(fract(mul(add($(x, "xxy"), $(x, "yzz")), $(x, "zyx")))),
    ];
});
/**
 * 2D -> 3D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash32 = defn("vec3", "hash32", ["vec2"], (p) => {
    let x;
    return [
        (x = sym(fract(mul($(p, "xyx"), H)))),
        assign(x, add(x, dot(x, add($(x, "yzx"), 19.19)))),
        ret(fract(mul(add($(x, "xxy"), $(x, "yzz")), $(x, "zyx")))),
    ];
});
/**
 * 3D -> 3D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash33 = defn("vec3", "hash33", ["vec3"], (p) => {
    let x;
    return [
        (x = sym(fract(mul(p, H)))),
        assign(x, add(x, dot(x, add($(x, "yzx"), 19.19)))),
        ret(fract(mul(add($(x, "xxy"), $(x, "yzz")), $(x, "zyx")))),
    ];
});
/**
 * 1D -> 4D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash41 = defn("vec4", "hash41", ["float"], (p) => {
    let x;
    return [
        (x = sym(fract(mul(p, H4)))),
        assign(x, add(x, dot(x, add($(x, "wzxy"), 19.19)))),
        ret(fract(mul(add($(x, "xxyz"), $(x, "yzzw")), $(x, "zywx")))),
    ];
});
/**
 * 2D -> 4D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash42 = defn("vec4", "hash42", ["vec2"], (p) => {
    let x;
    return [
        (x = sym(fract(mul($(p, "xyxy"), H4)))),
        assign(x, add(x, dot(x, add($(x, "wzxy"), 19.19)))),
        ret(fract(mul(add($(x, "xxyz"), $(x, "yzzw")), $(x, "zywx")))),
    ];
});
/**
 * 3D -> 4D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash43 = defn("vec4", "hash43", ["vec3"], (p) => {
    let x;
    return [
        (x = sym(fract(mul($(p, "xyzx"), H4)))),
        assign(x, add(x, dot(x, add($(x, "wzxy"), 19.19)))),
        ret(fract(mul(add($(x, "xxyz"), $(x, "yzzw")), $(x, "zywx")))),
    ];
});
/**
 * 4D -> 4D hash.
 *
 * Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
 *
 * @param p -
 */
const hash44 = defn("vec4", "hash44", ["vec4"], (p) => {
    let x;
    return [
        (x = sym(fract(mul(p, H4)))),
        assign(x, add(x, dot(x, add($(x, "wzxy"), 19.19)))),
        ret(fract(mul(add($(x, "xxyz"), $(x, "yzzw")), $(x, "zywx")))),
    ];
});

/**
 * IQ's parametric 2D voronoise. Depending on `u` and `v`, this function
 * produces 4 different noise types
 *
 * - cell noise (0,0)
 * - voronoi (1,0)
 * - perlin noise (0,1)
 * - voronoise (1,1)
 *
 * {@link http://www.iquilezles.org/www/articles/voronoise/voronoise.htm}
 *
 * Note: This implementation uses the improved {@link hash32} by Dave Hoskins
 * instead of iq's original {@link hash3}.
 *
 * @param p -
 * @param u -
 * @param v -
 */
const voronoise2 = defn("float", "voronoise2", ["vec2", "float", "float"], (x, u, v) => {
    let p;
    let f;
    let coeff;
    let k;
    let va;
    let wt;
    let g;
    let o;
    let r;
    let w;
    return [
        (p = sym(floor(x))),
        (f = sym(fract(x))),
        (coeff = sym(vec3(u, u, 1))),
        (k = sym(add(1, mul(63, pow(sub(1, v), float(4)))))),
        (va = sym(FLOAT0)),
        (wt = sym(FLOAT0)),
        forLoop(sym(int(-2)), (i) => lte(i, int(2)), inc, (i) => [
            forLoop(sym(int(-2)), (j) => lte(j, int(2)), inc, (j) => [
                (g = sym(vec2(float(i), float(j)))),
                (o = sym(mul(hash32(add(p, g)), coeff))),
                (r = sym(add(sub(g, f), $xy(o)))),
                (w = sym(pow(sub(1, smoothstep(FLOAT0, SQRT2, sqrt(dot(r, r)))), k))),
                assign(va, madd(w, $z(o), va)),
                assign(wt, add(wt, w)),
            ]),
        ]),
        ret(div(va, wt)),
    ];
});

/**
 * Takes `pos`, a screen coord (e.g. gl_FragCoord) and viewport resolution
 * `res`, returns aspect corrected uv, with uv.y in [-1..1] interval and uv.x
 * scaled by the aspect ratio `resx / resy`.
 *
 * @param fragCoord - vec2
 * @param res - vec2
 */
const aspectCorrectedUV = defn("vec2", "aspectCorrectedUV", ["vec2", "vec2"], (pos, res) => {
    let uv;
    return [
        (uv = sym(fit0111(div(pos, res)))),
        assign($x(uv), mul($x(uv), div($x(res), $y(res)))),
        ret(uv),
    ];
});
/**
 * Returns true if at least one coordinate of the given point is within the
 * `width` internal border region of UV rect ([0,0] .. [1,1]).
 *
 * ```c
 * borderMask(vec2(0.91, 0.5), 0.1) // true
 * borderMask(vec2(0.2, 0.01), 0.1) // true
 * borderMask(vec2(0.2, 0.2), 0.1) // false
 * ```
 */
const borderMask = defn("bool", "borderMask", ["vec2", "float"], (uv, width) => [
    ret(_any(bvec4(lessThan(uv, vec2(width)), greaterThan(add(uv, width), VEC2_1)))),
]);

export { aspectCorrectedUV, fit0111, fit1101, halfLambert, voronoise2 };
