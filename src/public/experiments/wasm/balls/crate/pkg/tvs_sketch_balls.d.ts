/* tslint:disable */
/* eslint-disable */
/**
*/
export function setup(): void;
/**
* @returns {any}
*/
export function get_geom(): any;
/**
* @returns {Float32Array}
*/
export function get_mvp(): Float32Array;
/**
* @returns {Float32Array}
*/
export function get_normal_mat(): Float32Array;
/**
* @returns {Float32Array}
*/
export function get_light(): Float32Array;
/**
* @param {number} tpf
*/
export function update(tpf: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly setup: () => void;
  readonly get_geom: () => number;
  readonly get_mvp: () => number;
  readonly get_normal_mat: () => number;
  readonly update: (a: number) => void;
  readonly get_light: () => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
