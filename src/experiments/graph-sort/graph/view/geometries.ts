import { stream, val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { intToFloat } from 'tvs-libs/dist/graphics/colors'
import { add, mul, normalize, sub } from 'tvs-libs/dist/math/vectors'
import { flatten, mapcat } from 'tvs-libs/dist/utils/sequence'
import { FormData } from 'tvs-painter/dist'
import { connections, nameSpaceCount, nodes } from '../state/nodes'

export const points = stream(
	[nodes.HOT, nameSpaceCount.HOT],
	(nodes, nsCount) =>
		({
			drawType: 'POINTS',
			attribs: {
				position: {
					buffer: new Float32Array(mapcat(n => n.pos, nodes)),
					storeType: 'DYNAMIC',
				},
				color: {
					buffer: new Float32Array(
						mapcat(
							n =>
								intToFloat([
									(n.ns / nsCount) * 255,
									((n.ns / nsCount + 1 / 3) * 255) % 255,
									((n.ns / nsCount + 2 / 3) * 255) % 255,
								]),
							nodes,
						),
					),
					storeType: 'DYNAMIC',
				},
			},
			itemCount: nodes.length,
		} as FormData),
)

export const lineWidth = val(3)

export const lines = stream(
	[connections.HOT, nodes.HOT, lineWidth.HOT],
	(connections, nodes, width) =>
		({
			drawType: 'TRIANGLES',
			attribs: {
				position: {
					buffer: new Float32Array(
						mapcat(c => {
							const n1 = nodes[c[0]]
							const n2 = nodes[c[1]]
							const vDiff = normalize(sub(n2.pos, n1.pos))
							const normal = [vDiff[1], -vDiff[0]]
							const p1 = add(n1.pos, mul(width / 2, normal))
							const p2 = add(n1.pos, mul(-width / 2, normal))
							const p3 = add(n2.pos, mul(width / 2, normal))
							const p4 = add(n2.pos, mul(-width / 2, normal))
							return flatten([p3, p2, p1, p2, p3, p4])
						}, connections),
					),
					storeType: 'DYNAMIC',
				},
			},
			itemCount: connections.length * 6,
		} as FormData),
)
