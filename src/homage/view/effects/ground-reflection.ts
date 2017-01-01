import {val, stream, addToFlow} from '../../flow'


export const idPrefix = val('ground-reflection')

export const passes = val(6)


export const ids = stream(
  [idPrefix.HOT, passes.HOT],
  (prefix, passes) => {
    const ids: string[] = []
    for(let i = 0; i < passes; i++) {
      ids.push(prefix + i)
    }
    return ids
  }
)


export const layersData = stream(
  [ids.HOT],
  ids => ids.map((_, i) => ({
    direction: i % 2,
    strength: ids.length - i
  }))
)


addToFlow({idPrefix, ids, passes, layersData},'view.effects.groundReflection')
