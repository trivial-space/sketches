import { randInt, normalRand } from 'tvs-libs/dist/lib/math/random'
import { mat4, quat } from 'gl-matrix'
import { getRollQuat, getYawQuat } from 'tvs-libs/dist/lib/math/geometry'
import { pickRandom, doTimes, times, map } from 'tvs-libs/dist/lib/utils/sequence'
import { sets, TileSpec, specs } from './data'
import { Animation } from 'shared-utils/animation'
import { addSystem, dispatch, set } from 'shared-utils/painterState'
import { State, events } from '../context'


type Color = number[]
type Position = [number, number]


class TileState {
	gridIndex: Position = [0, 0]
	pos: Position = [0, 0]
	posOffset: Position = [0, 0]
	transform = mat4.create()
	tileSpecId: string
	tileSpec: TileSpec
	turn: number
	roll: number
	color: Color
	neighbours: (TileState | undefined)[] = []
	rotateAnimation?: Animation
	connectionAnimations: (Animation | null)[] = []
	riseAnimation?: Animation
	flipAnimation?: Animation
	flipped = false
	yawDirection = 0
	yawDelay = 0
	yaw = 0
	rollDirection = 0
	height = 0
	rotation = quat.create()
	updateTransform = false
	connected = false
	connections = [0, 0, 0, 0]

	constructor(
		set: { [id: string]: number },
		baseColor: Color,
		specs: { [id: string]: TileSpec }
	) {
		const [r, g, b] = baseColor
		this.color = [
			r + (normalRand() - 0.6) * 0.25,
			g + (normalRand() - 0.6) * 0.25,
			b + (normalRand() - 0.6) * 0.25
		]
		this.tileSpecId = pickRandom(Object.keys(set))
		this.turn = randInt(3)
		this.tileSpec = specs[this.tileSpecId]

		this.roll = this.turn * Math.PI / 2
	}
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


export class Tiles {
	tileSize = 10
	tileDensity = 20
	color = [normalRand(), normalRand(), normalRand()]
	set = pickRandom(sets)
	animationDuration = 1700
	animationChance = 0.0001
	liftHeight = 2
	sinkHeight = -50
	flipped = false
	colCount = 0
	rowCount = 0
	images: { [id: string]: HTMLImageElement } = {}
	activeTiles: TileState[] = []
	grid: TileState[][] = []
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


// ===== basic properties =====

addSystem<State>('tiles', (e, s) => {
	const t = s.tiles

	switch (e) {
		case events.INIT:
			t.images = {}
			Promise.all(
				Object.values(map((_n, key) => new Promise(res => {
					const img = new Image()
					img.onload = res
					img.src = 'img/' + specs[key].file + '.jpg'
					t.images[key] = img
				}), t.set))
			).then(() => {
				dispatch(events.START)
				dispatch(events.RESIZE)
			})

		case events.RESIZE:
			const canvas = s.device.canvas
			const aspect = canvas.width / canvas.height
			t.colCount = Math.floor(Math.pow(canvas.width / 1000, 0.5) * t.tileDensity)
			t.rowCount = Math.ceil(t.colCount / aspect)
			makeGrid(t.colCount, t.rowCount, t.color, t.set, t.grid)
			createActiveTiles(t)

		case events.FRAME:
			updateActiveTiles(s.device.tpf, t)
	}
})


set<State>('tiles', new Tiles())


// ===== primary state =====

function makeGrid(
	newWidth: number,
	newHeight: number,
	color: Color,
	set,
	grid: TileState[][]
) {

	const width = grid.length
	const height = grid[0] && grid[0].length || 0

	const heightDiff = newHeight - height
	const widthDiff = newWidth - width

	const createTile = () => new TileState(set, color, specs)

	// create new grid columns left and right
	if (widthDiff > 0) {

		const left = Math.floor(widthDiff / 2)
		const right = widthDiff - left
		const currentHeight = Math.max(newHeight, height)

		const newCol = () => times(createTile, currentHeight)

		grid.unshift(...times(newCol, left))
		grid.push(...times(newCol, right))
	}

	// create new gid rows at top and bottom
	if (heightDiff > 0) {

		const up = Math.floor(heightDiff / 2)
		const down = heightDiff - up

		grid.forEach(row => {
			row.unshift(...times(createTile, up))
			row.push(...times(createTile, down))
		})
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
}


function createActiveTiles (t: Tiles) {
	const tiles = t.activeTiles = [] as TileState[]
	const width = t.grid.length
	const height = t.grid[0].length
	const firstLeftIndex = -Math.floor(width / 2)
	const firstUpIndex = -Math.floor(height / 2)
	const widthDelta = width - t.colCount
	let activeCols = Math.floor(widthDelta / 2)
	if ((width + 1) % 2 && widthDelta % 2) activeCols++
	const activeRows = Math.floor((height - t.rowCount) / 2)
	const offX = ((t.colCount + 1) % 2) * 0.5
	const offY = (t.rowCount % 2) * 0.5 + 0.5

	doTimes(x => {
		doTimes(y => {
			const tile = t.grid[x + activeCols][y + activeRows]
			if (tile) {
				const [iX, iY] = tile.gridIndex
				tile.posOffset = [offX, offY]
				tile.updateTransform = true
				tile.yawDelay = (x + (t.rowCount - y + 1)) * 100
				tile.pos = [firstLeftIndex + iX, firstUpIndex + iY]
				tile.connected = !!(tile.height < 0.1 && tile.height > -0.1)
				tiles.push(tile)
			}
		}, t.rowCount)
	}, t.colCount)

	dispatch(events.NEW_ACTIVE_TILES)
}


export function updateActiveTiles (tpf: number, t: Tiles) {
	const tiles = t.activeTiles
	const duration = t.animationDuration
	const chance = t.animationChance
	const size = t.tileSize

	const offset = size * 0.95

	for (const i in tiles) {
		const tile: TileState = tiles[i]

		if (!tile.rotateAnimation && Math.random() < chance) {
			//tile.rollDirection = sign(Math.random() - 0.5)
			tile.rollDirection = 1
			tile.connected = false

			tile.rotateAnimation = new Animation({
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

			tile.riseAnimation = new Animation({
				duration,
				easeFn: rotateHalf,
				onUpdate: rise => {
					tile.height += rise * t.liftHeight
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

		if (t.flipped !== tile.flipped && !tile.flipAnimation) {
			tile.connected = false
			tile.flipAnimation = new Animation({
				duration,
				easeFn: t.flipped ? acc : slow,
				delay: tile.yawDelay,
				onUpdate: rot => {
					tile.yaw += rot * Math.PI
					tile.height += rot * t.sinkHeight * (tile.flipped ? -1 : 1)
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

		tile.rotateAnimation && tile.rotateAnimation.update(tpf)
		tile.riseAnimation && tile.riseAnimation.update(tpf)
		tile.flipAnimation && tile.flipAnimation.update(tpf)

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
			quat.multiply(tile.rotation, getYawQuat(tile.yaw) as quat, getRollQuat(tile.roll) as quat)
			const [x, y] = tile.pos
			const [offX, offY] = tile.posOffset
			mat4.fromRotationTranslation(
				tile.transform,
				tile.rotation,
				[(x + offX) * offset, (y + offY) * offset, tile.height]
			)
		}
	}
}
