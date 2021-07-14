import { Vec } from 'tvs-libs/dist/math/vectors'
import { ColorRGBA } from 'tvs-libs/dist/graphics/colors'
import { PainterContext } from '../painterState'
import { point2DVert, point3DVert, pointFrag } from './points-shaders'
import { DrawSettings, FormData } from 'tvs-painter/dist'
import { flatten } from 'tvs-libs/dist/utils/sequence'
import { mat4 } from 'gl-matrix'

interface PointsData {
	positions?: Vec[]
	colors?: ColorRGBA[]
	color?: ColorRGBA
	pointSize?: number
	dynamicForm?: boolean
	drawSettings?: DrawSettings
	frag?: string
}

export function createPoints2DSketch(
	Q: PainterContext,
	id: string,
	pointsData: PointsData,
) {
	const update = (newData: Partial<PointsData> = {}) => {
		const data = { positions: [], ...pointsData, ...newData }

		const shade = Q.getShade(id).update({
			frag: data.frag || pointFrag,
			vert: point2DVert,
		})

		const formData: FormData = {
			drawType: 'POINTS',
			attribs: {
				position: {
					buffer: new Float32Array(flatten(data.positions)),
					storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
				},
			},
			itemCount: data.positions.length,
		}

		if (data.colors) {
			formData.attribs.color = {
				buffer: new Float32Array(flatten(data.colors)),
				storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
			}
		}

		const form = Q.getForm(id).update(formData)
		const sketch = Q.getSketch(id).update({
			form,
			shade,
			uniforms: {
				pointSize: data.pointSize || 1,
				size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
				uColor: data.color || [0, 0, 0, 0],
			},
			drawSettings: data.drawSettings,
		})
		return sketch
	}

	const sketch = update()

	return { sketch, update }
}

interface Points3DData extends PointsData {
	viewMat?: mat4
	projectionMat?: mat4
	scalePerspective?: boolean
}

export function createPoints3DSketch(
	Q: PainterContext,
	id: string,
	pointsData: Points3DData,
) {
	const update = (newData: Partial<Points3DData> = {}) => {
		const data = { positions: [], ...pointsData, ...newData }

		const shade = Q.getShade(id).update({
			frag: data.frag || pointFrag,
			vert: point3DVert,
		})

		const formData: FormData = {
			drawType: 'POINTS',
			attribs: {
				position: {
					buffer: new Float32Array(flatten(data.positions)),
					storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
				},
			},
			itemCount: data.positions.length,
		}

		if (data.colors) {
			formData.attribs.color = {
				buffer: new Float32Array(flatten(data.colors)),
				storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
			}
		}

		const form = Q.getForm(id).update(formData)
		const sketch = Q.getSketch(id).update({
			form,
			shade,
			uniforms: {
				uPointSize: data.pointSize || 1,
				uSize: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
				uColor: data.color || [0, 0, 0, 0],
				uViewMat: data.viewMat,
				uProjectionMat: data.projectionMat,
				uUseProjection: data.scalePerspective || false,
			},
			drawSettings: data.drawSettings,
		})
		return sketch
	}

	const sketch = update()

	return { sketch, update }
}
