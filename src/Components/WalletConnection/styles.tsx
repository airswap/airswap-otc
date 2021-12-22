import styled from 'styled-components'

import { Flex } from '../../elements/Flex'
import { H1 } from '../../elements/Typography'

export const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
`

export const ModalHeader = styled(H1)`
  color: white;
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
  margin-bottom: 60px;
`

export const WalletRow = styled(Flex)`
  padding: 0 50px;
  height: 420px;
`

export const Close = styled(Flex)`
  cursor: pointer;
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 2;
`

export const Back = styled(Flex).attrs({
  direction: 'row',
})`
  cursor: pointer;
  position: absolute;
  margin-right: 10px;
  top: 50px;
  left: 50px;
  z-index: 2;

  svg {
    path {
      stroke: white;
    }
  }
`

interface WalletConnectionContainerProps {
  backgroundColor?: string
}

export const WalletConnectionContainer = styled(Flex).attrs({
  justify: 'center',
})<WalletConnectionContainerProps>`
  width: 100%;
  height: 100%;
  background-color: ${({ backgroundColor, theme }) => backgroundColor || theme.palette.primaryColor};
  position: relative;
`
