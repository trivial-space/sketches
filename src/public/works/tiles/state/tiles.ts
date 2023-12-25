import { mat4, quat } from 'gl-matrix'
import { pushTransition } from '../../../../shared-utils/transitions'
import { sign } from 'tvs-libs/dist/math/core'
import { getZRotQuat, getYRotQuat } from 'tvs-libs/dist/math/geometry'
import { normalRand01, randInt } from 'tvs-libs/dist/math/random'
import { doTimes, pickRandom, times } from 'tvs-libs/dist/utils/sequence'
import { events, Q } from '../context'
import { Set, sets, specs, TileSpec } from './data'
import { mapObj } from 'tvs-libs/dist/utils/object'

type Color = number[]
type Position = [number, number]

export class Tiles {
	tileSize = 3
	tileDensity = 11
	color = [normalRand01(), normalRand01(), normalRand01()]
	set = pickRandom(sets)
	animationDuration = 1700
	animationChance = 0.01
	liftHeight = 1
	sinkHeight = -100
	flipped = false
	colCount = 0
	rowCount = 0
	images: { [id: string]: HTMLImageElement } = {}
	activeTiles: TileState[] = []
	grid: TileState[][] = []
}

class TileState {
	gridIndex: Position = [0, 0]
	pos: Position = [0, 0]
	posOffset: Position = [0, 0]
	transform = mat4.create()
	tileSpecId: string
	tileSpec: TileSpec
	turn: number
	zRot: number
	color: Color
	neighbours: (TileState | undefined)[] = []
	flipped = false
	yRotDirection = 0
	yRotDelay = 0
	yRot = 0
	height = 0
	rotation = quat.create()
	updateTransform = false
	connections = [0, 0, 0, 0]

	constructor(
		set: { [id: string]: number },
		baseColor: Color,
		specs: { [id: string]: TileSpec },
	) {
		const [r, g, b] = baseColor
		this.color = [
			r + (normalRand01() - 0.6) * 0.25,
			g + (normalRand01() - 0.6) * 0.25,
			b + (normalRand01() - 0.6) * 0.25,
		]
		this.tileSpecId = pickRandom(Object.keys(set))
		this.turn = randInt(3)
		this.tileSpec = specs[this.tileSpecId]

		this.zRot = (this.turn * Math.PI) / 2
	}

	isConnected() {
		return !!(this.height < 0.1 && this.height > -0.1)
	}

	connect() {
		for (let i = 0; i < 4; i++) {
			const index = (i + 4 - this.turn) % 4
			const side = this.tileSpec.connections[index]
			const neighbour = this.neighbours[i]
			const nIndex = neighbour ? (i + 6 - neighbour.turn) % 4 : 0
			const current = this.connections[index]
			let next: number
			if (this.isConnected() && neighbour && neighbour.isConnected()) {
				const neighbourSide = neighbour.tileSpec.connections[nIndex]
				next = side && neighbourSide
			} else {
				next = 0
			}
			if (current !== next) {
				next === 0
					? pushTransition(Q, {
							duration: 300,
							onUpdate: (p) => {
								this.connections[index] = Math.max(
									0,
									this.connections[index] - p,
								)
								if (neighbour) {
									neighbour.connections[nIndex] = Math.max(
										0,
										neighbour.connections[nIndex] - p,
									)
								}
							},
					  })
					: pushTransition(Q, {
							duration: 300,
							onUpdate: (p) => {
								this.connections[index] = Math.min(
									1,
									this.connections[index] + p,
								)
								if (neighbour) {
									neighbour.connections[nIndex] = Math.min(
										1,
										neighbour.connections[nIndex] + p,
									)
								}
							},
					  })
			}
		}
	}

	disconnect() {
		for (let i = 0; i < 4; i++) {
			const neighbour = this.neighbours[i]
			const nIndex = neighbour ? (i + 6 - neighbour.turn) % 4 : 0
			pushTransition(Q, {
				duration: 300,
				onUpdate: (p) => {
					this.connections[i] = Math.max(0, this.connections[i] - p)
					if (neighbour) {
						neighbour.connections[nIndex] = Math.max(
							0,
							neighbour.connections[nIndex] - p,
						)
					}
				},
			})
		}
	}
}

const SIDES_INDEX = {
	UP: 0,
	RIGHT: 1,
	DOWN: 2,
	LEFT: 3,
}

function rotateHalf(part: number) {
	return -Math.cos(part * Math.PI * 2) * 0.5 + 0.5
}

function smooth(part: number) {
	return -Math.cos(part * Math.PI) * 0.5 + 0.5
}

