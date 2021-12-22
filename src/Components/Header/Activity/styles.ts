import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'
import { H5, H7 } from '../../../elements/Typography'
import { FadeIn } from '../../../utils/styles/animations'

interface TabCellProps {
  isSelected: boolean
  connectedWalletAddress: string
}

interface DropdownProps {
  isOpen: boolean
}

interface OpenableProps {
  isOpen: boolean
}

export const LinkContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
})`
  height: 25px;
  max-width: 200px;
  overflow: hidden;
`

export const ConnectingIconContainer = styled(Flex)`
  margin-bottom: 20px;

  svg {
    width: 60px;
  }
`

export const DesktopDropdown = styled(Flex)`
  position: absolute;
  width: 400px;
  height: 350px;
  background-color: white;
  border-radius: 10px;
  z-index: 6;
  padding: 5px 0;
  overflow: auto;
`

export const OpenDropdown = styled(Flex)<OpenableProps>`
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

export const Close = styled(Flex)`
  cursor: pointer;
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 2;
`

export const ConnectText = styled(H5)`
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
  color: ${({ theme }) => theme.palette.primaryColor};
  cursor: pointer;
`

export const TabContainer = styled(Flex)`
  height: 50px;
`
export const TabCell = styled(Flex).attrs({ expand: true })<TabCellProps>`
  border-bottom: ${({ isSelected, connectedWalletAddress }) =>
    isSelected && connectedWalletAddress ? '2px solid rgba(0, 0, 0, 1)' : '1px solid rgba(0, 0, 0, 0.1)'};
  height: 50px;
  cursor: pointer;
`

export const MobileDropdown = styled(Flex)`
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 6;
  padding: 15px 0;
  border-radius: 0;
  overflow: auto;
`

export const FinalizedItemContainer = styled(Flex)`
  min-height: 80px;
  padding: 20px;
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
`

export const EtherscanLink = styled(H7)`
  color: ${({ theme }) => theme.palette.primaryColor};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.palette.primaryColor};
  cursor: pointer;
`
