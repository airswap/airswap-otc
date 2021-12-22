import styled from 'styled-components'

import { Flex } from '../../elements/Flex'
import { Pulse } from '../../utils/styles/animations'

const HeaderWrapper = styled(Flex).attrs({
  expand: true,
  direction: 'row',
  justify: 'space-between',
})``

export const DesktopHeaderContainer = styled(Flex).attrs({
  expand: true,
})`
  padding: 30px 60px;
  height: 100px;
`

export const DesktopHeaderContent = styled(HeaderWrapper)`
  max-width: ${({ theme }) => theme.fixed.maxWidth};
  margin: auto;
`

export const MobileHeaderContainer = styled(HeaderWrapper)`
  padding: 20px;
  height: 70px;
`

export const LogoContainer = styled(Flex)`
  cursor: pointer;
`

interface NavItemProps {
  isDisconnect?: boolean
  isConnected?: boolean
  white?: boolean
}

const NavItem = styled(Flex)<NavItemProps>`
  position: relative;
  padding: 11px 20px;
  border-radius: 20px;
  cursor: pointer;
  width: ${({ isConnected }) => (isConnected ? '140px' : 'auto')};
  transition: ${({ theme }) => theme.animation.defaultTransition}s;
  will-change: width;
`

export const PrimaryNavItem = styled(NavItem)`
  background-color: ${({ theme }) => theme.palette.primaryColor}1A;
  color: ${({ theme }) => theme.palette.primaryColor};

  &:hover {
    background-color: ${({ isDisconnect, theme }) =>
      isDisconnect ? theme.palette.errorColor : theme.palette.successColor};
    color: white;
  }
`

export const WhitePrimaryNavItem = styled(PrimaryNavItem)`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
`

export const SecondaryNavItem = styled(NavItem)`
  background-color: transparent;
  color: black;

  &:hover {
    background-color: transparent;
    color: black;
    opacity: 0.5;
  }
`

export const MobileNavIconContainer = styled(Flex)`
  svg {
    width: 24px;
  }

  &:not(:last-child) {
    margin-right: 20px;
  }
`

export const NotificationCircle = styled(Flex).attrs({
  justify: 'center',
  align: 'center',
})`
  background-color: ${({ theme }) => theme.palette.primaryColor};
  text-align: center;
  color: white;
  border-radius: 50%;
  position: absolute;
  font-weight: ${({ theme }) => theme.text.fontWeight.semibold};
  font-size: 10px;
  top: 0;
  right: 0;
  width: 17px;
  height: 17px;
  animation: ${Pulse} 2s infinite;
`
