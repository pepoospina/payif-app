import { Account, Address, Chain, ParseAccount, Transport, WalletClient } from 'viem'

export type Signer = WalletClient<
  Transport,
  Chain,
  ParseAccount<Account | Address | undefined>
>
