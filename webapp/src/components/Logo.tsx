import { Box, BoxExtendedProps, Image } from 'grommet'

import { useThemeContext } from './app'

interface ILogo extends BoxExtendedProps {
  compact?: boolean
}

export const Logo = (props: ILogo) => {
  const { constants } = useThemeContext()

  const compact = props.compact !== undefined ? props.compact : false
  return (
    <Box
      {...props}
      justify="center"
      align="center"
      direction="row"
      gap="14px"
      style={{
        height: '60px',
        fontSize: constants.headingFontSizes[2],
        fontWeight: '700',
        textDecoration: 'none',
        color: constants.colors.primary,
      }}
    >
      <Image width="32px" height="32px" src="/images/Logo.png" />
      {compact ? <></> : 'Logo'}
    </Box>
  )
}
