import { PAP } from '../shared/types'

export const getPapShortname = (pap?: PAP) => {
  if (!pap) return ''
  if (pap.person && pap.person.personal && Object.keys(pap.person.personal).length > 0) {
    return `${pap.person.personal.firstName ? pap.person.personal.firstName : ''}${
      pap.person.personal.lastName ? ` ${pap.person.personal.lastName}` : ''
    }`
  }

  if (pap.person.platforms) {
    const activePlatforms = pap.person.platforms.filter((p) => p.username !== undefined)

    if (activePlatforms.length === 1) return activePlatforms[0].username

    const activePlatformsString = activePlatforms.reduce((acc, platform) => {
      const thisPlatform = `${platform.platform}: ${platform.username}`
      return acc ? `${acc}, ${thisPlatform}` : thisPlatform
    }, '')

    return activePlatformsString
  }
}
