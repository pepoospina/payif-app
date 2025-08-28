import stringify from 'canonical-json'

import { FUNCTIONS_BASE } from '../config/appConfig'
import {
  AppGetMerklePass,
  AppPublicIdentity,
  AppReactionCreate,
  AppReturnMerklePass,
  AppStatementCreate,
} from '../shared/types'
import { MessageSigner } from './identity'

// TODO: replace inmemory cache with a proper cache using indexedDb
const cachedTreesMap = new Map<string, AppReturnMerklePass>()

export const signObject = async <T>(object: T, signMessage: MessageSigner) => {
  const message = stringify(object)
  console.log({ message })
  const signature = await signMessage(message)
  return { object: object, signature }
}

export const postStatement = async (statement: AppStatementCreate) => {
  const res = await fetch(FUNCTIONS_BASE + '/voice/statement', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(statement),
  })

  const body = await res.json()
  return body
}

export const postBacking = async (backing: AppReactionCreate) => {
  const res = await fetch(FUNCTIONS_BASE + '/voice/statement/back', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backing),
  })

  const body = await res.json()
  return body
}

export const postIdentity = async (publicIdentity: AppPublicIdentity) => {
  const res = await fetch(FUNCTIONS_BASE + '/voice/identity', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(publicIdentity),
  })

  const body = await res.json()
  return body.success
}

export const getMerklePass = async (
  details: AppGetMerklePass,
): Promise<AppReturnMerklePass | undefined> => {
  if (details.treeId) {
    const cached = cachedTreesMap.get(details.treeId)
    if (cached) {
      return cached
    }
  }

  const res = await fetch(FUNCTIONS_BASE + '/voice/merklepass/get', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  })

  const body = await res.json()

  /** if leaf does not exist, return undefined */
  if (body.error) {
    if (body.error.includes('leaf does not exist')) {
      return undefined
    } else {
      throw new Error(body.error)
    }
  }

  const merklePass = JSON.parse(body.merklePassStr)
  const parsed = { merklePass, treeId: body.treeId, depth: body.depth }

  /** store in cache */
  cachedTreesMap.set(body.treeId, parsed)

  return parsed
}
