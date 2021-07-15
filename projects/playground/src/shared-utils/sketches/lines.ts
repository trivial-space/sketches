import { sub, Vec } from 'tvs-libs/dist/math/vectors'
import { ColorRGBA } from 'tvs-libs/dist/graphics/colors'
import { PainterContext } from '../painterState'
import { DrawSettings, FormData } from 'tvs-painter/dist'
import { line2DVert, lineFrag } from './lines-shaders'
import { flatMap, flatten, times } from 'tvs-libs/dist/utils/sequence'
import { triangulate } from '../../../../libs/dist/geometry/quad'

interface LinesData {
	points?: Vec[]
	colors?: ColorRGBA[]
	color?: ColorRGBA
	lineWidth?: number
	dynamicForm?: boolean
	drawSettings?: DrawSettings
	frag?: string
}

export function createLines2DSketch(
	Q: PainterContext,
	id: string,
	linesData: LinesData,
) {
	const sketch = Q.getSketch(id)

	const update = (newData: Partial<LinesData> = {}) => {
		const { points, ...data }: LinesData = {
			points: [],
			...linesData,
			...newData,
		}

		if (points.length < 2) {
			throw Error('points must have at least two elements')
		}

		const shade = Q.getShade(id).update({
			frag: data.frag || lineFrag,
			vert: line2DVert,
		})

		const formData: FormData = {
			drawType: 'TRIANGLES',
			attribs: {
				position1: {
					buffer: new Float32Array(
						flatten(
							flatten(
								times((i) => {
									const p = points[i]
									const n = points[i + 1]
									return [p, p, n, n]
								}, points.length - 1),
							),
						),
					),
					storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
				},
				position2: {
					buffer: new Float32Array(
						flatten(
							flatten(
								times((i) => {
									const p = points[i]
									const n = points[i + 1]
									return [n, n, p, p]
								}, points.length - 1),
							),
						),
					),
					storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
				},
				direction: {
					buffer: new Float32Array(flatMap(() => [-1, 1, -1, 1], points)),
					storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
				},
			},
			itemCount: (points.length - 1) * 6,
			elements: {
				buffer: new Uint32Array(flatten(triangulate(points.length - 1))),
				storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
			},
		}

		if (data.colors) {
			formData.attribs.color = {
				buffer: new Float32Array(
					flatten(
						flatten(
							times((i) => {
								const p = data.colors![i]
								const n = data.colors![i + 1]
								return [p, p, n, n]
							}, points.length - 1),
						),
					),
				),
				storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
			}
		}

		const form = Q.getForm(id).update(formData)

		sketch.update({
			form,
			shade,
			uniforms: {
				uLineWidth: data.lineWidth || 1,
				uSize: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
				uColor: data.color || [0, 0, 0, 0],
			},
			drawSettings: data.drawSettings,
		})
	}

	if ((linesData.points?.length || 0) >= 2) {
		update()
	}

	return { sketch, update }
}
