/* tslint:disable */
/* eslint-disable */
/**
*/
export function setup(): void;
/**
* @returns {any}
*/
export function get_init_data(): any;
/**
* @returns {number}
*/
export function get_angle(): number;
/**
* @returns {any}
*/
export function get_frame_data(): any;
/**
* @param {number} tpf
*/
export function update(tpf: number): void;
/**
* @param {number} width
* @param {number} height
*/
export function update_screen(width: number, height: number): void;
/**
* @param {number} forward
* @param {number} left
* @param {number} up
* @param {number} rot_y
* @param {number} rot_x
* @returns {any}
*/
export function update_camera(forward: number, left: number, up: number, rot_y: number, rot_x: number): any;
/**
* @param {number} x
* @param {number} y
* @param {number} z
* @param {number} rot_horizontal
* @param {number} rot_vertical
*/
export function reset_camera(x: number, y: number, z: number, rot_horizontal: number, rot_vertical: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly get_init_data: () => number;
  readonly get_frame_data: () => number;
  readonly update: (a: number) => void;
  readonly update_screen: (a: number, b: number) => void;
  readonly update_camera: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly reset_camera: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly setup: () => void;
  readonly get_angle: () => number;
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
