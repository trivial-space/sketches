import { clamp, lerp } from '../math/core.js';
/**
 * @param h hue in range 0 - 1
 * @param s saturation in range 0 - 1
 * @param l lightness in range 0 - 1
 */
export const hsl = (h, s, l) => ({ h, s, l });
export const BLACK = [0, 0, 0, 255];
export const WHITE = [255, 255, 255, 255];
export function mixColors([r1, g1, b1, a1], [r2, g2, b2, a2]) {
    const step = a2 / 255;
    const r = Math.floor(lerp(step, r1, r2));
    const g = Math.floor(lerp(step, g1, g2));
    const b = Math.floor(lerp(step, b1, b2));
    return [r, g, b, a1];
}
export function grey(scale, alpha) {
    if (alpha == null) {
        alpha = 255;
    }
    return [scale, scale, scale, alpha];
}
export function colorRgbaToCSS([r, g, b, a]) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a / 255 + ')';
}
export function intToFloat(color) {
    return color.map(v => v / 255);
}
export function floatToInt(color) {
    return color.map(v => Math.floor(v * 255));
}
export function hexToRgb(hex) {
    hex = Math.floor(hex);
    const r = (hex >> 16) & 255, g = (hex >> 8) & 255, b = hex & 255;
    return [r, g, b];
}
export function rgbToHexString([r, g, b]) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
export function hexStringToRgb(s) {
    s = s.replace(/^\s*#|\s*$/g, '');
    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (s.length === 3) {
        s = s.replace(/(.)/g, '$1$1');
    }
    return hexToRgb(parseInt(s, 16));
}
/**
 * @param rgb FloatColor with ranges 0 - 1
 */
export function rgbToHSL([r, g, b]) {
    const cMax = Math.max(r, g, b);
    const cMin = Math.min(r, g, b);
    const delta = cMax - cMin;
    const l = (cMax + cMin) / 2;
    let h = 0, s = 0;
    if (delta === 0) {
        h = 0;
    }
    else if (cMax === r) {
        h = (((g - b) / delta) % 6) / 6;
    }
    else if (cMax === g) {
        h = ((b - r) / delta + 2) / 6;
    }
    else {
        h = ((r - g) / delta + 4) / 6;
    }
    if (delta === 0) {
        s = 0;
    }
    else {
        s = delta / (1 - Math.abs(2 * l - 1));
    }
    return {
        h: adjustHue(h),
        s: s,
        l: l,
    };
}
export function hslToRGB({ h, s, l }) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;
    let r, g, b;
    if (h < 1 / 6) {
        r = c;
        g = x;
        b = 0;
    }
    else if (h < 2 / 6) {
        r = x;
        g = c;
        b = 0;
    }
    else if (h < 0.5) {
        r = 0;
        g = c;
        b = x;
    }
    else if (h < 4 / 6) {
        r = 0;
        g = x;
        b = c;
    }
    else if (h < 5 / 6) {
        r = x;
        g = 0;
        b = c;
    }
    else {
        r = c;
        g = 0;
        b = x;
    }
    r = clamp(0, 1, r + m);
    g = clamp(0, 1, g + m);
    b = clamp(0, 1, b + m);
    return [r, g, b];
}
export function adjustHue(hue) {
    if (hue >= 1) {
        return hue - 1;
    }
    if (hue < 0) {
        return hue + 1;
    }
    return hue;
}
export function updateHue(hsl, degree) {
    return Object.assign(Object.assign({}, hsl), { h: adjustHue(hsl.h + degree) });
}
export function updateSaturation(hsl, delta) {
    return Object.assign(Object.assign({}, hsl), { s: clamp(0, 1, hsl.s + delta) });
}
export function updateLightness(hsl, delta) {
    return Object.assign(Object.assign({}, hsl), { l: clamp(0, 1, hsl.l + delta) });
}
//# sourceMappingURL=colors.js.map