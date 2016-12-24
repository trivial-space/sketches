import {entity, addToFlow} from 'flow'
import {renderer} from 'tvs-renderer'


const spec: Spec = {

  'id': {val: 'scene'},

  'update': {
    stream: {
      with: {
        id: 'H #id',
        ctx: 'H renderer.context',
        videoNames: 'H videos.names',
        getScreenId: 'H objects.screens.getId',
        getPedestalId: 'H objects.pedestals.getId',
        ground: 'H objects.ground.id',
        view: 'C camera.view',
        projection: 'C camera.perspective' },

      do: ({ctx, ground, videoNames, id, getScreenId, getPedestalId, view, projection}) => {

        renderer.updateLayer(ctx, id, {
          objects: videoNames.map(getScreenId)
            .concat([ground])
            .concat(videoNames.map(getPedestalId)),
          uniforms: {
            view,
            projection,
            withDistance: 0,
            groundHeight: 0
          }
        }) } } } }


flow.addGraph(toGraph(spec, 'layers.scene'))
console.log('adding graph: layers.scene')
