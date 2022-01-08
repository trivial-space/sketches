import { noise4d } from 'tvs-libs/dist/math/noise'
import { times, zip } from 'tvs-libs/dist/utils/sequence'

export interface Tile {
	width: number
	height: number
	top: number
	left: number
	color: [number, number, number]
}

export function subdivideTiles(tiles: Tile[], lineWidth: number): Tile[] {
	return tiles.flatMap((tile) => {
		const tileNoise = noise4d(tile.top, tile.left, tile.width, tile.height)
		const minSize = 3 * lineWidth + 5 * lineWidth * (tileNoise + 1)

		if (tile.width <= minSize || tile.height <= minSize) {
			return [tile]
		}

		const divisionCount = Math.floor(
			Math.random() + Math.random() + Math.random() + 1,
		)

		const divideHorizonal = tile.width / tile.height + tileNoise / 2 >= 1

		if (divideHorizonal) {
			const widthSegment = tile.width / divisionCount
			const newLefts = times(
				(i) =>
					tile.left +
					i * widthSegment +
					Math.max(
						Math.min((Math.random() - 0.5) * 2 * lineWidth, widthSegment / 3),
						-widthSegment / 3,
					),
				divisionCount,
			)
			newLefts[0] = tile.left

			const newWidths: number[] = []
			for (const newLeft of [...newLefts].reverse()) {
				const lastWidth = newWidths.reduce((sum, width) => sum + width, 0)
				newWidths.push(tile.width - lastWidth - (newLeft - tile.left))
			}
			newWidths.reverse()

			return zip(
				(newWidth, newLeft) => {
					const t: Tile = {
						height: tile.height,
						width: newWidth,
						left: newLeft,
						top: tile.top,
						color: [Math.random(), Math.random(), Math.random()],
					}
					return t
				},
				newWidths,
				newLefts,
			)
		} else {
			const heightSegment = tile.height / divisionCount
			const newTops = times(
				(i) =>
					tile.top +
					i * heightSegment +
					Math.max(
						Math.min((Math.random() - 0.5) * 2 * lineWidth, heightSegment / 3),
						-heightSegment / 3,
					),
				divisionCount,
			)
			newTops[0] = tile.top

			const newHeights: number[] = []
			for (const newTop of [...newTops].reverse()) {
				const lastHeight = newHeights.reduce((sum, height) => sum + height, 0)
				newHeights.push(tile.height - lastHeight - (newTop - tile.top))
			}
			newHeights.reverse()

			return zip(
				(newHeight, newTop) => {
					const t: Tile = {
						height: newHeight,
						width: tile.width,
						left: tile.left,
						top: newTop,
						color: [Math.random(), Math.random(), Math.random()],
					}
					return t
				},
				newHeights,
				newTops,
			)
		}
	})
}
