import { useNavigate } from 'react-router-dom'

import { AbsoluteRoutes } from '../../route.names'

export const useNavigateHelpers = () => {
  const navigate = useNavigate()

  const backToProject = (projectId?: number) => {
    if (projectId) {
      navigate(AbsoluteRoutes.ProjectHome(projectId.toString()))
    } else {
      navigate(AbsoluteRoutes.App)
    }
  }

  return { backToProject, navigate }
}
