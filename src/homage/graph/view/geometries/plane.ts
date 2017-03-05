import {val, stream} from 'homage/flow'
import {plane} from 'tvs-renderer/lib/utils/geometry/plane'


export const id = val('plane-geometry')


export const props = val({
  width: 10,
  height: 10,
  segX: 5,
  segY: 5
})


export const geometry = stream(
  [props.HOT],
  props => plane(props.width, props.height, props.segX, props.segY)
)