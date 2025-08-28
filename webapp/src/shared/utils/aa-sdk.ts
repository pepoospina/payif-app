import { getDefaultLightAccountFactoryAddress } from '@alchemy/aa-accounts'
import { EntryPointAbi, getDefaultEntryPointAddress } from '@alchemy/aa-core'
import {
  Address,
  Chain,
  PublicClient,
  concatHex,
  encodeFunctionData,
  getContract,
} from 'viem'

import { HexStr } from '../types'
import { LightAccountFactoryAbi } from './aa-sdk.abis'

/**  */
export const getAccountAddress = async (
  signer: HexStr,
  client: PublicClient,
  chain: Chain,
): Promise<HexStr | undefined> => {
  const salt = BigInt(0)
  const entryPointAddress = getDefaultEntryPointAddress(chain as any)
  const entryPoint = getContract({
    address: entryPointAddress,
    abi: EntryPointAbi,
    client: client as PublicClient,
  })

  const initCode = concatHex([
    getDefaultLightAccountFactoryAddress(chain as any),
    encodeFunctionData({
      abi: LightAccountFactoryAbi,
      functionName: 'createAccount',
      args: [signer, salt],
    }),
  ])

  try {
    /** account address comes in an error... */
    await entryPoint.simulate.getSenderAddress([initCode])
  } catch (err: any) {
    if (err.cause?.data?.errorName === 'SenderAddressResult') {
      return err.cause.data.args[0] as Address
    }

    if (err.details === 'Invalid URL') {
      throw new Error('Invalid URL')
    }
  }

  return undefined
}
