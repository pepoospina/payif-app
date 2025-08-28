import { Button, ButtonExtendedProps, DropButton, DropButtonExtendedProps } from 'grommet'
import { useState } from 'react'

import { useResponsive } from '../components/app/ResponsiveApp'
import { useThemeContext } from '../components/app/ThemedApp'
import { AppModal, IAppModal } from './AppModal'

export interface IButton extends ButtonExtendedProps {}

const circleButtonStyle: React.CSSProperties = {
  width: '56px',
  height: '56px',
  padding: '6px',
  border: '2px solid',
  borderRadius: '50%',
  textAlign: 'center',
}

export const AppButton = (props: IButton) => {
  return (
    <>
      <Button {...props} style={{ textTransform: 'uppercase', ...props.style }} />
    </>
  )
}

export const AppCircleButton = (props: IButton) => {
  const { constants } = useThemeContext()
  circleButtonStyle.borderColor = constants.colors.primary

  return (
    <AppButton
      {...props}
      plain
      label=""
      style={{ ...circleButtonStyle, ...props.style }}
    ></AppButton>
  )
}

export const AppButtonResponsive = (props: IButton) => {
  const { mobile } = useResponsive()
  return mobile ? (
    <AppCircleButton {...props}></AppCircleButton>
  ) : (
    <AppButton {...props}></AppButton>
  )
}

export const AppCircleDropButton = (props: DropButtonExtendedProps) => {
  const { constants } = useThemeContext()
  circleButtonStyle.borderColor = constants.colors.primary

  return (
    <DropButton
      {...props}
      plain
      style={{ ...circleButtonStyle, ...props.style }}
    ></DropButton>
  )
}

export const AppCircleDropButtonResponsive = (props: DropButtonExtendedProps) => {
  const { mobile } = useResponsive()
  return !mobile ? (
    <DropButton {...props}></DropButton>
  ) : (
    <AppCircleDropButton {...props}></AppCircleDropButton>
  )
}

export const AppModalButtonResponsive = (props: {
  buttonProps: IButton
  modalProps: IAppModal
}) => {
  const [showDrop, setShowDrop] = useState<boolean>(false)

  return (
    <>
      <AppButton onClick={() => setShowDrop(!showDrop)} {...props.buttonProps}></AppButton>
      {showDrop ? (
        <AppModal onClosed={() => setShowDrop(false)} {...props.modalProps}></AppModal>
      ) : (
        <></>
      )}
    </>
  )
}
