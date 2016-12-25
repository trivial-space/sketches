import {entity, addToFlow} from '../../flow'
import {renderUtils} from 'tvs-renderer'


export const id = entity('plane-geometry')


export const props = entity({
  width: 10,
  height: 10,
  segX: 5,
  segY: 5
})


export const geometry = entity()
  .stream({
    with: {
      props: props.HOT
    },
    do: ({props}) => renderUtils.geometry.plane(
      props.width, props.height, props.segX, props.segY
    )
  })


addToFlow({
  id,
  geometry,
  props
}, 'geometries.plane')
