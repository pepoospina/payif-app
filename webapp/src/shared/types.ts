import { Identity } from '@semaphore-protocol/identity'
import { SemaphoreProof } from '@semaphore-protocol/proof'

export interface PersonDetails {
  firstName?: string
  lastName?: string
  placeOfBirth?: string
  dateOfBirth?: string
  nationality?: string
  nationalID?: string
  organization?: string
}

export enum PlatformId {
  X = 'x',
  Facebook = 'facebook',
  Email = 'email',
  Instagram = 'instagram',
  Whatsapp = 'whatsapp',
  Mobile = 'mobile',
  Telegram = 'telegram',
  Discord = 'discord',
  Custom = 'custom',
}

export interface PlatformAccount {
  platform: PlatformId
  username: string
  proofUrl?: string
}

export interface DetailsAndPlatforms {
  personal?: PersonDetails
  platforms?: PlatformAccount[]
}

export interface PAP {
  person: DetailsAndPlatforms
  account: HexStr
}

export interface Page {
  number: number
  perPage: number
  total?: number
  totalPages?: number
}

export interface Entity<T = any> {
  cid: string
  object: T
}

export type EntityCreate = Omit<Entity, 'hash'> & { hash?: string }

export type HexStr = `0x${string}`

export interface AppAccount {
  account: HexStr
  valid: boolean
  voucher: number
  tokenId: number
}

export interface AppProject {
  projectId: number
  address: HexStr
  whatStatement: string
  whoStatement: string
  selectedDetails: SelectedDetails
}

export type AppProjectCreate = AppProject

export enum PersonalDetailId {
  firstName = 'firstName',
  lastName = 'lastName',
  placeOfBirth = 'placeOfBirth',
  dateOfBirth = 'dateOfBirth',
  nationality = 'nationality',
  nationalID = 'nationalID',
  organization = 'organization',
}

export interface SelectedDetails {
  personal: Partial<Record<PersonalDetailId, boolean>>
  platform: Partial<Record<PlatformId, boolean>>
}

export interface AppVouch {
  from: number
  to: number
  personCid: string
  vouchDate: number
}

export interface AppChallenge {
  creationDate: number
  endDate: number
  lastOutcome: number
  nVoted: number
  nFor: number
  executed: boolean
}

export type VoteOption = 1 | -1

export type SemaphoreProofStrings = SemaphoreProof

export type PackedProofString = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
]

export interface AppStatement {
  projectId: number
  statement: string
  treeId: string
  proof: SemaphoreProofStrings
  nBackers?: number
  createdAt: number
}

export type AppStatementRead = AppStatement & { id: string }

export interface ProofAndTree {
  proof: SemaphoreProof
  treeId: string
}

export type StatementCreateProofs = {
  statementProof: ProofAndTree
  reactionProof: ProofAndTree
}

export type AppStatementCreate = {
  projectId: number
  statement: string
} & StatementCreateProofs

export enum StatementReactions {
  Back = 'back',
  DontBack = 'dontBack',
  Flag = 'flag',
}

export interface AppReactionCreate {
  statementId: string
  proof: SemaphoreProofStrings
}

export interface SignedObject<T> {
  object: T
  signature: HexStr
}

export type StatementRead = AppStatement & { id: string; treeId: string }

export interface AppPublicIdentity {
  publicId: string
  owner: HexStr
  aaAddress: HexStr
  signature: HexStr
}

export interface AppGetProof {
  projectId?: number
  treeId?: string
  signal: string
  scope: string
  identity: Identity
}

export interface AppGetMerklePass {
  projectId?: number
  treeId?: string
  publicId: string
}

export interface AppReturnMerklePass {
  merklePass: any
  treeId: string
  depth: number
}

export interface AppProjectMemberId {
  projectId: number
  aaAddress: HexStr
}

export interface AppProjectMember {
  projectId: number
  aaAddress: HexStr
  tokenId: number
  voucherTokenId: number
  joinedAt: number
}

export interface AppProjectMemberToken {
  projectId: number
  tokenId: number
}

export interface AppProjectIndex {
  deployAt: number
  indexedAt: number
}

export interface AppTree {
  projectId: number
  root: string
  publicIds: string[]
}

export interface AppInvite {
  projectId: number
  memberAddress: HexStr
}

export interface AppApply {
  papEntity: Entity<PAP>
  projectId: number
  invitationId?: string
}

export interface DeleteApplication {
  projectId: number
  applicantAddress: HexStr
}

export interface AppApplication {
  papEntity: Entity<PAP>
  projectId: number
  memberAddress?: string
}

export interface AaOwnerPayload {
  owner: HexStr
  aaAddress: HexStr
}
