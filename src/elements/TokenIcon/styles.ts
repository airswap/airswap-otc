import styled from 'styled-components'

import { hexWithOpacity } from '../../utils/styles/utils'
import { Flex } from '../Flex'
import { BaseText } from '../Typography'

interface TokenIconContainerProps {
  size: number
  backgroundColor?: string
  withShadow?: boolean
}

export const TokenIconContainer = styled(Flex).attrs({ align: 'center', justify: 'center' })<TokenIconContainerProps>`
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  width: ${({ size }) => size || 20}px;
  height: ${({ size }) => size || 20}px;
  min-width: ${({ size }) => size || 20}px;
  min-height: ${({ size }) => size || 20}px;
  max-width: 100%;
  max-height: 100%;
  box-shadow: ${({ withShadow, backgroundColor, theme }) =>
    withShadow ? `0px 4px 6px ${hexWithOpacity(backgroundColor || theme.palette.primaryColor, 0.25)}` : ''};
  background-color: white;
`

export const TokenImage = styled.img`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
  object-fit: cover;
`

export const UnknownTokenIcon = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
})`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.primaryColor};
`

interface SizeProps {
  size: number
}

export const UnknownTokenIconText = styled(BaseText)<SizeProps>`
  color: white;
  font-size: ${({ size }) => size * 0.6}px;
  font-weight: 600;
`
