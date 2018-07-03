import { Layer } from 'tvs-painter'
import { Form } from 'tvs-painter/dist/lib/form'
import { Painter } from 'tvs-painter/dist/lib/painter'
import { Shade } from 'tvs-painter/dist/lib/shade'
import { Sketch } from 'tvs-painter/dist/lib/sketch'

const forms: {[id: string]: Form} = {}
export function getForm(painter: Painter, id: string) {
	if (forms[id]) {
		return forms[id]
	}
	return forms[id] = painter.createForm()
}

const shades: {[id: string]: Shade} = {}
export function getShade(painter: Painter, id: string) {
	if (shades[id]) {
		return shades[id]
	}
	return shades[id] = painter.createShade()
}

const sketches: {[id: string]: Sketch} = {}
export function getSketch(painter: Painter, id: string) {
	if (sketches[id]) {
		return sketches[id]
	}
	return sketches[id] = painter.createSketch()
}

const drawingLayers: {[id: string]: Layer} = {}
export function getDrawingLayer(painter: Painter, id: string) {
	if (drawingLayers[id]) {
		return drawingLayers[id]
	}
	return drawingLayers[id] = painter.createDrawingLayer()
}

const staticLayers: {[id: string]: Layer} = {}
export function getStaticLayer(painter: Painter, id: string) {
	if (staticLayers[id]) {
		return staticLayers[id]
	}
	return staticLayers[id] = painter.createStaticLayer()
}

const effectLayers: {[id: string]: Layer} = {}
export function getEffectLayer(painter: Painter, id: string) {
	if (effectLayers[id]) {
		return effectLayers[id]
	}
	return effectLayers[id] = painter.createEffectLayer()
}
