import {/*sign,*/ randInt, normalRand} from 'tvs-libs/lib/math/core'
import {val, stream} from 'tiles/flow'
import {mat4, quat, GLVec, GLMat} from 'tvs-libs/lib/math/gl-matrix'
import {getRollQuat, getYawQuat} from 'tvs-libs/lib/math/geometry'
import {pick, doTimes, yieldTimes} from 'tvs-libs/lib/utils/sequence'
import * as events from '../events'
import * as init from './init'
import * as camera from '../view/camera'
import * as constants from './constants'


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
  yawProgress?: number
  yawDirection: number
  yawDelay: number
  yaw: number
  rollProgress?: number
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
}


function delta (t1, t2, tMax, fn) {
  return fn(t2 / tMax) - fn(t1 / tMax)
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
  [colCount.HOT, camera.aspect.HOT],
  (cols, aspect) => Math.ceil(cols / aspect)
)


camera.distance.react(
  [colCount.HOT, init.tileSize.HOT],
  (_, cols, size) => cols * size * 0.47
)


// ===== primary state =====

export const createTileState = val(function(
  set: {[id: string]: number},
  baseColor: Color,
  specs: {[id: string]: constants.TileSpec}
): TileState {

  const [r, g, b] = baseColor
  const color = [
    r + (normalRand() - 0.6) * 0.25,
    g + (normalRand() - 0.6) * 0.25,
    b + (normalRand() - 0.6) * 0.25,
  ]
  const turn = randInt(3)
  const tileSpecId = pick(Object.keys(set))

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
    connections: [0, 0, 0, 0],
    connected: false
  }
})


export const grid = val<TileState[][]>([[]])
  .react(
    "fillGrid",
    [
      colCount.HOT,
      rowCount.HOT,
      init.color.HOT,
      init.set.HOT,
      constants.specs.HOT,
      createTileState.HOT
    ], function(
      grid: TileState[][],
      newWidth: number,
      newHeight: number,
      color,
      set,
      specs,
      create
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
          row.unshift(...yieldTimes(up, () => create(set, color, specs)))
        })

        grid.forEach(row => {
          doTimes(down, () => row.push(create(set, color, specs)))
        })
      }

      // create new grid columns left and right
      if (widthDiff > 0) {

        const left = Math.floor(widthDiff / 2)
        const right = widthDiff - left
        const currentHeight = Math.max(newHeight, height)

        grid.unshift(...yieldTimes(left, () =>
          yieldTimes(currentHeight, () => create(set, color, specs)))
        )

        doTimes(right, () =>
          grid.push(yieldTimes(currentHeight, () => create(set, color, specs)))
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
    }
  )


export const activeTiles = stream(
  [
    grid.HOT,
    colCount.HOT,
    rowCount.HOT
  ],
  (grid, cols, rows) => {

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
        tile.yawProgress = -tile.yawDelay
        tile.pos = [firstLeftIndex + iX, firstUpIndex + iY]
        tile.connected = !!(tile.height < 0.1 && tile.height > -0.1)
        tiles.push(tile)
      })
    })

    return tiles
  }
)


