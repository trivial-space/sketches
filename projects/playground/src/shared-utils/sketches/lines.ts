import { sub, Vec } from 'tvs-libs/dist/math/vectors'
import { ColorRGBA } from 'tvs-libs/dist/graphics/colors'
import { PainterContext } from '../painterState'
import { DrawSettings, FormData } from 'tvs-painter/dist'
import { line2DVert, lineFrag } from './lines-shaders'
import { flatMap, flatten } from 'tvs-libs/dist/utils/sequence'

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
		const { points, ...data } = { points: [], ...linesData, ...newData }

		if (points.length < 2) {
			throw Error('points must have at least two elements')
		}

		const shade = Q.getShade(id).update({
			frag: data.frag || lineFrag,
			vert: line2DVert,
		})

		const [first, second] = points

		const firstPrev = sub(first, sub(second, first))
		const prev = points.slice(0, points.length - 1)
		prev.unshift(firstPrev)

		const formData: FormData = {
			drawType: 'TRIANGLES',
			attribs: {
				position: {
					buffer: new Float32Array(flatten(flatMap((p) => [p, p], points))),
					storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
				},
				prev: {
					buffer: new Float32Array(flatten(flatMap((p) => [p, p], prev))),
					storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
				},
				direction: {
					buffer: new Float32Array(flatMap(() => [1, -1], points)),
					storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
				},
			},
			itemCount: points.length * 2,
			elements: {
				buffer: new Uint32Array(
					flatten(
						points.map((p, i) => [
							i * 4,
							i * 4 + 2,
							i * 4 + 1,
							i * 4 + 1,
							i * 4 + 2,
							i * 4 + 3,
						]),
					),
				),
				storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
			},
		}

		if (data.colors) {
			formData.attribs.color = {
				buffer: new Float32Array(flatten(flatMap((c) => [c, c], data.colors))),
				storeType: data.dynamicForm ? 'DYNAMIC' : 'STATIC',
			}
		}

		const form = Q.getForm(id).update(formData)
		sketch.update({
			form,
			shade,
			uniforms: {
				uLineWidth: data.lineWidth || 1,
				size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
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
