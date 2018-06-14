import { mat4 } from 'gl-matrix'
import { repeat } from 'shared-utils/scheduler'


export const transform = mat4.create()

repeat(tpf => mat4.rotateY(transform, transform, tpf * 0.0003), 'totate')
