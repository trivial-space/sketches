import { getFragmentGenerator } from '../../../../../shared-utils/shaders/ast'
import {
	$w,
	$xyz,
	FLOAT0,
	FLOAT1,
	FloatSym,
	INT0,
	Mat4Sym,
	Sampler2DSym,
	TAU,
	Vec2Sym,
	Vec3Sym,
	Vec4Sym,
	add,
	assign,
	cos,
	defMain,
	discard,
	div,
	dot,
	eq,
	float,
	forLoop,
	ifThen,
	inc,
	input,
	int,
	length,
	lt,
	max,
	mul,
	pow,
	program,
	sin,
	sub,
	sym,
	texture,
	uniform,
	vec2,
	vec3,
	vec4,
} from '@thi.ng/shader-ast'
import { fit1101, hash12, hash2, permute } from '@thi.ng/shader-ast-stdlib'

const fs = getFragmentGenerator()

// const SAOShader = {
// 	defines: {
// 		NUM_SAMPLES: 7,
// 		NUM_RINGS: 4,
// 		PERSPECTIVE_CAMERA: 1,
// 	},

// 	fragmentShader: /* glsl */ `

// 		#include <common>

// 		varying vec2 vUv;

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

// 			gl_FragColor = vec(1.0);
// 			gl_FragColor.xyz *=  1.0 - ambientOcclusion;
// 		}`,
// }

// Uniforms

export const defaultSAOUniforms = {
	size: [512, 512],

	cameraNear: 0.1,
	cameraFar: 100,

	scale: 1,
	intensity: 0.1,
	bias: 0.5,

	minResolution: 0.0,
	kernelRadius: 100.0,
	// randomSeed: 0.0,
} as const

let tNormalDepth: Sampler2DSym
let tViewPosition: Sampler2DSym
let size: Vec2Sym

let cameraNear: FloatSym
let cameraFar: FloatSym

let scale: FloatSym
let intensity: FloatSym
let bias: FloatSym

let minResolution: FloatSym
let kernelRadius: FloatSym
let randomSeed: FloatSym

// Variables

let normalDepth: Vec4Sym
let centerViewNormal: Vec3Sym
let depth: FloatSym
let centerViewPosition: Vec3Sym

let coords: Vec2Sym

let scaleDividedByCameraFar: FloatSym
let minResolutionMultipliedByCameraFar: FloatSym
let angle: FloatSym
let radius: Vec2Sym
let radiusStep: Vec2Sym
let occlusionSum: FloatSym
let weightSum: FloatSym
let sampleUv: Vec2Sym

let sampleViewPosition: Vec3Sym
let viewDelta: Vec3Sym
let viewDistance: FloatSym
let scaledScreenDistance: FloatSym

const NUM_RINGS = 4
const NUM_SAMPLES = 7
const ANGLE_STEP = (Math.PI * 2 * NUM_RINGS) / NUM_SAMPLES
const INV_NUM_SAMPLES = 1 / NUM_SAMPLES

export const SAOFragmentShader = fs(
	program([
		(tNormalDepth = uniform('sampler2D', 'tNormalDepth')),
		(tViewPosition = uniform('sampler2D', 'tViewPosition')),
		(size = uniform('vec2', 'size')),

		(cameraNear = uniform('float', 'cameraNear')),
		(cameraFar = uniform('float', 'cameraFar')),

		(scale = uniform('float', 'scale')),
		(intensity = uniform('float', 'intensity')),
		(bias = uniform('float', 'bias')),

		(minResolution = uniform('float', 'minResolution')),
		(kernelRadius = uniform('float', 'kernelRadius')),
		(randomSeed = uniform('float', 'randomSeed')),

		(coords = input('vec2', 'coords')),

		defMain(() => [
			(normalDepth = sym(texture(tNormalDepth, coords))),
			(depth = sym($w(normalDepth))),
			(centerViewPosition = sym($xyz(texture(tViewPosition, coords)))),
			(centerViewNormal = sym($xyz(normalDepth))),

			(scaleDividedByCameraFar = sym(div(scale, cameraFar))),
			(minResolutionMultipliedByCameraFar = sym(mul(minResolution, cameraFar))),

			(angle = sym(mul(hash12(add(coords, randomSeed)), TAU))),
			(radius = sym(vec2(mul(kernelRadius, INV_NUM_SAMPLES)))),
			(radiusStep = sym(radius)),
			(occlusionSum = sym(float(0))),
			(weightSum = sym(float(0))),

			forLoop(
				sym(INT0),
				(i) => lt(i, int(NUM_SAMPLES)),
				inc,
				(i) => [
					(sampleUv = sym(
						add(coords, mul(vec2(cos(angle), sin(angle)), radius)),
					)),
					assign(radius, add(radius, radiusStep)),
					assign(angle, add(angle, ANGLE_STEP)),

					(sampleViewPosition = sym($xyz(texture(tViewPosition, sampleUv)))),
					(viewDelta = sym(sub(sampleViewPosition, centerViewPosition))),
					(viewDistance = sym(length(viewDelta))),
					(scaledScreenDistance = sym(
						mul(scaleDividedByCameraFar, viewDistance),
					)),
					assign(
						occlusionSum,
						add(
							occlusionSum,

							max(
								float(0),
								div(
									sub(
										div(
											sub(
												dot(centerViewNormal, viewDelta),
												minResolutionMultipliedByCameraFar,
											),
											scaledScreenDistance,
										),
										bias,
									),
									add(
										float(1),
										mul(scaledScreenDistance, scaledScreenDistance),
									),
								),
							),
						),
					),
					assign(weightSum, add(weightSum, FLOAT1)),
				],
			),

			// ifThen(eq(weightSum, FLOAT0), [discard]),

			assign(
				fs.gl_FragColor,
				mul(vec4(1), sub(1, mul(occlusionSum, div(intensity, weightSum)))),
			),

			// assign(fs.gl_FragColor, vec4(fit1101(centerViewNormal), 1.0)),
			// assign(
			// 	fs.gl_FragColor,
			// 	vec4(fit1101(mul(centerViewPosition, 0.05)), 1.0),
			// ),
			// assign(fs.gl_FragColor, vec4(vec3(div(depth, 20)), 1.0)),
			// assign(fs.gl_FragColor, vec4(vec3(hash12(add(coords, randomSeed))), 1)),
		]),
	]),
)
console.log(SAOFragmentShader)
