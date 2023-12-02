import { getFragmentGenerator } from '../../../../../shared-utils/shaders/ast'
import {
	$w,
	$xyz,
	FloatSym,
	Mat4Sym,
	Sampler2DSym,
	Vec2Sym,
	Vec3Sym,
	Vec4Sym,
	assign,
	defMain,
	div,
	input,
	mul,
	program,
	sub,
	sym,
	texture,
	uniform,
	vec3,
	vec4,
} from '@thi.ng/shader-ast'
import { fit1101 } from '@thi.ng/shader-ast-stdlib'

const fs = getFragmentGenerator()

export const defaultSAOUniforms = {
	size: [512, 512],

	cameraNear: 1,
	cameraFar: 100,
	cameraProjectionMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0],
	cameraInverseProjectionMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0],

	scale: 1.0,
	intensity: 0.1,
	bias: 0.5,

	minResolution: 0.0,
	kernelRadius: 100.0,
	randomSeed: 0.0,
} as const

let tDiffuse: Sampler2DSym
let tNormalDepth: Sampler2DSym
let size: Vec2Sym

let cameraNear: FloatSym
let cameraFar: FloatSym
let projMat: Mat4Sym
let inverseProjMat: Mat4Sym

let scale: FloatSym
let intensity: FloatSym
let bias: FloatSym

let minResolution: FloatSym
let kernelRadius: FloatSym
let randomSeed: FloatSym

// const SAOShader = {
// 	defines: {
// 		NUM_SAMPLES: 7,
// 		NUM_RINGS: 4,
// 		DIFFUSE_TEXTURE: 0,
// 		PERSPECTIVE_CAMERA: 1,
// 	},

// 	fragmentShader: /* glsl */ `

// 		#include <common>

// 		varying vec2 vUv;

// 		#if DIFFUSE_TEXTURE == 1
// 		uniform sampler2D tDiffuse;
// 		#endif

// 		uniform sampler2D tDepth;
// 		uniform sampler2D tNormal;

// 		uniform float cameraNear;
// 		uniform float cameraFar;
// 		uniform mat4 cameraProjectionMatrix;
// 		uniform mat4 cameraInverseProjectionMatrix;

// 		uniform float scale;
// 		uniform float intensity;
// 		uniform float bias;
// 		uniform float kernelRadius;
// 		uniform float minResolution;
// 		uniform vec2 size;
// 		uniform float randomSeed;

// 		// RGBA depth

// 		#include <packing>

// 		vec4 getDefaultColor( const in vec2 screenPosition ) {
// 			#if DIFFUSE_TEXTURE == 1
// 			return texture2D( tDiffuse, vUv );
// 			#else
// 			return vec4( 1.0 );
// 			#endif
// 		}

// 		float getDepth( const in vec2 screenPosition ) {
// 			return texture2D( tDepth, screenPosition ).x;
// 		}

// 		float getViewZ( const in float depth ) {
// 			#if PERSPECTIVE_CAMERA == 1
// 			return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );
// 			#else
// 			return orthographicDepthToViewZ( depth, cameraNear, cameraFar );
// 			#endif
// 		}

// 		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {
// 			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];
// 			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );
// 			clipPosition *= clipW; // unprojection.

// 			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;
// 		}

// 		vec3 getViewNormal( const in vec3 viewPosition, const in vec2 screenPosition ) {
// 			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );
// 		}

// 		float scaleDividedByCameraFar;
// 		float minResolutionMultipliedByCameraFar;

// 		float getOcclusion( const in vec3 centerViewPosition, const in vec3 centerViewNormal, const in vec3 sampleViewPosition ) {
// 			vec3 viewDelta = sampleViewPosition - centerViewPosition;
// 			float viewDistance = length( viewDelta );
// 			float scaledScreenDistance = scaleDividedByCameraFar * viewDistance;

// 			return max(0.0, (dot(centerViewNormal, viewDelta) - minResolutionMultipliedByCameraFar) / scaledScreenDistance - bias) / (1.0 + pow2( scaledScreenDistance ) );
// 		}

