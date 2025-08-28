import { Box, Image, Text } from 'grommet'
import { useState } from 'react'

import { Language, useAppLanguage } from '../../components/app/AppLanguage'
import { useResponsive } from '../../components/app/ResponsiveApp'
import { AppButton } from '../../ui-components/AppButton'
import { AppModal } from '../../ui-components/AppModal'
import { BoxCentered } from '../../ui-components/BoxCentered'

export const LanguageValue = (key: Language, hideIfMobile: boolean = false) => {
  const { mobile } = useResponsive()

  const flag = (() => {
    return <Image style={{ width: '24px' }} src={`/icons/${key}.\svg`}></Image>
  })()

  return (
    <Box direction="row" align="center" gap={!mobile ? 'small' : '0px'}>
      <Box>{mobile && hideIfMobile ? '' : `(${key})`}</Box>
      <Box margin={{ left: 'small' }}>{flag}</Box>
    </Box>
  )
}

export const LanguageSelector = (props: {}) => {
  const { selected, change } = useAppLanguage()
  const [showDrop, setShowDrop] = useState<boolean>(false)

  const changeLanguage = (key: Language) => {
    change(key)
    setShowDrop(false)
  }

  return (
    <>
      <AppButton
        plain
        label={<Text size="small">{LanguageValue(selected, false)}</Text>}
        onClick={() => setShowDrop(!showDrop)}
      ></AppButton>
      {showDrop ? (
        <AppModal onClosed={() => setShowDrop(false)} heading="Choose language">
          <BoxCentered pad="large" gap="medium" align="center" justify="center">
            {Object.keys(Language).map((key: string) => {
              return (
                <AppButton
                  style={{ width: '180px', textAlign: 'center' }}
                  key={key}
                  label={LanguageValue(key as Language, false)}
                  onClick={() => changeLanguage(key as Language)}
                ></AppButton>
              )
            })}
          </BoxCentered>
        </AppModal>
      ) : (
        <></>
      )}
    </>
  )
}
