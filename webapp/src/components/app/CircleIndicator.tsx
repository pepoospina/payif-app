import { ReactNode } from 'react'

import { BoxCentered } from '../../ui-components/BoxCentered'

export const CircleIndicator = (props: {
  icon: ReactNode
  size?: number
  borderWidth?: string
  forceCircle?: boolean
}) => {
  const forceCircle = props.forceCircle !== undefined ? props.forceCircle : true
  const size = props.size || 36

  return (
    <BoxCentered
      style={{
        height: `${size}px`,
        width: forceCircle ? size : 'fit-content',
        backgroundColor: 'black',
        border: 'solid white',
        borderWidth: props.borderWidth || '4px',
        borderRadius: `${size / 2}px`,
      }}
      pad={{ horizontal: forceCircle ? '0px' : 'medium' }}
      direction="row"
    >
      {props.icon}
    </BoxCentered>
  )
}
