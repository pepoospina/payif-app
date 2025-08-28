import { Box, Text } from 'grommet'
import { UserExpert } from 'grommet-icons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CHAIN_ID } from '../../config/appConfig'
import { I18Keys } from '../../i18n/kyel.list'
import { Address, AppButton, AppCircleDropButton } from '../../ui-components'
import { cap } from '../../utils/general'
import { useAccountContext } from '../../wallet/AccountContext'
import { useAppSigner } from '../../wallet/SignerContext'
import { AppConnectButton } from './AppConnectButton'
import { LanguageSelector } from './LanguageSelector'
import { Loading } from './Loading'
import { useThemeContext } from './ThemedApp'

export const ConnectedUser = (props: {}) => {
  const { t } = useTranslation()
  const { address } = useAppSigner()
  const { aaAddress, isConnected, disconnect } = useAccountContext()
  const { constants } = useThemeContext()

  const [showDrop, setShowDrop] = useState<boolean>(false)

  const content = (() => {
    if (!isConnected) {
      return (
        <AppConnectButton
          style={{ fontSize: '16px', padding: '6px 8px' }}
        ></AppConnectButton>
      )
    }

    if (!aaAddress) {
      return <Loading></Loading>
    }

    return (
      <AppCircleDropButton
        plain
        label={
          <UserExpert
            color={constants.colors.primary}
            style={{ margin: '2px 0px 0px 5px' }}
          ></UserExpert>
        }
        open={showDrop}
        onClose={() => setShowDrop(false)}
        onOpen={() => setShowDrop(true)}
        dropContent={
          <Box pad="20px" gap="small">
            <Box margin={{ bottom: 'small' }}>
              <Text>{cap(t([I18Keys.connectedAs]))}</Text>
              <Address address={address} chainId={CHAIN_ID}></Address>
            </Box>
            <Box margin={{ bottom: 'small' }}>
              <Text margin={{ bottom: '3px' }}>{cap(t([I18Keys.language]))}</Text>
              <LanguageSelector></LanguageSelector>
            </Box>

            <AppButton
              plain
              onClick={() => disconnect()}
              style={{ textTransform: 'none', paddingTop: '6px' }}
            >
              <Text style={{ fontWeight: 'bold' }}>{cap(t([I18Keys.logout]))}</Text>
            </AppButton>
          </Box>
        }
        dropProps={{ style: { marginTop: '60px' } }}
      ></AppCircleDropButton>
    )
  })()

  return (
    <Box style={{ width: '84px', height: '60px' }} align="center" justify="center">
      {content}
    </Box>
  )
}
