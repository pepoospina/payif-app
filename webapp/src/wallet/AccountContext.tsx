import {
  AlchemySmartAccountClient,
  createLightAccountAlchemyClient,
} from '@alchemy/aa-alchemy'
import { BatchUserOperationCallData, WalletClientSigner } from '@alchemy/aa-core'
import { useQuery } from '@tanstack/react-query'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { DecodeEventLogReturnType, decodeEventLog } from 'viem'
import { usePublicClient } from 'wagmi'

import { ALCHEMY_GAS_POLICY_ID, ALCHEMY_RPC_URL } from '../config/appConfig'
import { useLoadingContext } from '../contexts/LoadingContext'
import { I18Keys } from '../i18n/kyel.list'
import { HexStr } from '../shared/types'
import { getAccountAddress } from '../shared/utils/aa-sdk'
import { getFactoryAddress, registryABI, registryFactoryABI } from '../utils/contracts.json'
import { postUser } from '../utils/users'
import { AccountDataContext } from './AccountDataContext'
import { chain } from './ConnectedWalletContext'
import { useAppSigner } from './SignerContext'

const DEBUG = false

/** Account Abstraction Manager */
export type AccountContextType = {
  isConnected: boolean
  aaAddress?: HexStr
  sendUserOps?: (userOps: BatchUserOperationCallData) => void
  reset: () => void
  isSending: boolean
  isSuccess: boolean
  error?: Error
  events?: DecodeEventLogReturnType[]
  disconnect: () => void
}

const AccountContextValue = createContext<AccountContextType | undefined>(undefined)

/** Manages the AA user ops and their execution */
export const AccountContext = (props: PropsWithChildren) => {
  const { t } = useTranslation()
  const { signer, address, hasInjected } = useAppSigner()
  const publicClient = usePublicClient()
  const { setLoading, setPause, setSubtitle } = useLoadingContext()

  /** ALCHEMY provider to send transactions using AA */
  const [alchemyClientAA, setAlchemyClientAA] = useState<AlchemySmartAccountClient>()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isSending, setIsSending] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const [events, setEvents] = useState<DecodeEventLogReturnType[]>()

  // gasManagerConfig: {
  //   policyId: ALCHEMY_GAS_POLICY_ID,
  // },

  useEffect(() => {
    if (signer) {
      createLightAccountAlchemyClient({
        rpcUrl: ALCHEMY_RPC_URL,
        chain: chain,
        signer: new WalletClientSigner(signer, 'json-rpc'),
        gasManagerConfig: {
          policyId: ALCHEMY_GAS_POLICY_ID,
        },
      }).then((client) => {
        setAlchemyClientAA(client)
      })
    } else {
      localStorage.removeItem('lastAaAddress')
      setAlchemyClientAA(undefined)
    }
  }, [signer])

  const { data: aaAddress } = useQuery({
    queryKey: ['aaAddress', address],
    queryFn: async () => {
      if (address && publicClient) {
        const _aaAddress = await getAccountAddress(address, publicClient, chain)

        if (!_aaAddress) {
          throw new Error('AA address not found')
        }

        const current = localStorage.getItem('lastAaAddress')

        if (current == null) {
          /** update address maping in the backend */
          const res = await postUser({
            owner: address,
            aaAddress: _aaAddress,
          })

          localStorage.setItem('lastAaAddress', _aaAddress)

          if (!res) {
            throw new Error('Error while storing user')
          }
        }

        return _aaAddress
      }
    },
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _getAccountAddress = useCallback(async () => {}, [address, publicClient])

  useEffect(() => {
    _getAccountAddress()
  }, [_getAccountAddress])

  const isConnected = alchemyClientAA !== undefined

  const reset = () => {
    if (DEBUG) console.log('resetting userOps')
    setIsSuccess(false)
    setIsSending(false)
    setError(undefined)
    setEvents(undefined)
  }

  const sendUserOps = async (_userOps: BatchUserOperationCallData) => {
    setIsSending(true)
    try {
      if (_userOps.length === 0 || !aaAddress) return
      if (!alchemyClientAA) throw new Error('undefined alchemyClientAA')

      setSubtitle(t([I18Keys.waitingSignature1]))
      if (hasInjected) {
        setPause(true)
      }
      const uoSimResult = await alchemyClientAA.simulateUserOperation({
        uo: _userOps,
      } as any)

      if (DEBUG) console.log('uoSimResult', { uoSimResult })

      if (uoSimResult.error) {
        console.error(uoSimResult.error.message)
        throw new Error(uoSimResult.error.message)
      }

      if (DEBUG) console.log('sendUserOps', { userOps: _userOps })

      if (hasInjected) {
        setPause(true)
      }
      setSubtitle(t([I18Keys.waitingSignature2]))

      const res = await alchemyClientAA.sendUserOperation({
        uo: _userOps,
      } as any)

      if (DEBUG) console.log('sendUserOps - res', { res })
      if (DEBUG) console.log('waiting')

      setPause(false)
      setSubtitle(t([I18Keys.waitingTransaction]))

      const txHash = await alchemyClientAA.waitForUserOperationTransaction({
        hash: res.hash,
      })

      if (DEBUG) console.log('waitForUserOperationTransaction', { txHash })

      if (DEBUG) console.log('getting tx')

      if (!publicClient) throw new Error(`publicClient undefined`)

      const tx = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      })
      if (DEBUG) console.log('tx - res', { tx })

      const targets = _userOps.map((op) => op.target.toLowerCase())

      // extract all events from the target contracts (events from other callers would be here too... hmmm)
      const logs = tx.logs.filter((log: any) => targets.includes(log.address.toLowerCase()))
      const factoryAddress = await getFactoryAddress()

      console.log({ logs })
      const events = logs
        .map((log: any) => {
          if (log.address.toLowerCase() === factoryAddress.toLowerCase()) {
            return decodeEventLog({
              abi: registryFactoryABI,
              data: log.data,
              topics: log.topics,
            })
          } else {
            try {
              return decodeEventLog({
                abi: registryABI,
                data: log.data,
                topics: log.topics,
              })
            } catch (e) {
              return undefined
            }
          }
        })
        .filter((e: any) => e !== undefined)

      console.log({ events })

      setSubtitle(t([I18Keys.operationSuccessful]))

      setIsSuccess(true)
      setIsSending(false)
      setEvents(events as any)
    } catch (e: any) {
      setError(e)
      setLoading(false)
    }
  }

  const disconnect = () => {}

  useEffect(() => {
    if (isSuccess) {
      /** auto-reset everytime (isSuccess is true briefly) */
      setIsSuccess(false)
    }
  }, [isSuccess])

  return (
    <AccountContextValue.Provider
      value={{
        isConnected,
        aaAddress,
        sendUserOps,
        reset,
        isSuccess,
        isSending,
        events,
        error,
        disconnect,
      }}
    >
      <AccountDataContext>{props.children}</AccountDataContext>
    </AccountContextValue.Provider>
  )
}

export const useAccountContext = (): AccountContextType => {
  const context = useContext(AccountContextValue)
  if (!context) throw Error('context not found')
  return context
}
