import { val, stream } from 'tvs-flow/lib/utils/entity-reference'
import {/*sign,*/ randInt, normalRand } from 'tvs-libs/lib/math/core'
import { mat4, quat, GLVec, GLMat } from 'tvs-libs/lib/math/gl-matrix'
import { getRollQuat, getYawQuat } from 'tvs-libs/lib/math/geometry'
import { pickRandom, doTimes, yieldTimes } from 'tvs-libs/lib/utils/sequence'
import * as events from '../events'
import * as init from './init'
import * as camera from '../view/camera'
import * as constants from './constants'
import { Animation, createAnimation } from 'shared-utils/animation'


type Color = number[]
type Position = [number, number]

export interface TileState {
	gridIndex: Position
	pos: Position
	posOffset: Position
	tileSpecId: string
	tileSpec: constants.TileSpec
	turn: number
	flipped: boolean
	yawDirection: number
	yawDelay: number
	yaw: number
	rollDirection: number
	roll: number
	height: number
	color: Color
	rotation: GLVec
	transform: GLMat
	updateTransform: boolean
	neighbours: (TileState | undefined)[]
	connections: number[]
	connected: boolean
	rotateAnimation?: Animation
	connectionAnimations: (Animation | null)[]
	riseAnimation?: Animation
	flipAnimation?: Animation
}


function rotateHalf (part) {
	return -Math.cos(part * Math.PI * 2) * 0.5 + 0.5
}


function smooth (part) {
	return -Math.cos(part * Math.PI) * 0.5 + 0.5
}


function acc (part) {
	return part * part * part * part
}


function slow (part) {
	return Math.pow(part, 0.25)
}


const SIDES_INDEX = {
	UP: 0,
	RIGHT: 1,
	DOWN: 2,
	LEFT: 3
}


// const SIDES_KEY = {
//   0: 'UP',
//   1: 'RIGHT',
//   2: 'DOWN',
//   3: 'LEFT'
// }


// ===== basic properties =====

export const animationDuration = val(1700)

export const animationChance = val(0.0001)

export const liftHeight = val(2)

export const sinkHeight = val(-50)

export const flipped = val(false)


export const colCount = stream(
	[init.tileDensity.HOT, events.windowSize.HOT],
	(dens, size) => Math.floor(Math.pow(size.width / 1000, 0.5) * dens)
)


export const rowCount = stream(
	[colCount.HOT, camera.perspectiveSettings.HOT],
	(cols, camera) => Math.ceil(cols / camera.aspect)
)


camera.distance.react(
	[colCount.HOT, init.tileSize.HOT],
	(_, cols, size) => cols * size * 0.47
)


// ===== primary state =====

export const createTileState = function(
	set: { [id: string]: number },
	baseColor: Color,
	specs: { [id: string]: constants.TileSpec }
): TileState {

	const [r, g, b] = baseColor
	const color = [
		r + (normalRand() - 0.6) * 0.25,
		g + (normalRand() - 0.6) * 0.25,
		b + (normalRand() - 0.6) * 0.25
	]
	const turn = randInt(3)
	const tileSpecId = pickRandom(Object.keys(set))

	return {
		gridIndex: [0, 0],
		pos: [0, 0],
		posOffset: [0, 0],
		tileSpecId,
		tileSpec: specs[tileSpecId],
		turn,
		flipped: false,
		yawDirection: 0,
		yawDelay: 0,
		yaw: 0,
		rollDirection: 0,
		roll: turn * Math.PI / 2,
		height: 0,
		color,
		transform: mat4.create(),
		rotation: quat.create(),
		updateTransform: false,
		neighbours: [],
		connected: false,
		connections: [0, 0, 0, 0],
		connectionAnimations: []
	}
}


export const grid = val<TileState[][]>([[]])
	.react([
		colCount.HOT,
		rowCount.HOT,
		init.color.HOT,
		init.set.HOT,
		constants.specs.HOT
	], function(
		grid: TileState[][],
		newWidth: number,
		newHeight: number,
		color,
		set,
		specs
	) {

		const width = grid.length
		const height = grid[0].length

		const heightDiff = newHeight - height
		const widthDiff = newWidth - width

		// create new gid rows at top and bottom
		if (heightDiff > 0) {

			const up = Math.floor(heightDiff / 2)
			const down = heightDiff - up

			grid.forEach(row => {
				row.unshift(...yieldTimes(up, () => createTileState(set, color, specs)))
			})

			grid.forEach(row => {
				doTimes(down, () => row.push(createTileState(set, color, specs)))
			})
		}

		// create new grid columns left and right
		if (widthDiff > 0) {

			const left = Math.floor(widthDiff / 2)
			const right = widthDiff - left
			const currentHeight = Math.max(newHeight, height)

			grid.unshift(...yieldTimes(left, () =>
				yieldTimes(currentHeight, () => createTileState(set, color, specs)))
			)

			doTimes(right, () =>
				grid.push(yieldTimes(currentHeight, () => createTileState(set, color, specs)))
			)
		}

		if (widthDiff > 0 || heightDiff > 0) {

			for (let x = 0; x < grid.length; x++) {
				for (let y = 0; y < grid[x].length; y++) {
					const tile = grid[x][y]
					tile.gridIndex = [x, y]
					tile.neighbours[SIDES_INDEX.LEFT] = grid[x - 1] && grid[x - 1][y]
					tile.neighbours[SIDES_INDEX.RIGHT] = grid[x + 1] && grid[x + 1][y]
					tile.neighbours[SIDES_INDEX.UP] = grid[x][y - 1]
					tile.neighbours[SIDES_INDEX.DOWN] = grid[x][y + 1]
				}
			}
		}

		return grid
	})


