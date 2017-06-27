declare module 'geo-3d-box' {
	export function box (params: { size: number[], segments: number }): any
	export default box
}

declare module '*.glsl' {
	const content: string
	export default content
}
declare module '*.vert' {
	const content: string
	export default content
}
declare module '*.frag' {
	const content: string
	export default content
}
declare module '*.json' {
	const content: any
	export default content
}
