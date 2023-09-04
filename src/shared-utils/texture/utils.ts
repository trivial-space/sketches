export const randomTexture = (width: number, height: number) => {
	const data = new Uint8Array(width * height * 4)
	for (let i = 0; i < data.length; i++) {
		data[i] = Math.random() * 255
	}
	return data
}

export const screenSizeRandomTextureGenerator = () => {
	let size = Math.max(window.innerWidth, window.innerHeight)
	let texture = randomTexture(size, size)

	return () => {
		const newSize = Math.max(window.innerWidth, window.innerHeight)

		if (newSize > size) {
			size = newSize
			texture = randomTexture(size, size)
		}

		return texture
	}
}
