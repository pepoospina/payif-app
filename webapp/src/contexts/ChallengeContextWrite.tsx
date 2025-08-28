import { useCallback, useEffect, useState } from 'react'
import { DecodeEventLogReturnType, encodeFunctionData } from 'viem'
import { useReadContract } from 'wagmi'

import { VoteOption } from '../shared/types'
import { registryABI } from '../utils/contracts.json'
import { useAccountContext } from '../wallet/AccountContext'
import { useProjectContext } from './ProjectContext'
import { useToast } from './ToastsContext'

export type ChallengeContextWriteType = {
  sendChallenge?: () => void
  isChallenging: boolean
  isErrorChallenging: boolean
  errorChallenging?: Error
  canVote?: boolean
  sendVote?: (vote: VoteOption) => void
  isVoting: boolean
  isErrorVoting: boolean
  errorVoting?: Error
  myVote?: number
  isSending: boolean
  isSuccess: boolean
  events?: DecodeEventLogReturnType[]
}

export const useChallengeWrite = (tokenId?: number): ChallengeContextWriteType => {
  const { address: projectAddress } = useProjectContext()
  const { sendUserOps, isSuccess, isSending, events } = useAccountContext()

  const tokenIdInternal = tokenId !== undefined ? BigInt(tokenId) : undefined

  const [isChallenging, setIsChallening] = useState<boolean>(false)
  const [isErrorChallenging, setIsErrorChallenging] = useState<boolean>(false)
  const [errorChallenging, setErrorChallenging] = useState<Error>()

  const [isVoting, setIsVoting] = useState<boolean>(false)
  const [isErrorVoting, setIsErrorVoting] = useState<boolean>(false)
  const [errorVoting, setErrorVoting] = useState<Error>()

  /** can vote */
  const { aaAddress: connectedAddress } = useAccountContext()

  const { data: tokenIdOfAddress } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'tokenIdOf',
    args: connectedAddress ? [connectedAddress] : undefined,
    query: {
      enabled: connectedAddress !== undefined && projectAddress !== undefined,
    },
  })

  const { data: canVote } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'canVote',
    args:
      tokenIdOfAddress && tokenIdInternal ? [tokenIdOfAddress, tokenIdInternal] : undefined,
    query: {
      enabled:
        tokenIdOfAddress !== undefined &&
        tokenIdInternal !== undefined &&
        projectAddress !== undefined,
    },
  })

  const { data: _myVote, refetch: refetchMyVote } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getChallengeVote',
    args:
      tokenIdOfAddress && tokenIdInternal ? [tokenIdInternal, tokenIdOfAddress] : undefined,
    query: {
      enabled:
        tokenIdOfAddress !== undefined &&
        tokenIdInternal !== undefined &&
        projectAddress !== undefined,
    },
  })

  const myVote = _myVote !== undefined && _myVote !== 0 ? _myVote : undefined

  useEffect(() => {
    if (isSuccess) {
      refetchMyVote()
    }
  }, [isSuccess, refetchMyVote])

  const { show } = useToast()

  // useEffect(() => {
  //   if (errorChallenging) {
  //     show({ title: 'Error', message: errorChallenging.message })
  //   }
  // }, [errorChallenging])

  useEffect(() => {
    if (errorVoting) {
      show({ title: 'Error', message: errorVoting.message })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorChallenging])

  /** Challenge */
  const sendChallenge = useCallback(async () => {
    if (!sendUserOps || !tokenIdInternal || !projectAddress) return

    setIsChallening(true)
    setIsErrorChallenging(false)
    setErrorChallenging(undefined)

    try {
      const callDataChallenge = encodeFunctionData({
        abi: registryABI,
        functionName: 'challenge',
        args: [tokenIdInternal],
      })

      const callDataVote = encodeFunctionData({
        abi: registryABI,
        functionName: 'vote',
        args: [tokenIdInternal, 1],
      })

      sendUserOps([
        {
          target: projectAddress,
          data: callDataChallenge,
          value: BigInt(0),
        },
        {
          target: projectAddress,
          data: callDataVote,
          value: BigInt(0),
        },
      ])
    } catch (e: any) {
      console.error(e)
      setIsChallening(false)
      setIsErrorChallenging(true)
      setErrorChallenging(e)
    }
  }, [sendUserOps, projectAddress, tokenIdInternal])

  /** Vote transactions */
  const sendVote = useCallback(
    async (vote: VoteOption) => {
      if (!sendUserOps || !tokenIdInternal || !projectAddress) return

      setIsVoting(true)
      setIsErrorVoting(false)
      setErrorVoting(undefined)

      try {
        const callDataVote = encodeFunctionData({
          abi: registryABI,
          functionName: 'vote',
          args: [tokenIdInternal, vote],
        })

        sendUserOps([
          {
            target: projectAddress,
            data: callDataVote,
            value: BigInt(0),
          },
        ])
      } catch (e: any) {
        console.error(e)
        setIsVoting(false)
        setIsErrorVoting(true)
        setErrorVoting(e)
      }
    },
    [sendUserOps, projectAddress, tokenIdInternal],
  )

  return {
    sendChallenge,
    isChallenging,
    isErrorChallenging,
    errorChallenging,
    canVote,
    sendVote,
    isVoting,
    isErrorVoting,
    errorVoting,
    myVote,
    isSuccess,
    isSending,
    events,
  }
}
