import styled from 'styled-components'

import { Flex } from '../Flex'

export const CardShadow = styled(Flex)`
  position: absolute;
  z-index: -1;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  height: 200px;
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
`

export const CardContainer = styled(Flex)`
  position: relative;
  width: 100%;
  height: 100%;
`

export const CardContent = styled(Flex)`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
`
