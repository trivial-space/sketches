import {entity, addToFlow} from '../flow'
import * as flowCamera from 'tvs-libs/lib/vr/flow-camera'
import {Keys, KeyState} from 'tvs-libs/lib/events/keyboard'
import {mat4} from 'tvs-libs/lib/math/gl-matrix'
// import {MouseState} from 'tvs-libs/lib/events/mouse'


const camera: Spec = flowCamera.camera


camera['props.fovy'].val = Math.PI * 0.4

camera['position'].val[2] = 0


camera['props.aspect'].stream = {
  with: {
    size: 'H renderer.canvasSize' },
  do: ({size}) => size.width / size.height }


camera['props.moveSpeed'] = { val: 0.05 }

camera['props.lookSpeed'] = { val: 0.003 }


camera['props.moveForward'].stream = {
  async: true,
  with: {
    tick: 'H events.tick',
    keys: 'C events.keys',
    speed: 'C #props.moveSpeed' },
  do: ({keys, speed}: {keys: KeyState, speed: number}, send) => {

    if (!keys) return
    if (keys[Keys.UP] || keys[Keys.W]) {
      send(speed)
    }
    if (keys[Keys.DOWN] || keys[Keys.S]) {
      send(-speed)
    }
  } }


camera['props.moveLeft'].stream = {
  async: true,
  with: {
    tick: 'H events.tick',
    keys: 'C events.keys',
    speed: 'C #props.moveSpeed' },
  do: ({keys, speed}: {keys: KeyState, speed: number}, send) => {

    if (!keys) return
    if (keys[Keys.LEFT] || keys[Keys.A]) {
      send(speed)
    }
    if (keys[Keys.RIGHT] || keys[Keys.D]) {
      send(-speed)
    }
  } }


camera['props.rotationY'].stream = {
  with: {
    drag: 'H events.mouseDrag',
    speed: 'C #props.lookSpeed',
    rot: 'A' },
  do: ({drag, speed, rot}) => drag ? rot + drag.x * speed : rot }


camera['props.rotationX'].stream = {
  with: {
    drag: 'H events.mouseDrag',
    speed: 'C #props.lookSpeed',
    rot: 'A' },
  do: ({drag, speed, rot}) => drag ? rot + drag.y * speed : rot }


camera['groundMirrorView'] = {
  val: mat4.create(),
  stream: {
    with: {
      mat: 'A',
      view: 'H #view',
      mirrorMatrix: 'H objects.ground.mirrorMatrix' },

    do: ({mat, view, mirrorMatrix}) => mat4.multiply(mat, view, mirrorMatrix) } }



flow.addGraph(toGraph(camera, 'camera'))
console.log('adding graph: camera')