export const updateActiveTiles = stream(
    'animateTiles',
    [
      activeTiles.COLD,
      events.tick.HOT,
      animationDuration.COLD,
      animationChance.COLD,
      liftHeight.COLD,
      sinkHeight.COLD,
      init.tileSize.COLD,
      flipped.COLD,
    ],
    (tiles, tick, dur, chance, liftHeight, sinkHeight, size, flipped) => {

      const offset = size * 0.95

      for (let i in tiles) {
        const tile: TileState = tiles[i]

        // init animation once
        if (tile.rollProgress == null) {
          tile.rollProgress = 0

        // randomly start animation
        } else if (tile.rollProgress === 0) {
          if (Math.random() < chance) {
            tile.rollProgress = tick
            //tile.rollDirection = sign(Math.random() - 0.5)
            tile.rollDirection = 1
            const rot = delta(0, tick, dur, smooth)
            const off = delta(0, tick, dur, rotateHalf)
            tile.roll += rot * Math.PI / 2 * tile.rollDirection
            tile.height += off * liftHeight
            tile.updateTransform = true
            tile.connected = false
          }

        // animation in progress
        } else if (tile.rollProgress < dur - tick) {
          const oldProgress = tile.rollProgress
          tile.rollProgress += tick
          const rot = delta(oldProgress, tile.rollProgress, dur, smooth)
          const off = delta(oldProgress, tile.rollProgress, dur, rotateHalf)
          tile.roll += rot * Math.PI / 2 * tile.rollDirection
          tile.height += off * liftHeight
          tile.updateTransform = true
          tile.connected = false

        // end and reset animation
        } else {
          const rot = delta(tile.rollProgress, dur, dur, smooth)
          const off = delta(tile.rollProgress, dur, dur, rotateHalf)
          tile.roll += rot * Math.PI / 2 * tile.rollDirection
          tile.rollProgress = 0
          tile.height += off * liftHeight
          tile.updateTransform = true
          tile.connected = true
          for (let i = 0; i < 4; i++) {
            tile.connections[i] = 0
          }
          tile.turn = tile.rollDirection > 0 ?
            (tile.turn + 1) % 4 :
            tile.rollDirection < 0 ?
              (tile.turn + 3) % 4 :
              tile.turn
        }


        if (flipped) {
          if (!tile.flipped && tile.yawProgress != null) {

            if (tile.yawProgress < 0) {
              tile.yawProgress += Math.min(tick, -tile.yawProgress)

            } else if (tile.yawProgress === 0) {
              tile.yawProgress = tick
              const rot = delta(0, tick, dur, acc)
              tile.yaw += rot * Math.PI
              tile.height += rot * sinkHeight
              tile.updateTransform = true
              tile.connected = false

            } else if (tile.yawProgress < dur - tick) {
              const oldProgress = tile.yawProgress
              tile.yawProgress += tick
              const rot = delta(oldProgress, tile.yawProgress, dur, acc)
              tile.yaw += rot * Math.PI
              tile.height += rot * sinkHeight
              tile.updateTransform = true
              tile.connected = false

            } else {
              const rot = delta(tile.yawProgress, dur, dur, acc)
              tile.yaw += rot * Math.PI
              tile.yawProgress = -tile.yawDelay
              tile.height += rot * sinkHeight
              tile.flipped = true
              tile.updateTransform = true
              tile.connected = true
              for (let i = 0; i < 4; i++) {
                tile.connections[i] = 0
              }
            }
          }

        } else {
          if (tile.flipped && tile.yawProgress != null) {

            if (tile.yawProgress < 0) {
              tile.yawProgress += Math.min(tick, -tile.yawProgress)

            } else if (tile.yawProgress === 0) {
              tile.yawProgress = tick
              const rot = delta(0, tick, dur, slow)
              tile.yaw += rot * Math.PI
              tile.height -= rot * sinkHeight
              tile.updateTransform = true
              tile.connected = false

            } else if (tile.yawProgress < dur - tick) {
              const oldProgress = tile.yawProgress
              tile.yawProgress += tick
              const rot = delta(oldProgress, tile.yawProgress, dur, slow)
              tile.yaw += rot * Math.PI
              tile.height -= rot * sinkHeight
              tile.updateTransform = true
              tile.connected = false

            } else {
              const rot = delta(tile.yawProgress, dur, dur, slow)
              tile.yaw += rot * Math.PI
              tile.yawProgress = -tile.yawDelay
              tile.height -= rot * sinkHeight
              tile.flipped = false
              tile.updateTransform = true
              tile.connected = !tile.rollProgress
              for (let i = 0; i < 4; i++) {
                tile.connections[i] = 0
              }
            }
          }
        }

        if (tile.connected) {
          //console.log('tile position, turn: ', tile.pos, tile.turn, tile)
          for (let i = 0; i < 4; i++) {
            if (tile.tileSpec.connections[i]) {
              //console.log('side index', i)
              const side = (4 + i - tile.turn) % 4
              const opposite = (side + 2) % 4
              //console.log('computed side, opposite', side, opposite)
              const neighbour = tile.neighbours[side]
              //console.log('neighbour position', neighbour && neighbour.pos)
              //console.log('neighbour opposite',
               //   neighbour && neighbour.tileSpec.connections[(opposite + neighbour.turn) % 4]
              //)
              if (tile.connections[i] > 0) {

              } else if (neighbour && neighbour.connected &&
                  tile.connections[i] === 0 &&
                  neighbour.tileSpec.connections[(opposite + neighbour.turn) % 4]
                  ) {
                tile.connections[i] = 1
                neighbour.connections[(opposite + neighbour.turn) % 4] = 0
              } else {
                tile.connections[i] = -1
              }
            }
          }

        } else {
          for (let i = 0; i < 4; i++) {
            tile.connections[i] = -1;
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
    }
  )


export const getTileId = n => 'tile' + n

export const ids = stream(
  [activeTiles.HOT],
  (tiles) => tiles.map((_, i) => getTileId(i))
)
