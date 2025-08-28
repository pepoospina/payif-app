import { Duration } from 'date-fns'
import { Box, Text } from 'grommet'

export interface IAppRemainingTime {
  compactFormat?: boolean
  remainingTime: Duration
  suffix?: string
}

export const AppRemainingTime = (props: IAppRemainingTime) => {
  const { compactFormat, remainingTime } = props

  const remainignTimeUI = (): JSX.Element => {
    if (compactFormat)
      return (
        <Box direction="row" gap="2px">
          <Text>
            <strong>{remainingTime.days}</strong> <span> days {props.suffix}</span>
          </Text>
        </Box>
      )
    else
      return (
        <Box gap="10px" direction="row">
          <Box direction="row" gap="2px">
            <strong>{remainingTime.days}</strong> <span> days</span>
          </Box>
          <Box direction="row" gap="2px">
            <strong>{remainingTime.hours}</strong> <span> hours</span>
          </Box>
          <Box direction="row" gap="2px">
            <strong>{remainingTime.minutes}</strong> <span> minutes</span>
          </Box>
          <Box direction="row" gap="2px">
            <strong>{remainingTime.seconds}</strong> <span> seconds {props.suffix}</span>
          </Box>
        </Box>
      )
  }

  return remainignTimeUI()
}
