import styled from 'styled-components'

import { Flex } from '../Flex'
import { ArrowDirection } from './index'

interface ArrowContainerProps {
  arrowDirection: ArrowDirection
  active: boolean
  rotate: number
  color?: string
}

export const ArrowContainer = styled(Flex)<ArrowContainerProps>`
  background-color: white;
  opacity: ${({ active }) => (active ? '1' : '0.5')};
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor: ${({ active }) => (active ? 'pointer' : 'cursor')};
  transform: ${({ rotate }) => `rotate(${rotate}deg)`};
  will-change: opacity;
  transition: transform 0.3s ease, opacity 0.3s;

  svg {
    width: 20px;
    path {
      stroke: ${({ color, theme }) => color || theme.palette.primaryColor};
    }
  }

  &:hover {
    opacity: ${({ active }) => (active ? 0.85 : 0.5)};
  }
`
