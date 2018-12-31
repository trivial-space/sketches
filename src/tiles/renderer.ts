import {
	addSystem,
	getLayer,
	getForm,
	getShade,
	getSketch,
	getFrame,
} from 'shared-utils/painterState'
import { each } from 'tvs-libs/dist/utils/sequence'
import { Frame } from 'tvs-painter/dist/frame'
import { plane } from 'tvs-painter/dist/utils/geometry/plane'
import { events, gl, painter, state, State } from './context'
import frag from './glsl/base-frag.glsl'
import vert from './glsl/base-vert.glsl'

// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [1, 1, 1, 1],
	enable: [gl.DEPTH_TEST, gl.CULL_FACE],
})

// ===== shaders =====

const shade = getShade(painter, 'shade').update({ frag, vert })

// ===== geometries =====

const tileSize = state.tiles.tileSize
const form = getForm(painter, 'form').update(plane(tileSize, tileSize, 3, 3))

// ===== textures =====

const textures: { [id: string]: Frame } = {}

// ===== objects =====

const tilesSketch = getSketch(painter, 'tiles')

// ===== layers =====

export const scene = getLayer(painter, 'scene').update({
	sketches: [tilesSketch],
	uniforms: {
		view: () => state.viewPort.camera.viewMat,
		projection: () => state.viewPort.camera.projectionMat,
	},
})

addSystem<State>('render', (e, s) => {
	switch (e) {
		case events.START:
			each((img, key) => {
				textures[key] = getFrame(painter, key).update({
					minFilter: 'LINEAR_MIPMAP_LINEAR',
					magFilter: 'LINEAR',
					asset: img,
				})
			}, s.tiles.images)
			return

		case events.NEW_ACTIVE_TILES:
			tilesSketch.update({
				form,
				shade,
				uniforms: s.tiles.activeTiles.map(tile => ({
					transform: tile.transform,
					image: textures[tile.tileSpecId] && textures[tile.tileSpecId].image(),
					color: tile.color,
					connections: tile.connections,
				})),
			})
	}
})
