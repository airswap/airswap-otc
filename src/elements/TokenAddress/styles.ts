import styled from 'styled-components'

import { Flex } from '../Flex'
import { H9 } from '../Typography'

interface WhiteProps {
  white?: boolean
  large?: boolean
}

export const Container = styled(Flex).attrs({ direction: 'row' })<WhiteProps>`
  cursor: pointer;
  transition: 0.4s;
  border-bottom: 1px solid transparent;

  &:hover {
    border-color: ${({ white }) => (white ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)')};
  }
`

interface IconContainerProps {
  variant?: 'good' | 'bad' | 'unknown'
  white?: boolean
}

export const IconContainer = styled(Flex)<IconContainerProps>`
  svg {
    width: 7px;
    height: 7px;

    path {
      stroke: ${({ white, variant }) => {
        switch (variant) {
          case 'bad':
            return '#EC4523'
          case 'unknown':
          case 'good':
          default:
            return white ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
        }
      }};
    }
  }
`

export const AddressText = styled(H9)<WhiteProps>`
  color: ${({ white }) => (white ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)')};
  margin-right: 5px;
  font-size: ${({ large, theme }) => (large ? theme.text.fontSize.h7 : theme.text.fontSize.h9)};
`
