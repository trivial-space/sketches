import vert from './glsl/base-vert.glsl'
import frag from './glsl/base-frag.glsl'
import { painter, gl, state, events, State } from './context'
import { getShade, getForm, getStaticLayer, getSketch, getDrawingLayer, addSystem } from 'shared-utils/painterState'
import { plane } from 'tvs-painter/dist/lib/utils/geometry/plane'
import { each } from 'tvs-libs/dist/lib/utils/sequence'
import { StaticLayer } from 'tvs-painter/dist/lib/layer'

// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [1, 1, 1, 1],
	enable: [gl.DEPTH_TEST, gl.CULL_FACE]
})


// ===== shaders =====

const shade = getShade(painter, 'shade')
.update({frag, vert})


// ===== geometries =====

const tileSize = state.tiles.tileSize
const form = getForm(painter, 'form')
.update(plane(tileSize, tileSize, 3, 3))


// ===== textures =====

const textures: {[id: string]: StaticLayer} = {}


// ===== objects =====

const tilesSketch = getSketch(painter, 'tiles')


// ===== layers =====

export const scene = getDrawingLayer(painter, 'scene')
	.update({
		sketches: [tilesSketch],
		uniforms: {
			view: () => state.viewPort.camera.viewMat,
			projection: () => state.viewPort.camera.projectionMat
		}
	})


addSystem<State>('render', (e, s) => {
	switch (e) {
		case events.START:
			each((img, key) => {
				textures[key] = getStaticLayer(painter, key)
					.update({
						minFilter: 'LINEAR',
						magFilter: 'LINEAR',
						asset: img
					})
			}, s.tiles.images)
			break

		case events.NEW_ACTIVE_TILES:
			tilesSketch.update({
					form, shade,
					uniforms: s.tiles.activeTiles.map(tile => ({
						transform: tile.transform,
						image: textures[tile.tileSpecId] && textures[tile.tileSpecId].texture(),
						color: tile.color,
						connections: tile.connections
					}))
				})
	}
})
