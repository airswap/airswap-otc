import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'
import { H1, H3, H4, H7, H8 } from '../../../elements/Typography'

interface TopContainerProps {
  color?: string
}

export const TopContainer = styled(Flex).attrs({
  expand: true,
  align: 'center',
  justify: 'center',
})<TopContainerProps>`
  height: 460px;
  padding: 0 45px;
  background-color: ${({ color, theme }) => color || theme.palette.primaryColor};
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    padding: 70px 50px 70px 50px;
    height: auto;
  }
`

export const TokenLabelContainer = styled(Flex)`
  margin-bottom: 20px;
`

export const TokenWarningText = styled(H8)`
  font-weight: 400;
  font-size: 11px;
  line-height: 14px;
  color: #ffffff;
  width: 240px;
`

export const ClickableTokenWarningText = styled.p`
  font-weight: 400;
  font-size: 11px;
  text-decoration: underline;
  text-decoration-color: #ffffff;
  display: inline;
  cursor: pointer;
`

export const TokenWarningHighlightText = styled.p`
  font-weight: 400;
  font-size: 11px;
  color: #ffc30d;
  display: inline;
`

export const CustomError = styled(H8)`
  color: white;
  opacity: 0.5;
`

export const Title = styled(H1)`
  margin-bottom: 20px;
  color: white;
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    font-weight: ${({ theme }) => theme.text.fontWeight.regular};
  }
`

export const Subtitle = styled(H4)`
  margin-bottom: 60px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: ${({ theme }) => theme.text.fontWeight.light};
`

export const OrderDetails = styled(Flex).attrs({
  direction: 'row',
  expand: true,
})`
  margin-bottom: 40px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    flex-direction: column;
    margin-bottom: 15px;
  }
`

export const ArrowContainer = styled(Flex)`
  width: 20%;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    margin: 70px 0;
  }
`

export const SendReceiveContent = styled(Flex).attrs({
  expand: true,
})`
  width: 40%;
  text-align: ${({ align }) => align};

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    width: 100%;
    align-items: center;
  }
`

export const SendReceiveContentHeader = styled(H3)`
  color: white;
  margin-bottom: 30px;
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
`

export const BottomContainer = styled(Flex).attrs({
  expand: true,
})`
  padding: 0 45px;
  background-color: white;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    padding: 70px 30px 30px 30px;
  }
`
export const BottomContainerContent = styled(Flex).attrs({
  direction: 'row',
  justify: 'center',
  expand: true,
})`
  height: 160px;
  max-width: 900px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    height: auto;
    flex-direction: column;
  }
`

export const BottomContainerItem = styled(Flex)`
  position: relative;
  max-width: 400px;
  width: 100%;

  &:not(:last-child) {
    margin-right: 60px;
  }

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    width: 100%;
    margin: 0;

    &:not(:last-child) {
      margin-right: 0;
      margin-bottom: 50px;
    }
  }
`

export const BottomContainerItemLabel = styled(H7)`
  position: absolute;
  bottom: 100%;
  left: 0;
  opacity: 0.5;
  text-align: left;
  padding: 10px;
`

export const TakeOrderButtonIcon = styled(Flex)`
  margin-left: 10px;

  svg {
    width: 20px;

    path {
      stroke: white;
      stroke-width: 2.2px;
    }
  }
`

export const BlockH7 = styled.div`
  display: inline-flex;
  text-align: left;
  font-size: ${({ theme }) => theme.text.fontSize.h7};
  font-weight: ${({ theme }) => theme.text.fontSize.regular};
`
