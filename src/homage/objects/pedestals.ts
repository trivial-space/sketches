import {entity, addToFlow} from 'flow'
import {renderer} from 'tvs-renderer'
import {mat4} from 'tvs-libs/lib/math/gl-matrix'
import * as vec from 'tvs-libs/lib/math/vectors'


const spec: Spec = {

  'getId': { val: screenName => screenName + '-pedestal' },

  'scale': { val: [1.65, 1, 1] },


  'pedestals': {
    stream: {
      with: {
        getId: 'H #getId',
        scale: 'H #scale',
        shaderId: 'H shaders.object.id',
        geometryId: 'H geometries.box.id',
        videoNames: 'H videos.names',
        rotations: 'H objects.screens.rotations',
        positions: 'H objects.screens.positions' },

      do: ({getId, shaderId, geometryId, videoNames, positions, rotations, scale}) =>

        videoNames.map( n => {

          const position = vec.mul(positions[n], 1.045)
          position[1] -= 1.9

          const transform = mat4.fromTranslation(mat4.create(), position as any)
          mat4.rotateY(transform, transform, rotations[n])
          mat4.scale(transform, transform, scale as any)

          return {
            id: getId(n),
            shader: shaderId,
            geometry: geometryId,
            uniforms: {
              transform
            }
          }
        }) } },


  'update': {
    stream: {
      with: {
        ctx: 'H renderer.context',
        ps: 'H #pedestals' },
      do: ({ctx, ps}) => ps.forEach(p => {
        renderer.updateObject(ctx, p.id, p)
      }) } } }


flow.addGraph(toGraph(spec, 'objects.pedestals'))
console.log('adding graph: objects.pedestals')
