import styled from 'styled-components'

import { Flex } from '../Flex'
import { BaseText } from '../Typography'

interface VariantProps {
  variant: 'good' | 'bad' | 'unknown'
  white?: boolean
}

export const Container = styled(Flex).attrs({ direction: 'row', justify: 'center' })<VariantProps>`
  height: 18px;
  padding: 4px 4px 4px 6px;
  border-radius: 10px;
  border: 1px solid ${({ variant }) => (variant === 'bad' ? '#EC4523' : '#4BC68B')};
  background-color: ${({ white }) => (white ? 'white' : 'transparent')};
  box-shadow: ${({ white }) => (white ? '0px 1px 8px rgba(0, 0, 0, 0.25)' : 'none')};
`

export const Text = styled(BaseText)<VariantProps>`
  font-size: 9px;
  font-weight: 500;
  color: ${({ variant }) => (variant === 'bad' ? '#EC4523' : '#4BC68B')};
  margin-right: 5px;
`

export const IconContainer = styled(Flex)<VariantProps>`
  svg {
    width: 10px;
    height: 10px;

    path {
      fill: ${({ variant }) => (variant === 'bad' ? '#EC4523' : '#4BC68B')};
    }

    circle {
      stroke: ${({ variant }) => (variant === 'bad' ? '#EC4523' : '#4BC68B')};
    }
  }
`
