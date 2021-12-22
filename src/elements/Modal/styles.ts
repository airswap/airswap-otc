import styled from 'styled-components'

import { ModalPosition } from '../../app/context/ModalContext'
import { FadeIn } from '../../utils/styles/animations'
import { Flex } from '../Flex'

interface ModalContainerProps {
  isOpen: boolean
}

export const ModalContainer = styled(Flex).attrs({
  justify: 'center',
  align: 'center',
})<ModalContainerProps>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: #e5e5e57f;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  will-change: opacity;
  transition: ${({ theme }) => theme.animation.defaultTransition}s;
  animation: ${FadeIn} ${({ theme }) => `${theme.animation.defaultTransition}s`};
`

interface ModalContentProps {
  position: ModalPosition
}

export const ModalContent = styled.div<ModalContentProps>`
  background-color: white;
  border-radius: 15px;
  position: relative;
  max-width: 100vw;
  max-height: 100vh;
  overflow-y: auto;
  animation: ${FadeIn} ${({ theme }) => `${theme.animation.defaultTransition}s`};

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    ${({ position }) => {
      switch (position) {
        case ModalPosition.BOTTOM:
          return `
            position: absolute;
            bottom: 10px;
            width: auto;
            height: auto;
          `
        case ModalPosition.FULL_SCREEN:
          return `
            width: 100vw;
            height: 100vh;
            border-radius: 0;
          `
        case ModalPosition.CENTER:
        default:
          return `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: auto;
            height: auto;
          `
      }
    }}
  }
`
