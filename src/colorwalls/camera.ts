import { create } from 'tvs-utils/dist/lib/vr/camera'
import { canvas } from './context'


export const moveSpeed = 0.05

export const lookSpeed = 0.002

export const camera = create({
	fovy: Math.PI * 0.4,
	aspect: canvas.width / canvas.height,
	moveForward: -30
})
