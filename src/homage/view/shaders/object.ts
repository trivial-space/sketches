import {entity, addToFlow} from '../../flow'
import {renderer} from 'tvs-renderer'


const spec: Spec = {

  'id': {val: 'object-shader'},

  'vert': {val: require('./object-vert.glsl')},

  'frag': {val: require('./object-frag.glsl')},

  'update': {
    stream: {
      with: {
        id: 'H #id',
        ctx: 'H renderer.context',
        vert: 'H #vert',
        frag: 'H #frag' },
      do: ({id, ctx, vert, frag}) => {

        renderer.updateShader(ctx, id, {
          vert, frag,
          attribs: {
            position: "f 3"
          },
          uniforms: {
            transform: "m 4",
            projection: "m 4",
            view: "m 4",
            withDistance: "i",
            groundHeight: 'f'
          }
        }) } } } }


flow.addGraph(toGraph(spec, 'shaders.object'))
console.log('adding graph: shaders.object')


if (module.hot) {
  console.log('reseting shaders.object')
  requestAnimationFrame(function() {
    window['entities'] && window['entities'].shaders.object.reset()
  })
}
