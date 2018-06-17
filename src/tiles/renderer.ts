import vert from './glsl/base-vert.glsl'
import frag from './glsl/base-frag.glsl'
import { painter, gl } from './context'
import { getShade, getForm, getStaticLayer, getSketch, getDrawingLayer } from 'shared-utils/painterState'
import { plane } from 'tvs-painter/dist/lib/utils/geometry/plane'
import { tileSize, images, imagesLoaded } from './state/init'
import { map, each } from 'tvs-libs/dist/lib/utils/sequence'
import { activeTiles } from './state/tiles'
import { camera } from './camera'

// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [1, 1, 1, 1],
	enable: [gl.DEPTH_TEST, gl.CULL_FACE]
})


// ===== shaders =====

export const shade = getShade(painter, 'shade')
.update({frag, vert})


// ===== geometries =====

export const form = getForm(painter, 'form')
.update(plane(tileSize, tileSize, 3, 3))


// ===== textures =====

export const textures = map((img, key) => getStaticLayer(painter, key)
	.update({
		minFilter: 'LINEAR',
		magFilter: 'LINEAR',
		asset: img
	}), images)

imagesLoaded.then(() => {
	each((t, key) => t.update({
		asset: images[key]
	}), textures)
})


// ===== objects =====

export const tilesSketch = getSketch(painter, 'tiles')
	.update({
		form, shade,
		uniforms: activeTiles.map(tile => ({
			transform: tile.transform,
			image: textures[tile.tileSpecId].texture(),
			color: tile.color,
			connections: tile.connections
		}))
	})



// ===== layers =====

export const scene = getDrawingLayer(painter, 'scene')
	.update({
		sketches: [tilesSketch],
		uniforms: {
			view: camera.state.view,
			projection: camera.state.perspective
		}
	})


if (module.hot) {
	module.hot.accept()
}
