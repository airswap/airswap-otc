import styled from 'styled-components'

export interface FlexProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  expand?: boolean
  height?: string
  children?: React.ReactNode
  opacity?: number
}

interface FlexItemProps extends FlexProps {
  flex?: number | string
}

const Flex = styled.div<FlexProps>`
  display: flex;
  box-sizing: border-box;
  flex-direction: ${({ direction }) => direction || 'column'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  align-items: ${({ align }) => align || 'center'};
  flex-wrap: ${({ wrap }) => wrap || 'nowrap'};
  width: ${({ expand }) => (expand ? '100%' : 'auto')};
  opacity: ${({ opacity }) => (opacity !== undefined ? opacity : 1)};
  height: ${({ height }) => height || 'auto'};
`
Flex.displayName = 'Flex'
Flex.defaultProps = {
  direction: 'column',
  justify: 'flex-start',
  align: 'center',
  wrap: 'nowrap',
}

const FlexItem = styled(Flex)<FlexItemProps>`
  flex: ${({ flex }) => flex || 1};
`
FlexItem.displayName = 'FlexItem'
FlexItem.defaultProps = {
  ...Flex.defaultProps,
  flex: 1,
}

export { Flex, FlexItem }
