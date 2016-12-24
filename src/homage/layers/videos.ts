import {entity, addToFlow} from 'flow'
import {renderer} from 'tvs-renderer'


const spec: Spec = {

  'getId': { val: videoName => videoName + '-video' },


  'update': {
    stream: {
      with: {
        tick: 'H events.tick',
        getId: 'c #getId',
        vs: 'H videos.videos',
        ctx: 'c renderer.context' },

      do: ({getId, vs, ctx}) => {

        Object.keys(vs).forEach(n => {
          const v = vs[n], name = getId(n)
          renderer.updateLayer(ctx, name, {asset: v, flipY: true})
        })
      } } } }


flow.addGraph(toGraph(spec, 'layers.videos'))
console.log('adding graph: layers.videos')
