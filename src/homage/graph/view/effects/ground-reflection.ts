import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'


export const blurStrength = val(10).reset()


export const layersData = stream(
	[blurStrength.HOT],
	(strength) => {
		const passData: any[] = []
		while (strength >= 1) {
			passData.push({
				direction: 0,
				strength: strength * 1.5
			})
			passData.push({
				direction: 1,
				strength: strength * 6
			})
			strength /= 2
		}
		return passData
	}
)
