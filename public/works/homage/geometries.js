import box from "../../_snowpack/pkg/geo-3d-box.js";
import {plane} from "../../_snowpack/link/projects/painter/dist/utils/geometry/plane.js";
import {convertStackGLGeometry} from "../../_snowpack/link/projects/painter/dist/utils/stackgl.js";
import {Q} from "./context.js";
export const planeSize = {
  width: 10,
  height: 10
};
export const planeForm = Q.getForm("plane").update(plane(planeSize.width, planeSize.height, 5, 5));
const size = [10, 14, 2];
const segments = [5, 7, 1];
export const boxForm = Q.getForm("box").update(convertStackGLGeometry(box({size, segments})));