export const activeTiles = stream([
	grid.HOT,
	colCount.HOT,
	rowCount.HOT
], (grid, cols, rows) => {

	const tiles: TileState[] = []
	const width = grid.length
	const height = grid[0].length
	const firstLeftIndex = -Math.floor(width / 2)
	const firstUpIndex = -Math.floor(height / 2)
	const widthDelta = width - cols
	let activeCols = Math.floor(widthDelta / 2)
	if ((width + 1) % 2 && widthDelta % 2) activeCols++
	const activeRows = Math.floor((height - rows) / 2)
	const offX = ((cols + 1) % 2) * 0.5
	const offY = (rows % 2) * 0.5 + 0.5

	doTimes(cols, x => {
		doTimes(rows, y => {
			const tile: TileState = grid[x + activeCols][y + activeRows]
			const [iX, iY] = tile.gridIndex
			tile.posOffset = [offX, offY]
			tile.updateTransform = true
			tile.yawDelay = (x + (rows - y + 1)) * 100
			tile.pos = [firstLeftIndex + iX, firstUpIndex + iY]
			tile.connected = !!(tile.height < 0.1 && tile.height > -0.1)
			tiles.push(tile)
		})
	})

	return tiles
})


export const updateActiveTiles = stream([
	activeTiles.COLD,
	events.tick.HOT,
	animationDuration.COLD,
	animationChance.COLD,
	liftHeight.COLD,
	sinkHeight.COLD,
	init.tileSize.COLD,
	flipped.COLD
], (tiles, tick, duration, chance, liftHeight, sinkHeight, size, flipped) => {

	const offset = size * 0.95

	for (const i in tiles) {
		const tile: TileState = tiles[i]

		if (!tile.rotateAnimation && Math.random() < chance) {
			//tile.rollDirection = sign(Math.random() - 0.5)
			tile.rollDirection = 1
			tile.connected = false

			tile.rotateAnimation = createAnimation({
				duration,
				easeFn: smooth,
				onUpdate: rot => {
					tile.roll += rot * Math.PI / 2 * tile.rollDirection
					tile.updateTransform = true
				},
				onComplete: () => {
					tile.rotateAnimation = undefined
				}
			})

			tile.riseAnimation = createAnimation({
				duration,
				easeFn: rotateHalf,
				onUpdate: rise => {
					tile.height += rise * liftHeight
					tile.updateTransform = true
				},
				onComplete: () => {
					tile.riseAnimation = undefined
					tile.connected = true
					tile.turn = tile.rollDirection > 0 ?
						(tile.turn + 1) % 4 :
						tile.rollDirection < 0 ?
							(tile.turn + 3) % 4 :
							tile.turn
				}
			})
		}

		if (flipped !== tile.flipped && !tile.flipAnimation) {
			tile.connected = false
			tile.flipAnimation = createAnimation({
				duration,
				easeFn: flipped ? acc : slow,
				delay: tile.yawDelay,
				onUpdate: rot => {
					tile.yaw += rot * Math.PI
					tile.height += rot * sinkHeight * (tile.flipped ? -1 : 1)
					tile.updateTransform = true
				},
				onComplete: () => {
					tile.flipAnimation = undefined
					tile.flipped = !tile.flipped
					tile.connected = !tile.rotateAnimation
					tile.connected = true
				}
			})
		}

		tile.rotateAnimation && tile.rotateAnimation(tick)
		tile.riseAnimation && tile.riseAnimation(tick)
		tile.flipAnimation && tile.flipAnimation(tick)

		if (tile.connected) {
			//console.log('tile position, turn: ', tile.pos, tile.turn, tile)
			for (let i = 0; i < 4; i++) {
				const index = (i + 4 - tile.turn) % 4
				const side = tile.tileSpec.connections[index]
				const neighbour = tile.neighbours[i]
				if (neighbour && neighbour.connected) {
					const neighbourSide = neighbour.tileSpec.connections[(i + 6 - neighbour.turn) % 4]
					tile.connections[index] = side && neighbourSide
				} else {
					tile.connections[index] = 0
				}
			}

		} else {
			for (let i = 0; i < 4; i++) {
				tile.connections[i] = 0
			}
		}

		if (tile.updateTransform) {
			tile.updateTransform = false
			quat.multiply(tile.rotation, getYawQuat([], tile.yaw), getRollQuat([], tile.roll))
			const [x, y] = tile.pos
			const [offX, offY] = tile.posOffset
			mat4.fromRotationTranslation(
				tile.transform,
				tile.rotation,
				[(x + offX) * offset, (y + offY) * offset, tile.height]
			)
		}
	}
	return tiles
})
