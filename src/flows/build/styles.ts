import styled from 'styled-components'

import { Flex } from '../../elements/Flex'
import { H8 } from '../../elements/Typography'

export const AvailableForTradeContainer = styled(Flex).attrs({ direction: 'row' })``

interface AvailableAmountProps {
  locked: boolean
}

export const AvailableAmount = styled(H8)<AvailableAmountProps>`
  width: auto;
  flex-shrink: 0;
  opacity: 0.5;
  color: white;
  margin-right: 5px;
  text-decoration: ${({ locked }) => (locked ? 'none' : 'underline')};
  cursor: ${({ locked }) => (locked ? 'default' : 'pointer')};
`

export const AvailableForTradeText = styled(H8)`
  color: white;
  opacity: 0.5;
`
