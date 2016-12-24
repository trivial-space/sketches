import {entity, addToFlow} from 'flow'
import {renderer, renderUtils} from 'tvs-renderer'
import * as geo3dBox from 'geo-3d-box'

const makeBox = geo3dBox as any


const spec: Spec = {

  'id': {val: 'box-geometry'},

  'size': {val: [10, 14, 2]},

  'segments': {val: [5, 7, 1]},


  'geometry': {
    stream: {
      with: {
        size: 'H #size',
        segments: 'H #segments' },
      do: ({size, segments}) =>
        renderUtils.stackgl.convertStackGLGeometry(makeBox({ size, segments })) } },


  'update': {
    stream: {
      with: {
        geo: 'H #geometry',
        id: 'H #id',
        ctx: 'H renderer.context' },
      do: ({geo, id, ctx}) => renderer.updateGeometry(ctx, id, geo) } } }


flow.addGraph(toGraph(spec, 'geometries.box'))
console.log('adding graph: geometries.box')
