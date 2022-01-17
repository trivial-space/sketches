import {mat4, quat} from "../../../_snowpack/pkg/gl-matrix.js";
import {pushTransition} from "../../../_snowpack/link/src/shared-utils/transitions.js";
import {sign} from "../../../_snowpack/link/projects/libs/dist/math/core.js";
import {getRollQuat, getYawQuat} from "../../../_snowpack/link/projects/libs/dist/math/geometry.js";
import {normalRand, randInt} from "../../../_snowpack/link/projects/libs/dist/math/random.js";
import {doTimes, pickRandom, times} from "../../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {events, Q} from "../context.js";
import {sets, specs} from "./data.js";
import {mapObj} from "../../../_snowpack/link/projects/libs/dist/utils/object.js";
export class Tiles {
  constructor() {
    this.tileSize = 3;
    this.tileDensity = 11;
    this.color = [normalRand(), normalRand(), normalRand()];
    this.set = pickRandom(sets);
    this.animationDuration = 1700;
    this.animationChance = 0.01;
    this.liftHeight = 1;
    this.sinkHeight = -100;
    this.flipped = false;
    this.colCount = 0;
    this.rowCount = 0;
    this.images = {};
    this.activeTiles = [];
    this.grid = [];
  }
}
class TileState {
  constructor(set, baseColor, specs2) {
    this.gridIndex = [0, 0];
    this.pos = [0, 0];
    this.posOffset = [0, 0];
    this.transform = mat4.create();
    this.neighbours = [];
    this.flipped = false;
    this.yawDirection = 0;
    this.yawDelay = 0;
    this.yaw = 0;
    this.height = 0;
    this.rotation = quat.create();
    this.updateTransform = false;
    this.connections = [0, 0, 0, 0];
    const [r, g, b] = baseColor;
    this.color = [
      r + (normalRand() - 0.6) * 0.25,
      g + (normalRand() - 0.6) * 0.25,
      b + (normalRand() - 0.6) * 0.25
    ];
    this.tileSpecId = pickRandom(Object.keys(set));
    this.turn = randInt(3);
    this.tileSpec = specs2[this.tileSpecId];
    this.roll = this.turn * Math.PI / 2;
  }
  isConnected() {
    return !!(this.height < 0.1 && this.height > -0.1);
  }
  connect() {
    for (let i = 0; i < 4; i++) {
      const index = (i + 4 - this.turn) % 4;
      const side = this.tileSpec.connections[index];
      const neighbour = this.neighbours[i];
      const nIndex = neighbour ? (i + 6 - neighbour.turn) % 4 : 0;
      const current = this.connections[index];
      let next;
      if (this.isConnected() && neighbour && neighbour.isConnected()) {
        const neighbourSide = neighbour.tileSpec.connections[nIndex];
        next = side && neighbourSide;
      } else {
        next = 0;
      }
      if (current !== next) {
        next === 0 ? pushTransition(Q, {
          duration: 300,
          onUpdate: (p) => {
            this.connections[index] = Math.max(0, this.connections[index] - p);
            if (neighbour) {
              neighbour.connections[nIndex] = Math.max(0, neighbour.connections[nIndex] - p);
            }
          }
        }) : pushTransition(Q, {
          duration: 300,
          onUpdate: (p) => {
            this.connections[index] = Math.min(1, this.connections[index] + p);
            if (neighbour) {
              neighbour.connections[nIndex] = Math.min(1, neighbour.connections[nIndex] + p);
            }
          }
        });
      }
    }
  }
  disconnect() {
    for (let i = 0; i < 4; i++) {
      const neighbour = this.neighbours[i];
      const nIndex = neighbour ? (i + 6 - neighbour.turn) % 4 : 0;
      pushTransition(Q, {
        duration: 300,
        onUpdate: (p) => {
          this.connections[i] = Math.max(0, this.connections[i] - p);
          if (neighbour) {
            neighbour.connections[nIndex] = Math.max(0, neighbour.connections[nIndex] - p);
          }
        }
      });
    }
  }
}
const SIDES_INDEX = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};
function rotateHalf(part) {
  return -Math.cos(part * Math.PI * 2) * 0.5 + 0.5;
}
function smooth(part) {
  return -Math.cos(part * Math.PI) * 0.5 + 0.5;
}
function acc(part) {
  return part * part * part * part;
}
function slow(part) {
  return Math.pow(part, 0.25);
}
Q.listen("tiles", events.INIT, ({tiles: t}) => {
  t.images = {};
  Promise.all(Object.values(mapObj((_n, key) => new Promise((res) => {
    const img = new Image();
    img.onload = res;
    img.src = "img/" + specs[key].file + ".jpg";
    t.images[key] = img;
  }), t.set))).then(() => {
    Q.emit(events.ON_IMAGES_LOADED);
    Q.emit(events.RESIZE);
  });
  return;
});
Q.listen("tiles", events.RESIZE, ({tiles: t, ...s}) => {
  const canvas = s.device.canvas;
  const aspect = canvas.width / canvas.height;
  t.colCount = Math.floor(Math.pow(canvas.width / 1e3, 0.5) * t.tileDensity);
  t.rowCount = Math.ceil(t.colCount / aspect);
  makeGrid(t.colCount, t.rowCount, t.color, t.set, t.grid);
  createActiveTiles(t);
});
Q.listen("tiles", events.FRAME, ({tiles: t}) => {
  updateTiles(t);
});
Q.set("tiles", new Tiles());
function makeGrid(newWidth, newHeight, color, set, grid) {
  const width = grid.length;
  const height = grid[0] && grid[0].length || 0;
  const heightDiff = newHeight - height;
  const widthDiff = newWidth - width;
  const createTile = () => new TileState(set, color, specs);
  if (widthDiff > 0) {
    const left = Math.floor(widthDiff / 2);
    const right = widthDiff - left;
    const currentHeight = Math.max(newHeight, height);
    const newCol = () => times(createTile, currentHeight);
    grid.unshift(...times(newCol, left));
    grid.push(...times(newCol, right));
  }
  if (heightDiff > 0) {
    const up = Math.floor(heightDiff / 2);
    const down = heightDiff - up;
    grid.forEach((row) => {
      row.unshift(...times(createTile, up));
      row.push(...times(createTile, down));
    });
  }
  if (widthDiff > 0 || heightDiff > 0) {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        const tile = grid[x][y];
        tile.gridIndex = [x, y];
        tile.neighbours[SIDES_INDEX.LEFT] = grid[x - 1] && grid[x - 1][y];
        tile.neighbours[SIDES_INDEX.RIGHT] = grid[x + 1] && grid[x + 1][y];
        tile.neighbours[SIDES_INDEX.UP] = grid[x][y - 1];
        tile.neighbours[SIDES_INDEX.DOWN] = grid[x][y + 1];
      }
    }
  }
}
function createActiveTiles(t) {
  const tiles = t.activeTiles = [];
  const width = t.grid.length;
  const height = t.grid[0].length;
  const firstLeftIndex = -Math.floor(width / 2);
  const firstUpIndex = -Math.floor(height / 2);
  const widthDelta = width - t.colCount;
  let activeCols = Math.floor(widthDelta / 2);
  if ((width + 1) % 2 && widthDelta % 2)
    activeCols++;
  const activeRows = Math.floor((height - t.rowCount) / 2);
  const offX = (t.colCount + 1) % 2 * 0.5;
  const offY = t.rowCount % 2 * 0.5 + 0.5;
  doTimes((x) => {
    doTimes((y) => {
      const tile = t.grid[x + activeCols][y + activeRows];
      if (tile) {
        const [iX, iY] = tile.gridIndex;
        tile.posOffset = [offX, offY];
        tile.updateTransform = true;
        tile.yawDelay = (x + (t.rowCount - y + 1)) * 100;
        tile.pos = [firstLeftIndex + iX, firstUpIndex + iY];
        tiles.push(tile);
      }
    }, t.rowCount);
  }, t.colCount);
  tiles.forEach((t2) => t2.connect());
  Q.emit(events.NEW_ACTIVE_TILES);
}
export function updateTiles(t) {
  const tiles = t.activeTiles;
  const duration = t.animationDuration;
  const chance = t.animationChance / t.activeTiles.length;
  const offset = t.tileSize * 0.95;
  for (const i in tiles) {
    const tile = tiles[i];
    if (Math.random() < chance) {
      tile.disconnect();
      const dir = sign(Math.random() - 0.5);
      pushTransition(Q, {
        duration,
        easeFn: smooth,
        onUpdate: (rot) => {
          tile.roll += rot * Math.PI / 2 * dir;
          tile.updateTransform = true;
        },
        onComplete: () => {
          tile.turn = dir > 0 ? (tile.turn + 1) % 4 : dir < 0 ? (tile.turn + 3) % 4 : tile.turn;
          tile.connect();
        }
      });
      pushTransition(Q, {
        duration,
        easeFn: rotateHalf,
        onUpdate: (rise) => {
          tile.height += rise * t.liftHeight;
          tile.updateTransform = true;
        }
      });
    }
    if (t.flipped !== tile.flipped) {
      tile.flipped = t.flipped;
      pushTransition(Q, {
        duration,
        easeFn: t.flipped ? acc : slow,
        delay: tile.yawDelay,
        onStart: () => tile.disconnect(),
        onUpdate: (rot) => {
          tile.yaw += rot * Math.PI;
          tile.height += rot * t.sinkHeight * (tile.flipped ? 1 : -1);
          tile.updateTransform = true;
        },
        onComplete: () => {
          if (!tile.flipped) {
            tile.connect();
          }
        }
      });
    }
    if (tile.updateTransform) {
      tile.updateTransform = false;
      quat.multiply(tile.rotation, getYawQuat(tile.yaw), getRollQuat(tile.roll));
      const [x, y] = tile.pos;
      const [offX, offY] = tile.posOffset;
      mat4.fromRotationTranslation(tile.transform, tile.rotation, [
        (x + offX) * offset,
        (y + offY) * offset,
        tile.height
      ]);
    }
  }
}
