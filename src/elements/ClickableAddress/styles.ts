import styled from 'styled-components'

import { Flex } from '../Flex'
import { H4, H7 } from '../Typography'

export const CopyIconContainer = styled(Flex)`
  margin-right: 5px;

  svg {
    width: 15px;
    height: 15px;

    path,
    rect {
      stroke: ${({ theme }) => theme.palette.primaryColor};
    }
  }
`

export const TooltipText = styled(H7)`
  color: white;
`

export const TooltipTextBody = styled.p`
  width: 100%;
  color: inherit;
  font-weight: inherit;
  font-size: inherit;
`

export const TooltipTextHeader = styled(H4)`
  color: inherit;
  font-weight: inherit;
  font-size: inherit;
`

export const LinkContainer = styled(Flex).attrs({
  direction: 'row',
  expand: true,
})`
  cursor: pointer;
`
