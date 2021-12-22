import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'

export const ModalContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
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

export const Status = styled(Flex)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 50px;
  background-color: ${({ theme }) => `${theme.palette.primaryColor}1A`};
`
