import styled from 'styled-components'

import { Flex } from '../../../../elements/Flex'
import { H6, H7 } from '../../../../elements/Typography'

interface ColorProps {
  color?: string
}

export const OrderSummaryContainer = styled.div<ColorProps>`
  width: 100%;
  height: 100%;
  margin: auto;
  background-color: ${({ color, theme }) => color || theme.palette.primaryColor};
  border-radius: 25px;
`

export const LightH6 = styled(H6).attrs({ weight: 200, color: 'rgba(255, 255, 255, 0.5)', textAlign: 'left' })``

export const OrderSummaryColumn = styled.div`
  width: 100%;

  &:not(:last-child) {
    margin-right: 20px;
  }
`

export const EtherscanButtonIcon = styled(Flex)<ColorProps>`
  margin-left: 10px;

  svg {
    width: 20px;

    path {
      stroke: ${({ color, theme }) => color || theme.palette.primaryColor};
      stroke-width: 2.2px;
    }
  }
`

export const DisplayLabelHeader = styled(H7).attrs({
  textAlign: 'left',
})`
  font-weight: ${({ theme }) => theme.text.fontWeight.regular};
  color: white;
  opacity: 0.5;
  margin: 10px;
`

export const PriceLabel = styled(H7).attrs({
  textAlign: 'left',
})`
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
  color: white;
  opacity: 0.25;
  padding: 10px;
`

export const TopContainer = styled(Flex).attrs({})<ColorProps>`
  width: 100%;
  height: 460px;
  background-color: ${({ color, theme }) => color || theme.palette.primaryColor};
  padding: 55px 0 25px 0;
  box-sizing: border-box;
  flex-direction: column;
  border-radius: 25px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    padding: 50px 30px 30px 30px;
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
})<ColorProps>`
  width: 100%;
  margin: auto;
  height: 160px;
  background-color: ${({ color, theme }) => color || theme.palette.primaryColor};
  padding: 0 70px;
  box-sizing: border-box;
  border-radius: 15px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    flex-direction: column;
    height: auto;
    padding: 30px;
    align-items: flex-start;
  }
`

export const DisplayLabelWrapper = styled(Flex)`
  width: 275px;
`

export const CreateOrderTextButton = styled(H7)`
  color: ${({ theme }) => theme.colors.gray[0]};
  cursor: pointer;
`

export const BlockH5 = styled.div`
  text-align: left;
  display: inline-flex;
  color: white;
  font-weight: ${({ theme }) => theme.text.fontWeight.light};
  font-size: ${({ theme }) => theme.text.fontSize.h5};
`
