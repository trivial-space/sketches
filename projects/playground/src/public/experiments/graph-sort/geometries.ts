import { intToFloat } from 'tvs-libs/dist/graphics/colors'
import { add, mul, normalize, sub } from 'tvs-libs/dist/math/vectors'
import { flatten, mapcat } from 'tvs-libs/dist/utils/sequence'
import { Q } from './context'
import { connections, nameSpaceCount, nodes } from './nodes'

export const pointsForm = Q.getForm('points')
export const lineForm = Q.getForm('lines')

const lineWidth = 3

export function updateGeometries() {
	pointsForm.update({
		drawType: 'POINTS',
		attribs: {
			position: {
				buffer: new Float32Array(mapcat((n) => n.pos, nodes)),
				storeType: 'DYNAMIC',
			},
			color: {
				buffer: new Float32Array(
					mapcat(
						(n) =>
							intToFloat([
								(n.ns / nameSpaceCount) * 255,
								((n.ns / nameSpaceCount + 1 / 3) * 255) % 255,
								((n.ns / nameSpaceCount + 2 / 3) * 255) % 255,
							]),
						nodes,
					),
				),
				storeType: 'DYNAMIC',
			},
		},
		itemCount: nodes.length,
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
