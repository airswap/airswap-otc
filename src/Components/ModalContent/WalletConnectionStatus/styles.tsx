import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'

interface ModalContainerProps {
  size?: number
}

export const ModalContainer = styled(Flex)<ModalContainerProps>`
  width: ${({ size }) => (size ? `${size}px` : '400px')};
  height: ${({ size }) => (size ? `${size}px` : '400px')};
  border-radius: 25px;
  padding: 50px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    margin: auto;
    width: calc(100vw - 20px);
  }
`

export const Close = styled(Flex)`
  cursor: pointer;
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 2;
`
