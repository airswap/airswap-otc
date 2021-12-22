import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'

export const ApproveTokenContainer = styled(Flex)`
  width: 400px;
  height: 450px;
  border-radius: 25px;
  padding: 50px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    margin: auto;
    height: 400px;
    width: calc(100vw - 25px);
    padding: 25px;
  }
`

export const Close = styled(Flex)`
  cursor: pointer;
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 2;
`
