import styled from 'styled-components'

import { ValidationUIVariant } from '../../Components/validationComponents/asValidationUI'
import { BlockElementProps } from '../../types/StyledComponentTypes'
import { Flex } from '../Flex'
import { H7 } from '../Typography'

interface DisplayLabelContainerProps extends BlockElementProps {
  bold?: boolean
  white?: boolean
  colorVariant?: ValidationUIVariant
  color?: string
}

export const DisplayLabelContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'space-between',
  direction: 'row',
  expand: true,
})<DisplayLabelContainerProps>`
  ${({ color, white, theme, colorVariant }) => {
    switch (colorVariant) {
      case ValidationUIVariant.ERROR:
        return `
          background-color: ${theme.palette.errorColor}1A;
        `
      default:
        return `
          background-color: ${white ? 'rgba(255, 255, 255, 0.1)' : `${color || theme.palette.primaryColor}1A`};
        `
    }
  }}
  border-radius: 10px;
  padding: 5px 5px 5px 20px;
  height: 50px;
  max-width: 400px;
  font-size: ${({ theme }) => theme.text.fontSize.h6};
  color: ${({ white }) => (white ? 'white' : 'black')};
  font-weight: ${({ bold, theme }) => (bold ? theme.text.fontWeight.medium : theme.text.fontWeight.regular)};
  width: ${({ expand }) => (expand ? '100%' : 'auto')};
`

interface DisplayLabelValueProps {
  white?: boolean
  colorVariant?: ValidationUIVariant
}

export const DisplayLabelValue = styled.div<DisplayLabelValueProps>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 10px;
  text-decoration: ${({ colorVariant }) => (colorVariant === ValidationUIVariant.ERROR ? 'line-through' : 'none')};
  color: ${({ colorVariant, white, theme }) =>
    colorVariant === ValidationUIVariant.ERROR ? theme.palette.errorColor : white ? 'white' : 'black'};
`

interface ClickToCopyContainerProps {
  color?: string
}

export const ClickToCopyContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
})`
  flex-shrink: 0;
  position: relative;
  border-radius: 10px;
  padding: 10px;
  background-color: ${({ color, theme }) => color || theme.palette.primaryColor};
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;

    rect,
    path {
      stroke: white;
    }
  }
`

interface TooltipContainerProps {
  showCopiedTooltip: boolean
}

export const TooltipContainer = styled(Flex)<TooltipContainerProps>`
  position: absolute;
  left: 50%;
  top: -100%;
  transform: translateX(-50%);
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  opacity: ${({ showCopiedTooltip }) => (showCopiedTooltip ? '1' : '0')};
  will-change: opacity;
  transition: ${({ theme }) => `${theme.animation.defaultTransition}s`};
`

export const TooltipText = styled(H7)`
  color: white;
`
