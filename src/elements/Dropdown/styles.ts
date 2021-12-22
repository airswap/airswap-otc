import styled from 'styled-components'

import { FadeIn } from '../../utils/styles/animations'
import { Flex } from '../Flex'

interface DropdownItemContainerProps {
  dropdownOpen: boolean
}

interface OpenDropdownProps {
  isOpen: boolean
}

export const OpenDropdown = styled(Flex)<OpenDropdownProps>`
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

export const DropdownItemContainer = styled(Flex)<DropdownItemContainerProps>`
  padding: 5px 10px;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: ${({ dropdownOpen, theme }) => (dropdownOpen ? theme.colors.gray[5] : 'white')};
  }

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    padding: 15px 10px;
    /* padding: ${({ dropdownOpen }) => (dropdownOpen ? '15px 0' : '5px 10px')}; */
    width: ${({ dropdownOpen }) => (dropdownOpen ? '100%' : '110px')};
    text-align: center;
  }
`

export const ChevronIconContainer = styled.img`
  position: absolute;
  right: 10px;
  width: 8px;
`

export const MobileSelectedItemContainer = styled(Flex)`
  margin: -10px 0;
  -webkit-tap-highlight-color: transparent;
`

interface SelectedItemContainerProps {
  isOpen: boolean
}

export const SelectedItemContainer = styled(Flex).attrs({
  expand: true,
  direction: 'row',
  justify: 'space-between',
})<SelectedItemContainerProps>`
  position: relative;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: ${({ theme }) => theme.animation.defaultTransition}s;

  &:hover {
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0.5)};
    will-change: opacity;
  }
`

export const DesktopDropdown = styled(Flex)`
  position: fixed;
  top: -5px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  z-index: 6;
  padding: 5px 0;
`

export const MobileDropdown = styled(Flex)`
  position: fixed;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background-color: white;
  z-index: 6;
  padding: 15px 0;
  border-radius: 10px;
`

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: #e5e5e57f;
`
