import styled from 'styled-components'

import { Flex } from '../../elements/Flex'
import { H3 } from '../../elements/Typography'

// Top Container Styles
interface ReversableProps {
  isReverse: boolean
}

interface TopContainerProps {
  backgroundColor?: string
}

export const TopContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
})<TopContainerProps>`
  width: 100%;
  height: 460px;
  background-color: ${({ backgroundColor, theme }) => backgroundColor || theme.palette.primaryColor};
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    height: auto;
  }
`

export const SendReceiveFormHeader = styled(Flex)`
  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    padding: 70px 30px 0 30px;
  }
`

export const SendReceiveFormContent = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
  expand: true,
})`
  flex-direction: row;
  padding: 0 45px;
  margin-bottom: 40px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    flex-direction: column;
    padding: 70px;
  }
`

export const FormTitleContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
  expand: true,
  direction: 'row',
})`
  padding: 0 45px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    padding: 70px;
  }
`

export const FormTitleSpacer = styled(Flex)`
  width: 20%;
  flex-shrink: 0;
  content: '';
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

export const SendReceiveInput = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
})`
  width: auto;
  min-width: 100px;
  height: 65px;
`

export const SendReceiveContentHeader = styled(H3)`
  color: white;
  margin-bottom: 20px;
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
`

// Bottom Container Styles
export const BottomContainer = styled(Flex).attrs({
  align: 'center',
  direction: 'row',
  justify: 'center',
})`
  width: 100%;
  height: 160px;
  background-color: white;
  padding: 0 70px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    flex-direction: column;
    height: auto;
    padding: 30px;
    align-items: flex-start;
  }
`

export const CounterpartyAddressInputContainer = styled(Flex)`
  /* width: 50%; */
  max-width: 450px;
  width: 100%;
  margin-right: 55px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    width: 100%;
    margin: 0;
    margin-bottom: 50px;
    max-width: 100%;
  }
`

export const CreateOrderButtonIcon = styled(Flex)`
  margin-left: 10px;

  svg {
    width: 20px;

    path {
      stroke: white;
      stroke-width: 2.2px;
    }
  }
`

export const ExpirationSelectorContainer = styled(Flex)`
  flex-shrink: 0;
  margin-right: 60px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    width: 100%;
    margin: 0;
    margin-bottom: 50px;
    align-items: flex-start;
  }
`

export const SubmitButtonContainer = styled(Flex)`
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`
