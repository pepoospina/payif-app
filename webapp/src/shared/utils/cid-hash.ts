import { Buffer } from 'buffer'
import stringify from 'canonical-json'
import CBOR from 'cbor-js'
import CID from 'cids'
import multihashing from 'multihashing-async'

import { Entity, EntityCreate } from '../types'

export interface CidConfig {
  base?: string
  version: 0 | 1
  codec: string
  type: string
}

export const defaultCidConfig: CidConfig = {
  version: 1,
  type: 'sha2-256',
  codec: 'raw',
  base: 'base32',
}

export function canonicalStringify(object: object): string {
  return stringify(object)
}

export function objectToBytes(object: object): Uint8Array {
  const canonicalObject = JSON.parse(canonicalStringify(object))
  return new Uint8Array(CBOR.encode(canonicalObject))
}

export function bytesToObject(bytes: ArrayBuffer) {
  return CBOR.decode(bytes)
}

export function bufferToHash(buffer: Uint8Array, type: string) {
  return multihashing(buffer, type as any)
}

export function hash2cid(data: Uint8Array, config: CidConfig) {
  const cid = new CID(config.version, config.codec, data, config.base)
  return cid.toString()
}

export async function hashObject(
  object: object,
  config: CidConfig = defaultCidConfig,
): Promise<string> {
  const buffer = objectToBytes(object)
  const encoded = await bufferToHash(buffer, config.type)
  return hash2cid(encoded, config)
}

export function cidConfigOf(cidStr: string): CidConfig {
  let cid = new CID(cidStr)
  let multihash = multihashing.multihash.decode(cid.multihash)

  return {
    base: cid.multibaseName,
    version: cid.version,
    codec: cid.codec,
    type: multihash.name,
  }
}

const constants: [string, number][] = [
  ['base8', 37],
  ['base10', 39],
  ['base16', 66],
  ['base32', 62],
  ['base32pad', 63],
  ['base32hex', 76],
  ['base32hexpad', 74],
  ['base32z', 68],
  ['base58flickr', 90],
  ['base58btc', 122],
  ['base64', 109],
  ['base64pad', 77],
  ['base64url', 75],
  ['Ubase64urlpad', 55],
]

const multibaseToUint = (multibaseName: string): number => {
  return constants.filter((e) => e[0] === multibaseName)[0][1]
}

const uintToMultibase = (number: number): string => {
  return constants.filter((e) => e[1] === number)[0][0]
}

export const cidToHex32 = (cidStr: string) => {
  /** store the encoded cids as they are, including the multibase bytes */
  const cid = new CID(cidStr)
  const bytes = cid.bytes

  /* push the code of the multibse (UTF8 number of the string) */
  const bytesWithMultibase = new Uint8Array(bytes.length + 1)
  bytesWithMultibase.set(Uint8Array.from([multibaseToUint(cid.multibaseName)]))
  bytesWithMultibase.set(bytes, 1)

  /** convert to hex */
  let cidEncoded16 = Buffer.from(bytesWithMultibase).toString('hex')
  /** pad with zeros */
  cidEncoded16 = cidEncoded16.padStart(128, '0')

  const cidHex0 = cidEncoded16.slice(-64) /** LSB */
  const cidHex1 = cidEncoded16.slice(-128, -64)

  return ['0x' + cidHex1, '0x' + cidHex0]
}

export const bytes32ToCid = (bytes: [string, string]) => {
  const cidHex1 = bytes[0].substring(2)
  const cidHex0 = bytes[1].substring(2) /** LSB */

  const cidHex = cidHex1.concat(cidHex0).replace(/^0+/, '')
  if (cidHex === '') return ''

  const cidBufferWithBase = Buffer.from(cidHex, 'hex')

  const multibaseCode = cidBufferWithBase[0]
  const cidBuffer = cidBufferWithBase.slice(1)

  const multibaseName = uintToMultibase(multibaseCode)

  /** Force Buffer class */
  const cid = new CID(cidBuffer)

  return cid.toBaseEncodedString(multibaseName as any)
}

const LOGINFO = false

export async function deriveEntity<O extends object>(
  object: O,
  config: CidConfig = defaultCidConfig,
): Promise<Entity<O>> {
  const cid = await hashObject(object, config)

  const entity = {
    cid,
    object,
  }

  if (LOGINFO) console.log('deriveEntity', { entity, config })

  return entity
}

/** verify that the reference entities that have a hash were created with the same hash */
export function validateEntities(entities: Entity[], references: EntityCreate[]) {
  references.forEach((ref) => {
    if (ref.hash) {
      const entity = entities.find((e) => e.cid === ref.hash)
      if (!entity) {
        /** append stringified object */
        entities.forEach(
          (entity) => ((entity as any).objectStr = JSON.stringify(entity.object)),
        )
        references.forEach(
          (entity) => ((entity as any).objectStr = JSON.stringify(entity.object)),
        )

        console.error(`Entity ${ref.hash} not correctly created`, { entities, references })
        throw new Error(`Entity ${JSON.stringify(ref)} not found in entity set`)
      }
    }
  })
}
