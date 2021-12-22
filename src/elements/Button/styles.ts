import styled from 'styled-components'

import { RippleAnimation } from '../../utils/styles/animations'
import { ButtonSize } from './index'

interface DefaultButtonProps {
  size?: ButtonSize
  color?: string
  backgroundColor?: string
  hoverColor?: string
  expand?: boolean
}

const BaseButton = styled.button`
  position: relative;
  cursor: pointer;
  border: none;
  outline: none;

  &:disabled {
    cursor: not-allowed;
  }
`

const DefaultButton = styled(BaseButton)<DefaultButtonProps>`
  border-radius: 30px;
  width: ${({ expand }) => (expand ? '100%' : 'auto')};
  font-size: ${({ theme }) => theme.text.fontSize.h7};
  will-change: auto;
  transition: ${({ theme }) => theme.animation.defaultTransition}s;
  outline: none;
  ${({ theme, size }) => {
    switch (size) {
      case ButtonSize.SMALL:
        return `
          padding: 10px;
        `
      case ButtonSize.LARGE:
        return `
          padding: 13px 25px;
          min-width: 120px;

          @media (max-width: ${theme.breakpoints.sm[1]}px) {
            padding: 17px 25px;
          }
        `
      case ButtonSize.MEDIUM:
      default:
        return `
          padding: 10px 20px;
          min-width: 100px;
        `
    }
  }}

  &:disabled {
    opacity: 0.25;
  }
`

export const PrimaryButton = styled(DefaultButton)`
  background-color: ${({ backgroundColor, theme }) => backgroundColor || theme.palette.primaryColor};
  color: ${({ color }) => color || 'white'};
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};

  &:hover {
    &:not(:disabled) {
      background-color: ${({ backgroundColor, hoverColor }) => hoverColor || `${backgroundColor}1A` || '#2055bf'};
    }
  }
`

export const SecondaryButton = styled(DefaultButton)`
  color: ${({ color, theme }) => color || theme.palette.primaryColor};
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
  background-color: #f7f7f7;

  &:hover {
    &:not(:disabled) {
      opacity: 0.75;
    }
  }
`

export const BlankButton = styled(BaseButton)`
  background-color: transparent;
  padding: 0;
  font-size: ${({ theme }) => theme.text.fontSize.h7};
  color: ${({ color }) => color || 'white'};
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};

  &:hover {
    &:not(:disabled) {
      opacity: 0.75;
    }
  }
`

export const LinkButton = styled(BaseButton)`
  text-decoration: underline;
  background: none;
  font-size: ${({ theme }) => theme.text.fontSize.h8};
  display: inline-block;
  padding: 0;
  color: ${({ color }) => color || 'white'};
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};

  &:hover {
    &:not(:disabled) {
      opacity: 0.75;
    }
  }
`

export const RippleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
`

export const Ripple = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  width: 50%;
  padding-bottom: 50%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);

  &.show-ripple {
    animation: ${RippleAnimation} 0.3s ease-in;
  }
`
