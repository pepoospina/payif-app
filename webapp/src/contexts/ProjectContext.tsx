import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useReadContract } from 'wagmi'

import {
  subscribeToApplications,
  subscribeToStatements,
} from '../components/app/realtime.listeners'
import {
  getInviteId,
  getInviterApplications,
  getProject,
  getProjectMembers,
  getTopStatements,
} from '../firestore/getters'
import {
  AppApplication,
  AppProject,
  AppProjectMember,
  HexStr,
  StatementRead,
} from '../shared/types'
import { postInvite } from '../utils/project'
import { useAccountContext } from '../wallet/AccountContext'

export type ProjectContextType = {
  project?: AppProject | null
  projectId?: number
  address?: HexStr
  nMembers?: number
  refetch: () => void
  isLoading: boolean
  members?: AppProjectMember[]
  inviteId?: string
  resetLink: () => void
  resettingLink: boolean
  applications?: AppApplication[] | null
  refetchApplications: () => void
  statements?: StatementRead[]
  refetchStatements: () => void
}

interface IProjectContext {
  children: React.ReactNode
}

const ProjectContextValue = createContext<ProjectContextType | undefined>(undefined)

export const ProjectContext = (props: IProjectContext) => {
  const { aaAddress } = useAccountContext()

  const { projectId: routeProjectId } = useParams()

  const [projectId, _setProjectId] = useState<number>()
  const [resettingLink, setResettingLink] = useState<boolean>(false)

  /** from route param to projectId */
  useEffect(() => {
    if (routeProjectId) {
      _setProjectId(Number(routeProjectId))
    }
  }, [routeProjectId])

  /** from projectId to project */

  const { data: _project, refetch: refetchProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => {
      if (projectId) {
        return getProject(projectId)
      }
      return null
    },
  })

  /** query cannot return undefined, consider project undefined if projectId is undefined */
  const project = _project && projectId ? _project : undefined

  // all vouches
  const { data: members, refetch: refetchMembers } = useQuery({
    queryKey: ['allMembers', project],
    queryFn: async () => {
      if (project) {
        return getProjectMembers(project.projectId)
      }
      return null
    },
  })

  const {
    refetch: refetchTotalSupply,
    data: nMembers,
    isLoading,
  } = useReadContract({
    address: project?.address,
    functionName: 'totalSupply',
    query: { enabled: project !== undefined },
  })

  const refetch = () => {
    refetchTotalSupply()
    refetchProject()
    refetchMembers()
  }

  /** Member unique invite link */
  const { data: inviteId, refetch: refetchInvite } = useQuery({
    queryKey: ['getInviteLink', aaAddress, projectId],
    queryFn: () => {
      if (projectId && aaAddress) {
        return getInviteId(projectId, aaAddress)
      }
      return null
    },
  })

  const { data: statements, refetch: refetchStatements } = useQuery({
    queryKey: ['topStatements', projectId?.toString()],
    queryFn: async () => {
      if (projectId) {
        return getTopStatements(projectId)
      }
      return null
    },
  })

  const resetLink = () => {
    if (projectId && aaAddress) {
      setResettingLink(true)
      postInvite({
        projectId,
        memberAddress: aaAddress,
      }).then((id) => {
        refetchInvite()
        setResettingLink(false)
      })
    }
  }

  /** get applications created for this member */
  const { data: applications, refetch: refetchApplications } = useQuery({
    queryKey: ['getApplications', aaAddress, projectId],
    queryFn: () => {
      if (aaAddress && projectId) {
        return getInviterApplications(projectId, aaAddress)
      }
      return null
    },
  })

  /** refetch applications when new application to this member is created */
  useEffect(() => {
    if (aaAddress && projectId) {
      return subscribeToApplications(projectId, aaAddress, refetchApplications)
    }
  }, [aaAddress, projectId, refetchApplications])

  /** subscribe to statements collection */
  useEffect(() => {
    return subscribeToStatements(() => {
      refetchStatements()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ProjectContextValue.Provider
      value={{
        projectId: project?.projectId,
        project,
        address: project?.address,
        nMembers: nMembers !== undefined ? Number(nMembers) : undefined,
        refetch,
        isLoading,
        members: members ? members : [],
        inviteId,
        resetLink,
        resettingLink,
        applications,
        refetchApplications,
        statements: statements ? statements : undefined,
        refetchStatements,
      }}
    >
      {props.children}
    </ProjectContextValue.Provider>
  )
}

export const useProjectContext = (): ProjectContextType => {
  const context = useContext(ProjectContextValue)
  if (!context) throw Error('context not found')
  return context
}
