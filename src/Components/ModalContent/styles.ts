import styled from 'styled-components'

import { Flex } from '../../elements/Flex'

interface IconContainerProps {
  position?: string
}

export const IconContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
})<IconContainerProps>`
  border-radius: 50%;
  position: ${({ position }) => position || 'relative'};
  background-color: ${({ theme }) => `${theme.palette.primaryColor}1A`};
  width: 60px;
  height: 60px;

  svg {
    width: 60px;
    height: 60px;
  }

  img {
    margin: auto;
    width: 50px;
    height: 50px;
  }
`

export const BlockH6 = styled(Flex).attrs({
  expand: true,
})`
  text-align: center;
  font-weight: ${({ theme }) => theme.text.fontWeight.light};
`
