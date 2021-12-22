import styled from 'styled-components'

import { ValidationUIVariant } from '../../Components/validationComponents/asValidationUI'
import { BlockElementProps } from '../../types/StyledComponentTypes'
import { InputSize } from './index'

interface PlaceholderProps {
  fontSize: number
  size: InputSize
}

export const Placeholder = styled.span<PlaceholderProps>`
  position: absolute;
  visibility: hidden;
  font-weight: ${({ size, theme }) => {
    switch (size) {
      case InputSize.LARGE:
        return theme.text.fontWeight.semibold
      case InputSize.SMALL:
      case InputSize.MEDIUM:
      default:
        return theme.text.fontWeight.regular
    }
  }};
  font-size: ${({ fontSize }) => `${fontSize}px`};
`

// Base Input Styles
interface BaseInputProps extends BlockElementProps {
  size: InputSize
  fontSize: number
  textAlign?: 'left' | 'center' | 'right'
  white?: boolean
  noPadding?: boolean
  colorVariant?: ValidationUIVariant
  opacity?: number
  placeholderOpacity?: number
  placeholderColor?: string
}

export const BaseInput = styled.input<BaseInputProps>`
  height: 100%;
  width: ${({ expand }) => (expand ? '100%' : 'auto')};
  box-sizing: border-box;
  padding: ${({ noPadding }) => (noPadding ? '0px' : '10px 0')};
  border-width: 1px;
  border-style: solid;
  overflow-x: auto;
  opacity: ${({ opacity }) => opacity || 1};
  text-align: ${({ textAlign }) => textAlign || 'left'};
  color: ${({ colorVariant, white, theme }) => {
    switch (colorVariant) {
      case ValidationUIVariant.ERROR:
        return theme.palette.errorColor
      default:
        return white ? 'white' : 'black'
    }
  }};
  border-color: ${({ colorVariant, white, theme }) => {
    switch (colorVariant) {
      case ValidationUIVariant.ERROR:
        return theme.palette.errorColor
      default:
        return white ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.10)'
    }
  }};
  outline: none;
  background-color: transparent;
  font-weight: ${({ size, theme }) => {
    switch (size) {
      case InputSize.LARGE:
        return theme.text.fontWeight.semibold
      case InputSize.SMALL:
      case InputSize.MEDIUM:
      default:
        return theme.text.fontWeight.regular
    }
  }};
  font-size: ${({ fontSize }) => `${fontSize}px`};
  will-change: auto;
  transition: ${({ theme }) => theme.animation.defaultTransition}s;

  &::placeholder {
    transition: ${({ theme }) => theme.animation.defaultTransition}s;
    color: ${({ colorVariant, white, theme }) => {
      switch (colorVariant) {
        case ValidationUIVariant.ERROR:
          return theme.palette.errorColor
        default:
          return white ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)'
      }
    }};
  }

  &:hover,
  &:active,
  &:focus {
    &::placeholder {
      color: ${({ white }) => (white ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)')};
    }
  }

  /* Hide Placeholder on focus */
  &:focus {
    &::-webkit-input-placeholder,
    &::placeholder {
      color: transparent;
    }

    &::-moz-placeholder,
    &:-moz-placeholder,
    &:-ms-input-placeholder {
      color: transparent;
    }
  }

  &[type='number'] {
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`

export const UnderlineInput = styled(BaseInput)`
  border-width: 0;
  border-bottom-width: 1px;
`

export const BlankInput = styled(BaseInput)`
  border: none;
`
