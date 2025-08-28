import { useEffect } from 'react'
import { useReadContract } from 'wagmi'

import { AppChallenge, VoteOption } from '../shared/types'
import { registryABI } from '../utils/contracts.json'
import { useProjectContext } from './ProjectContext'

export type ChallengeContextReadType = {
  tokenId?: number
  refetchChallenge: (options?: {
    throwOnError: boolean
    cancelRefetch: boolean
  }) => Promise<any>
  challengeRead: AppChallenge | undefined | null
  totalVoters?: number
  isLoadingChallenge: boolean
}

export interface ChallengeContextProps {
  tokenId?: number
}

export const useChallengeRead = (tokenId?: number): ChallengeContextReadType => {
  const { address: projectAddress } = useProjectContext()

  /** Vouch */
  const tokenIdInternal = tokenId !== undefined ? BigInt(tokenId) : undefined

  /** challenge details */
  const {
    refetch: refetchChallenge,
    data: _challengeRead,
    isLoading: isLoadingChallenge,
    isError: isErrorChallengeRead,
    error: errorChallengeRead,
  } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getChallenge',
    args: tokenIdInternal ? [tokenIdInternal] : undefined,

    query: {
      enabled: tokenIdInternal !== undefined && projectAddress !== undefined,
    },
  })

  const { data: totalVoters } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getTotalVoters',
    args: tokenIdInternal ? [tokenIdInternal] : undefined,

    query: {
      enabled: tokenIdInternal !== undefined && projectAddress !== undefined,
    },
  })

  useEffect(() => {
    if (isErrorChallengeRead) {
      console.log({ errorChallengeRead })
    }
  }, [errorChallengeRead, isErrorChallengeRead])

  /** undefined means currently reading, null means read and not found */
  const challengeRead: AppChallenge | undefined | null = ((_challengeRead) => {
    if (
      isErrorChallengeRead &&
      errorChallengeRead &&
      errorChallengeRead.message.includes('')
    ) {
      return null
    }
    if (_challengeRead === undefined) {
      return undefined
    }
    if (_challengeRead[0] > 0 && !isErrorChallengeRead) {
      return {
        creationDate: Number(_challengeRead[0]),
        endDate: Number(_challengeRead[1]),
        lastOutcome: Number(_challengeRead[2]),
        nVoted: Number(_challengeRead[3]),
        nFor: Number(_challengeRead[4]),
        executed: _challengeRead[5],
      }
    }
  })(_challengeRead)

  return {
    tokenId: Number(tokenIdInternal),
    refetchChallenge,
    challengeRead,
    totalVoters: Number(totalVoters),
    isLoadingChallenge,
  }
}

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
}
