import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'
import { FadeIn } from '../../../utils/styles/animations'

interface OpenableProps {
  isOpen: boolean
}

export const MenuContainer = styled(Flex)<OpenableProps>`
  display: none;
  position: fixed;
  background-color: #e5e5e57f;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  will-change: opacity;
  transition: ${({ theme }) => theme.animation.defaultTransition}s;
  animation: ${FadeIn} ${({ theme }) => `${theme.animation.defaultTransition}s`};
`

export const MobileMenu = styled(Flex)`
  position: fixed;
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 6;
  padding-top: 30px;
  border-radius: 0;
`

export const DesktopMenu = styled(Flex)`
  position: absolute;
  width: 300px;
  background-color: white;
  border-radius: 10px;
  z-index: 6;
  overflow: auto;
`

export const Close = styled(Flex)`
  cursor: pointer;
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 2;
`

export const MenuItemContainer = styled(Flex).attrs({
  expand: true,
  justify: 'space-between',
  direction: 'row',
  align: 'flex-start',
})`
  flex-grow: 1;
  padding: 20px 30px;
  background-color: white;
  cursor: pointer;
  transition: ${({ theme }) => theme.animation.defaultTransition}s;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  &:hover {
    background-color: #f7f7f7;
  }

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    padding: 30px;

    &:hover {
      background-color: white;
    }
  }
`

interface IconContainerProps {
  stroke?: number
}

export const IconContainer = styled(Flex)<IconContainerProps>`
  flex-grow: 0;
  width: 20px;
  margin-right: 20px;

  svg {
    width: 20px;

    rect,
    path {
      stroke-width: ${({ stroke }) => stroke || 'inherit'};
    }
  }
`

export const GreenCircle = styled.div`
  width: 10px;
  height: 10px;
  content: '';
  background-color: ${({ theme }) => theme.palette.successColor};
  border-radius: 50%;
`

export const WalletDetailsContainer = styled(Flex).attrs({
  expand: true,
  justify: 'space-between',
  align: 'flex-start',
})`
  flex-grow: 1;
  padding: 30px 30px 25px 30px;
  background-color: white;
  transition: ${({ theme }) => theme.animation.defaultTransition}s;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    padding: 30px;
  }
`
