import { Painter, Form, Shade, Sketch, Layer } from 'tvs-painter'

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
