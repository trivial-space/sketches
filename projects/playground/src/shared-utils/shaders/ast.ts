import { targetGLSL, GLSLVersion } from '@thi.ng/shader-ast-glsl'

export const getVertexGenerator = () =>
	targetGLSL({
		version: GLSLVersion.GLES_100,
		type: 'vs',
	})

export const getFragmentGenerator = (prelude = 'precision mediump float;') =>
	targetGLSL({
		version: GLSLVersion.GLES_100,
		type: 'fs',
		prelude,
	})
