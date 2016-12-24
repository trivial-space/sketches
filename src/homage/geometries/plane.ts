import {entity, addToFlow} from 'flow'
import {renderer, renderUtils} from 'tvs-renderer'


const spec: Spec = {

  'id': {val: 'plane-geometry'},


  'props': {
    val: {
      width: 10,
      height: 10,
      segX: 5,
      segY: 5 } },


  'geometry': {
    stream: {
      with: {
        props: 'H #props' },
      do: ({props}) => renderUtils.geometry.plane(
        props.width, props.height, props.segX, props.segY
      ) } },


  'update': {
    stream: {
      with: {
        geo: 'H #geometry',
        id: 'H #id',
        ctx: 'H renderer.context' },
      do: ({geo, id, ctx}) => renderer.updateGeometry(ctx, id, geo) } } }


flow.addGraph(toGraph(spec, 'geometries.plane'))
console.log('adding graph: geometries.plane')
