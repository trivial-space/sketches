import {entity, addToFlow} from 'flow'
import {renderer} from 'tvs-renderer'
import {mat4} from 'tvs-libs/lib/math/gl-matrix'
import * as coords from 'tvs-libs/lib/math/coords'



const spec: Spec = {

  'getId': {val: screenName => screenName + '-screen'},

  'radius': {val: 25},

  'height': {val: 2},

  'scale': {val: [1.6, 1, 1]},


  'rotations': {
    stream: {
      with: {
        videoNames: 'H videos.names' },
      do: ({videoNames}) =>

        videoNames.reduce((rs, n, i) => {
          rs[n] = Math.PI * 2 * i / videoNames.length
          return rs
        }, {})

      } },


  'positions': {
    stream: {
      with: {
        radius: 'H #radius',
        rotations: 'H #rotations',
        height: 'H #height',
        videoNames: 'H videos.names' },
      do: ({radius, rotations, height, videoNames}) =>

        videoNames.reduce((ps, n) => {
          const phi = -rotations[n] - Math.PI / 2
          const [x, z] = coords.polarToCartesian2D([radius, phi])
          ps[n] = [x, height, z]
          return ps
        }, {})

      } },


  'screens': {
    stream: {
      with: {
        getId: 'H #getId',
        scale: 'H #scale',
        rotations: 'H #rotations',
        positions: 'H #positions',
        shaderId: 'H shaders.screen.id',
        geometryId: 'H geometries.plane.id',
        getVideoLayerId: 'H layers.videos.getId',
        videoNames: 'H videos.names' },

      do: ({getId, shaderId, geometryId, getVideoLayerId, videoNames, positions, rotations, scale}) =>

        videoNames.map( n => {

          const transform = mat4.fromTranslation(mat4.create(), positions[n])
          mat4.rotateY(transform, transform, rotations[n])
          mat4.scale(transform, transform, scale)

          return {
            id: getId(n),
            shader: shaderId,
            geometry: geometryId,
            uniforms: {
              transform,
              video: getVideoLayerId(n)
            }
          }

        }) } },


  'update': {
    stream: {
      with: {
        ctx: 'H renderer.context',
        ps: 'H #screens' },
      do: ({ctx, ps}) => ps.forEach(p => {
        renderer.updateObject(ctx, p.id, p)
      }) } } }


flow.addGraph(toGraph(spec, 'objects.screens'))
console.log('adding graph: objects.screens')
