import { FUNCTIONS_BASE } from '../config/appConfig'
import { AaOwnerPayload } from '../shared/types'

export const postUser = async (user: AaOwnerPayload) => {
  const res = await fetch(FUNCTIONS_BASE + '/user/setAaOwner', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })

  const body = await res.json()
  return body.success
}
