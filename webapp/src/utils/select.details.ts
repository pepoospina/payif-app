import { PersonalDetailId, PlatformId, SelectedDetails } from '../shared/types'

export class SelectedDetailsHelper {
  static hasPlatforms = (details?: SelectedDetails) => {
    if (!details) return false
    return (
      Object.keys(details.platform).find((pId) => details.platform[pId as PlatformId]) !==
      undefined
    )
  }

  static hasPersonal = (details?: SelectedDetails) => {
    if (!details) return false
    return (
      Object.keys(details.personal).find(
        (key) => details.personal[key as PersonalDetailId],
      ) !== undefined
    )
  }
}
