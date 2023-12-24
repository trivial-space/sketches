/* tslint:disable */
/* eslint-disable */
/**
* @param {number} width
* @param {number} height
* @param {number} _color_count
*/
export function setup(width: number, height: number, _color_count: number): void;
/**
* @returns {any}
*/
export function get_geom(): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly setup: (a: number, b: number, c: number) => void;
  readonly get_geom: () => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
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
