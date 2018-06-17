import { create } from 'tvs-utils/dist/lib/vr/camera'
import { canvas } from './context'


export let aspect = canvas.width / canvas.height

export const camera = create({
	fovy: Math.PI * 0.5,
	aspect
})

export let distance = 103

// TODO: update on window size change
camera.props.moveForward = distance / aspect

; (window as any).camera = camera
