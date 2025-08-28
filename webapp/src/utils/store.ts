import { FUNCTIONS_BASE } from '../config/appConfig'
import { getEntityFirestore } from '../firestore/getters'
import { Entity } from '../shared/types'
import { deriveEntity } from '../shared/utils/cid-hash'

export const putObject = async <T extends object>(object: T): Promise<Entity<T>> => {
  const entity = await deriveEntity<T>(object)
  return putEntity(entity)
}

export const putEntity = async (entity: Entity): Promise<Entity> => {
  const res = await fetch(FUNCTIONS_BASE + '/entities/entity', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entity),
  })

  const body = await res.json()
  const cid = await body.id

  if (entity.cid !== cid) {
    throw new Error(`Unexpected CID ${cid}. Expected ${entity.cid}`)
  }

  return entity
}

export const getEntity = async <T>(cid: string): Promise<Entity<T>> => {
  const entity = await getEntityFirestore<T>(cid)

  if (entity === undefined) {
    throw new Error(`Entity ${cid} not found`)
  }

  if (entity.cid !== cid)
    throw new Error(`Unexpected getInviteLinkCID ${entity.cid}. Expected ${cid}`)

  return entity
}
