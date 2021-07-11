import { Vec } from 'tvs-libs/dist/math/vectors'
import { ColorRGBA, WHITE } from 'tvs-libs/dist/graphics/colors'
import { PainterContext } from '../painterState'
import { point2DVert, pointFrag } from './points-shaders'
import { DrawSettings, FormData } from 'tvs-painter/dist'
import { flatten, repeat, times } from 'tvs-libs/dist/utils/sequence'

interface PointsData {
	positions: Vec[]
	colors?: ColorRGBA[]
	pointSize?: number
	scalePerspective?: boolean
	dynamicForm?: boolean
	drawSettings?: DrawSettings
}
export function createPoints2DSketch(
	Q: PainterContext,
	id: string,
	pointsData: PointsData,
) {
	const updatePoints = (newData: Partial<PointsData> = {}) => {
		const data = { ...pointsData, ...newData }
		const shade = Q.getShade(id).update({
			frag: pointFrag,
			vert: point2DVert,
		})
		const formData: FormData = {
			drawType: 'POINTS',
			attribs: {
				position: {
					buffer: new Float32Array(flatten(data.positions)),
					storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
				},
				color: data.colors
					? {
							buffer: new Float32Array(flatten(data.colors)),
							storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
					  }
					: {
							buffer: new Float32Array(
								flatten(repeat(data.positions.length, [1, 1, 1, 1])),
							),
							storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
					  },
			},
			itemCount: data.positions.length,
		}

		const form = Q.getForm(id).update(formData)
		const sketch = Q.getSketch(id).update({
			form,
			shade,
			uniforms: {
				pointSize: data.pointSize || 1,
				size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
			},
			drawSettings: data.drawSettings,
		})
		return sketch
	}

	const sketch = updatePoints()

	return { sketch, updatePoints }
}
