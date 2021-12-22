import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'

const ModalContainer = styled(Flex).attrs({
  justify: 'space-around',
})`
  width: 400px;
  height: 400px;
  border-radius: 25px;
  padding: 50px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    margin: auto;
    width: calc(100vw - 20px);
    height: 350px;
  }
`

const IconContainer = styled(Flex)`
  margin-top: 10px;
`

const Close = styled(Flex)`
  cursor: pointer;
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 2;
`

export { ModalContainer, Close, IconContainer }