// 		// moving costly divides into consts
// 		const float ANGLE_STEP = PI2 * float( NUM_RINGS ) / float( NUM_SAMPLES );
// 		const float INV_NUM_SAMPLES = 1.0 / float( NUM_SAMPLES );

// 		float getAmbientOcclusion( const in vec3 centerViewPosition ) {
// 			// precompute some variables require in getOcclusion.
// 			scaleDividedByCameraFar = scale / cameraFar;
// 			minResolutionMultipliedByCameraFar = minResolution * cameraFar;
// 			vec3 centerViewNormal = getViewNormal( centerViewPosition, vUv );

// 			// jsfiddle that shows sample pattern: https://jsfiddle.net/a16ff1p7/
// 			float angle = rand( vUv + randomSeed ) * PI2;
// 			vec2 radius = vec2( kernelRadius * INV_NUM_SAMPLES ) / size;
// 			vec2 radiusStep = radius;

// 			float occlusionSum = 0.0;
// 			float weightSum = 0.0;

// 			for( int i = 0; i < NUM_SAMPLES; i ++ ) {
// 				vec2 sampleUv = vUv + vec2( cos( angle ), sin( angle ) ) * radius;
// 				radius += radiusStep;
// 				angle += ANGLE_STEP;

// 				float sampleDepth = getDepth( sampleUv );
// 				if( sampleDepth >= ( 1.0 - EPSILON ) ) {
// 					continue;
// 				}

// 				float sampleViewZ = getViewZ( sampleDepth );
// 				vec3 sampleViewPosition = getViewPosition( sampleUv, sampleDepth, sampleViewZ );
// 				occlusionSum += getOcclusion( centerViewPosition, centerViewNormal, sampleViewPosition );
// 				weightSum += 1.0;
// 			}

// 			if( weightSum == 0.0 ) discard;

// 			return occlusionSum * ( intensity / weightSum );
// 		}

// 		void main() {
// 			float centerDepth = getDepth( vUv );
// 			if( centerDepth >= ( 1.0 - EPSILON ) ) {
// 				discard;
// 			}

// 			float centerViewZ = getViewZ( centerDepth );
// 			vec3 viewPosition = getViewPosition( vUv, centerDepth, centerViewZ );

// 			float ambientOcclusion = getAmbientOcclusion( viewPosition );

// 			gl_FragColor = getDefaultColor( vUv );
// 			gl_FragColor.xyz *=  1.0 - ambientOcclusion;
// 		}`,
// }

let color: Vec3Sym
let normalDepth: Vec4Sym
let normal: Vec3Sym
let depth: FloatSym

let coords: Vec2Sym

export const SAOFragmentShader = fs(
	program([
		(tDiffuse = uniform('sampler2D', 'tDiffuse')),
		(tNormalDepth = uniform('sampler2D', 'tNormalDepth')),
		(size = uniform('vec2', 'size')),

		(cameraNear = uniform('float', 'cameraNear')),
		(cameraFar = uniform('float', 'cameraFar')),
		(projMat = uniform('mat4', 'cameraProjectionMatrix')),
		(inverseProjMat = uniform('mat4', 'cameraInverseProjectionMatrix')),

		(scale = uniform('float', 'scale')),
		(intensity = uniform('float', 'intensity')),
		(bias = uniform('float', 'bias')),

		(minResolution = uniform('float', 'minResolution')),
		(kernelRadius = uniform('float', 'kernelRadius')),
		(randomSeed = uniform('float', 'randomSeed')),

		(coords = input('vec2', 'coords')),

		defMain(() => [
			(color = sym($xyz(texture(tDiffuse, coords)))),
			(normalDepth = sym(texture(tNormalDepth, coords))),
			(normal = sym($xyz(normalDepth))),
			(depth = sym($w(normalDepth))),
			// assign(fs.gl_FragColor, vec4(fit1101(normal), 1.0)),
			assign(fs.gl_FragColor, vec4(vec3(sub(1, div(depth, 20))), 1.0)),
			// assign(fs.gl_FragColor, vec4(color, 1.0)),
		]),
	]),
)
