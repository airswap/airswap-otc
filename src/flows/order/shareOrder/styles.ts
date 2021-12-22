import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'
import { H7 } from '../../../elements/Typography'

interface ColorProps {
  color?: string
}

export const OrderSummaryContainer = styled.div<ColorProps>`
  width: 100%;
  height: 100%;
  margin: auto;
  background-color: ${({ color, theme }) => color || theme.palette.primaryColor};
`

export const DisplayLabelHeader = styled(H7)`
  font-weight: ${({ theme }) => theme.text.fontWeight.regular};
  color: white;
  opacity: 0.5;
  box-sizing: border-box;
  padding: 10px;
`

export const PriceLabel = styled(H7).attrs({
  textAlign: 'left',
})`
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
  color: white;
  opacity: 0.25;
  box-sizing: border-box;
  padding: 10px;
`

export const OrderSummaryColumn = styled.div`
  width: 100%;

  &:not(:last-child) {
    margin-right: 20px;
  }
`

export const TopContainer = styled(Flex)<ColorProps>`
  width: 100%;
  height: 460px;
  background-color: ${({ color, theme }) => color || theme.palette.primaryColor};
  padding: 25px 0;
  box-sizing: border-box;
  flex-direction: column;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    padding: 50px 30px 50px 30px;
    height: auto;
  }
`

export const LabelContainer = styled(Flex)`
  flex-direction: row;
  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    flex-direction: column;
  }
`

export const LabelColumn = styled(Flex)`
  margin: 0 45px;
  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    margin: 0;
  }
`

export const BottomContainer = styled(Flex).attrs({
  align: 'center',
  direction: 'column',
  justify: 'center',
  expand: true,
})`
  width: 100%;
  margin: auto;
  height: 160px;
  background-color: white;
  padding: 0 70px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    height: auto;
    padding: 30px;
  }
`

export const DisplayLabelWrapper = styled(Flex)`
  width: 275px;
`

export const CreateOrderTextButton = styled(H7)<ColorProps>`
  color: ${({ color, theme }) => color || theme.palette.primaryColor};
  cursor: pointer;
`

export const CancelCreateContainer = styled(Flex).attrs({
  expand: true,
  direction: 'row',
  justify: 'space-between',
})`
  padding: 0 10px;
`

interface DisabledProps {
  disabled?: boolean
}

export const CancelOrderTextButton = styled(H7).attrs({ textAlign: 'left' })<DisabledProps>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: rgba(0, 0, 0, 0.25);
`

export const BottomShareContainer = styled(Flex).attrs({ expand: true })`
  max-width: 400px;
`

interface BlockH5Props {
  weight?: string
}

export const BlockH5 = styled.div<BlockH5Props>`
  display: 'inline-flex';
  color: white;
  text-align: 'left';
  font-size: ${({ theme }) => theme.text.fontSize.h5};
  font-weight: ${({ weight, theme }) => weight || theme.text.fontWeight.medium};
`