function acc(part: number) {
	return part * part * part * part
}

function slow(part: number) {
	return Math.pow(part, 0.25)
}

// ===== basic properties =====
function getImageUrl(name: string) {
	return new URL(`../img/${name}.jpg`, import.meta.url).href
}

Q.listen('tiles', events.INIT, ({ tiles: t }) => {
	t.images = {}
	Promise.all(
		Object.values(
			mapObj(
				(_n, key) =>
					new Promise((res) => {
						const img = new Image()
						img.onload = res
						img.src = getImageUrl(specs[key].file)
						t.images[key] = img
					}),
				t.set,
			),
		),
	).then(() => {
		Q.emit(events.ON_IMAGES_LOADED)
		Q.emit(events.RESIZE)
	})
	return
})

Q.listen('tiles', events.RESIZE, ({ tiles: t, ...s }) => {
	const canvas = s.device.canvas
	const aspect = canvas.width / canvas.height
	t.colCount = Math.floor(
		Math.pow(canvas.width / s.device.sizeMultiplier / 1000, 0.5) *
			t.tileDensity,
	)
	t.rowCount = Math.ceil(t.colCount / aspect)
	makeGrid(t.colCount, t.rowCount, t.color, t.set, t.grid)
	createActiveTiles(t)
})

Q.listen('tiles', events.FRAME, ({ tiles: t }) => {
	updateTiles(t)
})

Q.set('tiles', new Tiles())

// ===== primary state =====

function makeGrid(
	newWidth: number,
	newHeight: number,
	color: Color,
	set: Set,
	grid: TileState[][],
) {
	const width = grid.length
	const height = (grid[0] && grid[0].length) || 0

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

		grid.forEach((row) => {
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

function createActiveTiles(t: Tiles) {
	const tiles = (t.activeTiles = [] as TileState[])
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

	doTimes((x) => {
		doTimes((y) => {
			const tile = t.grid[x + activeCols][y + activeRows]
			if (tile) {
				const [iX, iY] = tile.gridIndex
				tile.posOffset = [offX, offY]
				tile.updateTransform = true
				tile.yRotDelay = (x + (t.rowCount - y + 1)) * 100
				tile.pos = [firstLeftIndex + iX, firstUpIndex + iY]
				tiles.push(tile)
			}
		}, t.rowCount)
	}, t.colCount)

	tiles.forEach((t) => t.connect())

	Q.emit(events.NEW_ACTIVE_TILES)
}

export function updateTiles(t: Tiles) {
	const tiles = t.activeTiles
	const duration = t.animationDuration
	const chance = t.animationChance / t.activeTiles.length
	const offset = t.tileSize * 0.95

	for (const i in tiles) {
		const tile: TileState = tiles[i]

		if (Math.random() < chance) {
			tile.disconnect()
			const dir = sign(Math.random() - 0.5)

			pushTransition(Q, {
				duration,
				easeFn: smooth,
				onUpdate: (rot) => {
					tile.zRot += ((rot * Math.PI) / 2) * dir
					tile.updateTransform = true
				},
				onComplete: () => {
					tile.turn =
						dir > 0
							? (tile.turn + 1) % 4
							: dir < 0
							? (tile.turn + 3) % 4
							: tile.turn
					tile.connect()
				},
			})

			pushTransition(Q, {
				duration,
				easeFn: rotateHalf,
				onUpdate: (rise) => {
					tile.height += rise * t.liftHeight
					tile.updateTransform = true
				},
			})
		}

		if (t.flipped !== tile.flipped) {
			tile.flipped = t.flipped
			pushTransition(Q, {
				duration,
				easeFn: t.flipped ? acc : slow,
				delay: tile.yRotDelay,
				onStart: () => tile.disconnect(),
				onUpdate: (rot) => {
					tile.yRot += rot * Math.PI
					tile.height += rot * t.sinkHeight * (tile.flipped ? 1 : -1)
					tile.updateTransform = true
				},
				onComplete: () => {
					if (!tile.flipped) {
						tile.connect()
					}
				},
			})
		}

		if (tile.updateTransform) {
			tile.updateTransform = false
			quat.multiply(
				tile.rotation,
				getYRotQuat(tile.yRot) as quat,
				getZRotQuat(tile.zRot) as quat,
			)
			const [x, y] = tile.pos
			const [offX, offY] = tile.posOffset
			mat4.fromRotationTranslation(tile.transform, tile.rotation, [
				(x + offX) * offset,
				(y + offY) * offset,
				tile.height,
			])
		}
	}
}
