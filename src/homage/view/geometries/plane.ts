import {val, stream, addToFlow} from '../../flow'
import {renderUtils} from 'tvs-renderer'


export const id = val('plane-geometry')


export const props = val({
  width: 10,
  height: 10,
  segX: 5,
  segY: 5
})


export const geometry = stream(
  [props.HOT],
  props => renderUtils.geometry.plane(
    props.width, props.height, props.segX, props.segY
  )
)


addToFlow({
  id,
  geometry,
  props
}, 'geometries.plane')
