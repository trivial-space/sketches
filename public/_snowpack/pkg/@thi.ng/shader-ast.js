import { b as builtinCall } from '../common/math-022fe686.js';
export { z as $, f as $w, c as $x, l as $xy, i as $xyz, $ as $y, g as $z, n as abs, e as add, a as assign, d as defMain, A as defn, u as discard, j as div, v as dot, w as eq, D as floor, C as fract, k as gt, x as ifThen, y as length, E as max, r as min, q as mix, m as mul, o as normalize, h as pow, p as program, B as ret, s as sub, t as ternary } from '../common/math-022fe686.js';
import { i as int, a as illegalArgs, b as isVec } from '../common/item-79854ead.js';
export { f as float, c as input, o as output, s as sym, u as uniform, d as vec2, e as vec3, v as vec4 } from '../common/item-79854ead.js';

const MAT_VEC = {
    mat2: "vec2",
    mat3: "vec3",
    mat4: "vec4",
    // mat23: "vec3",
    // mat24: "vec4",
    // mat32: "vec2",
    // mat34: "vec4",
    // mat42: "vec2",
    // mat43: "vec3",
};
function indexMat(m, a, b) {
    const idx = {
        tag: "idxm",
        type: MAT_VEC[m.type],
        id: int(a),
        val: m,
    };
    return b !== undefined
        ? { tag: "idx", type: "float", id: int(b), val: idx }
        : idx;
}

const texRetType = (sampler) => {
    const t = sampler.type[0];
    const shadow = sampler.type.indexOf("Shadow") > 0;
    return t === "s"
        ? shadow
            ? "float"
            : "vec4"
        : t === "i"
            ? shadow
                ? "int"
                : "ivec4"
            : t === "u"
                ? shadow
                    ? "uint"
                    : "uvec4"
                : illegalArgs(`unknown sampler type ${sampler.type}`);
};
const $call = (name, sampler, args, bias) => {
    const f = bias
        ? builtinCall(name, texRetType(sampler), sampler, ...args, bias)
        : builtinCall(name, texRetType(sampler), sampler, ...args);
    !isVec(f) && (f.info = "n");
    return f;
};
// prettier-ignore
function texture(sampler, uv, bias) {
    return $call("texture", sampler, [uv], bias);
}

export { indexMat, texture };
