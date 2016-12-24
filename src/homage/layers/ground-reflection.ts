import {entity, addToFlow} from 'flow'
import {renderer} from 'tvs-renderer'


const spec: Spec = {

  'idPrefix': {val: 'ground-reflection'},

  'passes': {val: 6},


  'ids': {
    stream: {
      with: {
        prefix: 'H #idPrefix',
        passes: 'H #passes' },
      do: ({prefix, passes}) => {
        const ids: string[] = []
        for(let i = 0; i < passes; i++) {
          ids.push(prefix + i)
        }
        return ids
      } } },


  'update': {
    stream: {
      with: {
        ids: 'H #ids',
        ctx: 'H renderer.context',
        shader: 'H shaders.groundReflection.id',
        size: 'H renderer.canvasSize' },

      do: ({ctx, ids, size, shader}) => {

        size = [size.width, size.height]

        ids.forEach((id, i) => {
          renderer.updateLayer(ctx, id, {
            shader,
            uniforms: {
              size,
              direction: i % 2,
              strength: ids.length - i
            }
          })
        })

      } } } }


flow.addGraph(toGraph(spec, 'layers.groundReflection'))
console.log('adding graph: layers.groundReflection')
