import styled from 'styled-components'

import { Flex } from '../../elements/Flex'
import { BlockElementProps } from '../../types/StyledComponentTypes'
import { ValidationUIVariant } from './asValidationUI'

export const ValidationElementContainer = styled.div<BlockElementProps>`
  width: ${({ expand }) => (expand ? '100%' : 'auto')};
  height: 100%;
  position: relative;
`

interface ValidationErrorsProps {
  errorOffset?: number
  errorAlign?: 'left' | 'center' | 'right'
}

export const ValidationErrors = styled(Flex)<ValidationErrorsProps>`
  position: absolute;
  top: ${({ errorOffset }) => (errorOffset ? `calc(100% + ${errorOffset}px)` : '100%')};
  align-items: ${({ errorAlign }) => {
    switch (errorAlign) {
      case 'left':
        return 'flex-start'
      case 'right':
        return 'flex-end'
      case 'center':
      default:
        return 'center'
    }
  }};
  left: ${({ errorAlign }) => {
    switch (errorAlign) {
      case 'center':
        return '50%'
      case 'right':
        return '0'
      case 'left':
      default:
        return 'auto'
    }
  }};
  right: ${({ errorAlign }) => (errorAlign === 'right' ? 0 : 'auto')};
  transform: ${({ errorAlign }) => (errorAlign === 'center' ? 'translateX(-50%)' : 'none')};
`

export const ValidationUICustomError = styled.div`
  margin-top: 5px;
  font-size: 12px;
  font-weight: ${({ theme }) => theme.text.fontWeight.regular};
  width: max-content;
`

interface ValidationUIErrorProps {
  variant: ValidationUIVariant
}

export const ValidationUIError = styled.div<ValidationUIErrorProps>`
  margin-top: 10px;
  font-size: ${({ theme }) => theme.text.fontSize.h8};
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
  width: max-content;
  color: ${({ variant, theme }) => {
    switch (variant) {
      case ValidationUIVariant.SUCCESS:
        return theme.colors.green[0]
      case ValidationUIVariant.WARNING:
        return theme.colors.yellow[0]
      case ValidationUIVariant.ERROR:
        return theme.colors.red[1]
      case ValidationUIVariant.DEFAULT:
      default:
        return 'black'
    }
  }};
`
