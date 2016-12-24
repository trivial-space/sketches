import {entity, addToFlow} from 'flow'
import {renderer} from 'tvs-renderer'
import {mat4} from 'tvs-libs/lib/math/gl-matrix'
import * as geo from 'tvs-libs/lib/math/geometry'


const spec: Spec = {

  'id': {val: 'ground'},

  'position': {val: [0, -3.4, 0]},

  'normal': {val: [0, 1, 0]},

  'scale': {val: 10},


  'transform': {
    val: mat4.create(),
    stream: {
      with: {
        pos: 'H #position',
        scale: 'H #scale',
        mat: 'A' },

      do: ({pos, scale, mat}) => {

        mat4.fromTranslation(mat, pos)
        mat4.rotateX(mat, mat, Math.PI / 2)
        return mat4.scale(mat, mat, [scale, scale, scale]) } } },


  'planeEquation': {
    stream: {
      with: {
        normal: 'H #normal',
        pos: 'H #position' },
      do: ({normal, pos}) => geo.planeFromNormalAndCoplanarPoint(normal, pos) } },


  'mirrorMatrix':  {
    stream: {
      with: {
        plane: 'H #planeEquation' },
      do: ({plane}) => geo.mirrorMatrixFromPlane(plane) } },


  'update': {
    stream: {
      with: {
        ctx: 'H renderer.context',
        id: 'H #id',
        shaderId: 'H shaders.ground.id',
        geoId: 'H geometries.plane.id',
        size: 'H renderer.canvasSize',
        transform: 'H #transform' },

      do: ({id, ctx, shaderId, geoId, transform, size}) => {

        renderer.updateObject(ctx, id, {
          shader: shaderId,
          geometry: geoId,
          uniforms: {
            transform,
            size: [size.width, size.height]
          }
        }) } } } }


flow.addGraph(toGraph(spec, 'objects.ground'))
console.log('adding graph: objects.ground')
