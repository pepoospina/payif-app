export interface IElement {
  onClick?: () => void
  style?: React.CSSProperties
  children?:
    | JSX.Element
    | React.ReactNode
    | Array<React.ReactNode>
    | Array<JSX.Element>
    | string
}
