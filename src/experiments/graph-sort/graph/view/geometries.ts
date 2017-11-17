import { stream, val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { FormData } from 'tvs-painter/dist/lib'
import { nodes, nameSpaceCount, connections } from '../state/nodes'
import { mapcat, flatten } from 'tvs-libs/dist/lib/utils/sequence'
import { intToFloat } from 'tvs-libs/dist/lib/graphics/colors'
import { vec2 } from 'gl-matrix'



export const points = stream(
	[nodes.HOT, nameSpaceCount.HOT],
	(nodes, nsCount) => ({
		drawType: 'POINTS',
		attribs: {
			position: {
				buffer: new Float32Array(mapcat(nodes, n => [n.x, n.y])),
				storeType: 'DYNAMIC'
			},
			color: {
				buffer: new Float32Array(mapcat(nodes, n => intToFloat([
					(n.ns / nsCount) * 255,
					(((n.ns / nsCount) + (1 / 3)) * 255) % 255,
					(((n.ns / nsCount) + (2 / 3)) * 255) % 255
				]))),
				storeType: 'DYNAMIC'
			}
		},
		itemCount: nodes.length
	} as FormData)
)


export const lineWidth = val(3)


export const lines = stream(
	[connections.HOT, nodes.HOT, lineWidth.HOT],
	(cs, nodes, width) => ({
		drawType: 'TRIANGLES',
		attribs: {
			position: {
				buffer: new Float32Array(mapcat(cs, c => {
					const n1 = nodes[c[0]]
					const n2 = nodes[c[1]]
					const v1 = vec2.fromValues(n1.x, n1.y)
					const v2 = vec2.fromValues(n2.x, n2.y)
					const vDiff = vec2.subtract(vec2.create(), v2, v1)
					vec2.normalize(vDiff, vDiff)
					vec2.normalize(vDiff, vDiff)
					const normal = [vDiff[1], -vDiff[0]]
					const p1: any = vec2.add(vec2.create(), v1, vec2.scale(vec2.create(), normal, width / 2))
					const p2: any = vec2.add(vec2.create(), v1, vec2.scale(vec2.create(), normal, -width / 2))
					const p3: any = vec2.add(vec2.create(), v2, vec2.scale(vec2.create(), normal, width / 2))
					const p4: any = vec2.add(vec2.create(), v2, vec2.scale(vec2.create(), normal, -width / 2))
					return flatten<number>([p1, p2, p3, p2, p3, p4])
				})),
				storeType: 'DYNAMIC'
			}
		},
		itemCount: cs.length * 6
	} as FormData)
)
