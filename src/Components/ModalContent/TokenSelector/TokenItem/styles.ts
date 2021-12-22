import styled from 'styled-components'

import { Flex } from '../../../../elements/Flex'
import { H6, H7, H9, H10 } from '../../../../elements/Typography'

interface TokenItemContentProps {
  isFocused: boolean
}

export const TokenItemContent = styled(Flex).attrs({
  expand: true,
  direction: 'row',
  justify: 'space-between',
})<TokenItemContentProps>`
  position: relative;
  height: 80px;
  min-height: 80px;
  padding: 15px;
  cursor: pointer;
  background-color: #fafafa;
  border-radius: 15px;
  border: 2px solid ${({ isFocused, theme }) => (isFocused ? theme.palette.primaryColor : 'transparent')};
  transition: 0.4s;

  &:hover {
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.15);
  }
`

export const TokenItemContainer = styled(Flex).attrs({ expand: true })`
  padding: 10px 20px 0 20px;
`

export const TokenItemDetails = styled(Flex).attrs({ expand: true, align: 'flex-start' })`
  flex-grow: 1;
`

export const TokenSymbol = styled(H6).attrs({
  textAlign: 'left',
})`
  width: auto;
  font-weight: ${({ theme }) => theme.text.fontWeight.semibold};
`

export const TokenName = styled(H9)`
  font-weight: ${({ theme }) => theme.text.fontWeight.regular};
  color: rgba(0, 0, 0, 0.5);
`

export const TokenBalance = styled(H7)`
  width: auto;
  font-weight: ${({ theme }) => theme.text.fontWeight.regular};
`

export const TokenBalanceLabel = styled(H9)`
  width: auto;
  font-weight: ${({ theme }) => theme.text.fontWeight.regular};
  color: rgba(0, 0, 0, 0.5);
`

export const TokenPersonalDetails = styled(Flex).attrs({ align: 'flex-end' })`
  min-width: 1px;
  min-height: 1px;
  flex-shrink: 0;
`

export const TokenTagContainer = styled(Flex)`
  position: absolute;
  top: 5px;
  right: 10px;
`

export const TokenWarning = styled(H10).attrs({ textAlign: 'left' })`
  color: ${({ theme }) => theme.palette.errorColor};
`
