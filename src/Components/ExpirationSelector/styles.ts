import styled from 'styled-components'

import { Flex } from '../../elements/Flex'
import { H7 } from '../../elements/Typography'

interface ExpirationTypeLabelProps {
  isOpen?: boolean
}

export const ExpirationTypeLabel = styled(H7)<ExpirationTypeLabelProps>`
  width: 60px;
  margin-right: calc(10px + 8px);
  font-size: ${({ isOpen, theme }) => (isOpen ? theme.text.fontSize.h5 : theme.text.fontSize.h7)};
`

interface IconContainerProps {
  color?: string
}

export const IconContainer = styled(Flex)`
  margin-right: 20px;

  path {
    stroke: ${({ color, theme }) => color || theme.palette.primaryColor};
    stroke-width: 1.5px;
  }
`

export const ExpiresInLabel = styled(H7)`
  opacity: 0.25;
  margin-right: 10px;
  width: auto;
`

export const ExpirationSelectorContainer = styled(Flex).attrs({
  direction: 'row',
  align: 'center',
})``

export const InputContainer = styled(Flex)`
  width: 40px;
`

export const FixedExpirationSelectorContainer = styled(Flex).attrs({
  align: 'center',
})`
  width: 200px;
`
