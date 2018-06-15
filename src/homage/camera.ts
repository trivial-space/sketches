import { create } from 'tvs-utils/dist/lib/vr/camera'
import { canvas } from './context'
import { mat4 } from 'gl-matrix'


export const moveSpeed = 0.02

export const lookSpeed = 0.002

export const camera = create({
	fovy: Math.PI * 0.4,
	aspect: canvas.width / canvas.height
})

; (window as any).camera = camera


export const groundMirrorView = mat4.create()
