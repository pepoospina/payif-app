import { onSnapshot } from 'firebase/firestore'

import { collections } from '../../firestore/database'
import { inviterApplicationsQuery } from '../../firestore/getters'
import { HexStr } from '../../shared/types'

export const subscribeToStatements = (callback: () => void) => {
  const statements = collections.statements
  return onSnapshot(statements, (doc): void => {
    callback()
  })
}

export const subscribeToApplications = (
  projectId: number,
  memberAddress: HexStr,
  callback: () => void,
) => {
  const query = inviterApplicationsQuery(projectId, memberAddress)
  const unsub = onSnapshot(query, (doc) => {
    callback()
  })
  return unsub
}
