import {entity, addToFlow} from 'flow'
import {renderer} from 'tvs-renderer'


const spec: Spec = {

  'id': {val: 'mirror-scene'},

  'update': {
    stream: {
      with: {
        id: 'H #id',
        ctx: 'H renderer.context',
        videoNames: 'H videos.names',
        getScreenId: 'H objects.screens.getId',
        getPedestalId: 'H objects.pedestals.getId',
        groundPosition: 'H objects.ground.position',
        view: 'C camera.groundMirrorView',
        projection: 'C camera.perspective' },

      do: ({ctx, groundPosition, videoNames, id, getScreenId, getPedestalId, view, projection}) => {

        renderer.updateLayer(ctx, id, {
          flipY: true,
          objects: videoNames.map(getScreenId)
            .concat(videoNames.map(getPedestalId)),
          uniforms: {
            view,
            projection,
            withDistance: 1,
            groundHeight: groundPosition[1]
          }
        }) } } } }


flow.addGraph(toGraph(spec, 'layers.mirrorScene'))
console.log('adding graph: layers.mirrorScene')
