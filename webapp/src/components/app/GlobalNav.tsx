import { Box, Text } from 'grommet'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'

import { useServiceWorker } from '../../contexts/ServiceWorkerContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AbsoluteRoutes } from '../../route.names'
import { AppButton } from '../../ui-components'
import { SetPageTitleType } from './AppContainer'
import { ConnectedUser } from './ConnectedUser'
import { useThemeContext } from './ThemedApp'

export const GlobalNav = (props: { title?: SetPageTitleType }) => {
  const { constants } = useThemeContext()
  const navigate = useNavigate()
  const { hasUpdate, needsInstall, updateApp, install } = useServiceWorker()

  const title = (() => {
    return (
      <Box>
        <Box>
          <Text size="small">{props.title?.prefix}</Text>
        </Box>
        <Box>
          <Text size="large" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
            {props.title?.main}
          </Text>
        </Box>
      </Box>
    )
  })()

  const updater = (
    <AppButton
      style={{ flexGrow: 1, borderRadius: '0px' }}
      onClick={() => updateApp()}
      label={t(I18Keys.updateNow)}
      primary
    ></AppButton>
  )

  const installer = (
    <AppButton
      style={{ flexGrow: 1, borderRadius: '0px' }}
      onClick={() => install()}
      label={t(I18Keys.installNow)}
      primary
    ></AppButton>
  )

  const titleClicked = () => {
    navigate(AbsoluteRoutes.App)
  }

  return (
    <>
      <Box
        width="100%"
        justify="between"
        direction="row"
        gap={needsInstall && hasUpdate ? '2px' : '0px'}
        style={{
          flexShrink: 0,
          borderBottom: '1px solid',
          borderColor: constants.colors.primary,
        }}
        elevation="small"
      >
        {needsInstall ? installer : <></>}
        {hasUpdate ? updater : <></>}
      </Box>
      <Box
        direction="row"
        justify="between"
        align="center"
        pad={{ horizontal: 'medium', vertical: 'large' }}
      >
        <AppButton plain onClick={() => titleClicked()}>
          {title}
        </AppButton>
        <ConnectedUser></ConnectedUser>
      </Box>
    </>
  )
}
