import {
  Account,
  Address,
  Chain,
  ParseAccount,
  Transport,
  WalletClient,
  decodeEventLog,
} from 'viem'

import { registryFactoryABI } from './contracts.json'

export type RegistryCreatedEvent = Awaited<
  ReturnType<typeof decodeEventLog<typeof registryFactoryABI, 'RegistryCreated'>>
>

export type Signer = WalletClient<
  Transport,
  Chain,
  ParseAccount<Account | Address | undefined>
>
