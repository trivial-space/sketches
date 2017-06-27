import { val, stream } from 'tvs-flow/lib/utils/entity-reference'


export const blurStrength = val(6)


export const layersData = stream(
	[blurStrength.HOT],
	(strength) => {
		const passData: any[] = []
		while (strength < 1) {
			passData.push({
				direction: 0,
				strength
			})
			passData.push({
				direction: 1,
				strength
			})
			strength /= 2
		}
		return passData
	}
)
