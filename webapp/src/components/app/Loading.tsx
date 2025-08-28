import { Box, Spinner, Text } from 'grommet'
import { useTranslation } from 'react-i18next'

import { I18Keys } from '../../i18n/kyel.list'
import { cap } from '../../utils/general'

export const Loading = (props: { label?: string }) => {
  const { t } = useTranslation()
  return (
    <Box align="center">
      <Box margin={{ bottom: 'small' }}>
        <Text>{props.label === undefined ? '' : cap(t([I18Keys.loading]))}</Text>
      </Box>
      <Box style={{ margin: '16px 0px' }} align="center" justify="center">
        <Spinner></Spinner>
      </Box>
    </Box>
  )
}

export const WaitingTransaction = () => {
  const { t } = useTranslation()
  return <Loading label={t([I18Keys.waitingTx])}></Loading>
}
