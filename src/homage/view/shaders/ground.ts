import {entity, addToFlow} from '../../flow'
import {renderer} from 'tvs-renderer'


const spec: Spec = {

  'id': {val: 'ground-shader'},

  'vert': {val: require('./ground-vert.glsl')},

  'frag': {val: require('./ground-frag.glsl')},

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
            reflection: "t",
            size: 'f 2'
          }
        }) } } } }


flow.addGraph(toGraph(spec, 'shaders.ground'))
console.log('adding graph: shaders.ground')


if (module.hot) {
  console.log('reseting shaders.ground')
  requestAnimationFrame(function() {
    window['entities'] && window['entities'].shaders.ground.reset()
  })
}
