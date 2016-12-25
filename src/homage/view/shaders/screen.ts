import {entity, addToFlow} from '../../flow'
import {renderer} from 'tvs-renderer'


const spec: Spec = {

  'id': {val: 'screen-shader'},

  'vert': {val: require('./screen-vert.glsl')},

  'frag': {val: require('./screen-frag.glsl')},


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
            position: "f 3",
            uv: "f 2"
          },
          uniforms: {
            video: "t",
            transform: "m 4",
            projection: "m 4",
            view: "m 4",
            withDistance: "i",
            groundHeight: 'f'
          }
        }) } } } }


flow.addGraph(toGraph(spec, 'shaders.screen'))
console.log('adding graph: shaders.screen')


if (module.hot) {
  console.log('reseting shaders.screen')
  requestAnimationFrame(function() {
    window['entities'] && window['entities'].shaders.screen.reset()
  })
}
