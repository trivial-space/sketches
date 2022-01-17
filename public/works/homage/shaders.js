import {Q} from "./context.js";
import groundFrag from "./glsl/ground-frag.js";
import groundVert from "./glsl/ground-vert.js";
import objectFrag from "./glsl/object-frag.js";
import objectVert from "./glsl/object-vert.js";
import screenFrag from "./glsl/screen-frag.js";
import screenVert from "./glsl/screen-vert.js";
export const groundShade = Q.getShade("ground").update({
  vert: groundVert,
  frag: groundFrag
});
export const objectShade = Q.getShade("object").update({
  vert: objectVert,
  frag: objectFrag
});
export const screenShade = Q.getShade("screen").update({
  vert: screenVert,
  frag: screenFrag
});
