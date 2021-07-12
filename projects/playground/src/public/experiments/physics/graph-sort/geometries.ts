import { hsl, hslToRGB } from 'tvs-libs/dist/graphics/colors'
import { add, mul, normalize, sub } from 'tvs-libs/dist/math/vectors'
import { flatten, mapcat } from 'tvs-libs/dist/utils/sequence'
import { createPoints2DSketch } from '../../../../shared-utils/sketches/points'
import { Q } from './context'
import { connections, nameSpaceCount, nodes } from './nodes'

export const lineForm = Q.getForm('lines')

export const points = createPoints2DSketch(Q, 'points', {
	pointSize: 20,
	dynamicForm: true,
})

const lineWidth = 3

export function updateGeometries() {
	points.update({
		positions: nodes.map((n) => n.pos),
		colors: nodes.map((n) => [
			...hslToRGB(hsl(n.ns / nameSpaceCount, 1, 0.5)),
			1,
		]),
	})

	lineForm.update({
		drawType: 'TRIANGLES',
		attribs: {
			position: {
				buffer: new Float32Array(
					mapcat((c) => {
						const n1 = nodes[c[0]]
						const n2 = nodes[c[1]]
						const vDiff = normalize(sub(n2.pos, n1.pos))
						const normal = [vDiff[1], -vDiff[0]]
						const p1 = add(n1.pos, mul(lineWidth / 2, normal))
						const p2 = add(n1.pos, mul(-lineWidth / 2, normal))
						const p3 = add(n2.pos, mul(lineWidth / 2, normal))
						const p4 = add(n2.pos, mul(-lineWidth / 2, normal))
						return flatten([p3, p2, p1, p2, p3, p4])
					}, connections),
				),
				storeType: 'DYNAMIC',
			},
		},
		itemCount: connections.length * 6,
	})
}
