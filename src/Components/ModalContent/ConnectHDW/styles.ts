import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'
import { hexWithOpacity } from '../../../utils/styles/utils'

export const ConnectHDWContainer = styled(Flex).attrs({ justify: 'space-between' })`
  position: relative;
  height: 550px;
  width: 500px;
  padding: 40px;
`

export const HDWLogoContainer = styled(Flex)`
  svg {
    circle {
      fill: ${({ theme }) => hexWithOpacity(theme.palette.primaryColor, 0.1)};
    }
  }
`

export const CloseIconContainer = styled(Flex)`
  position: absolute;
  right: 40px;
  top: 40px;
`

export const StepNumberIcon = styled(Flex).attrs({ justify: 'center' })`
  height: 20px;
  width: 20px;
  border-radius: 20px;
  background-color: ${({ theme }) => hexWithOpacity(theme.palette.primaryColor, 0.1)};
  color: ${({ theme }) => theme.palette.primaryColor};
  text-align: center;
  font-size: 12px;
  line-height: 10px;
  font-weight: 500;
`

export const HDWConnectStepDivider = styled(Flex).attrs({ expand: true })`
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
`
