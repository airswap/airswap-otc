import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'
import { H3, H4, H6, H8 } from '../../../elements/Typography'

interface ColorProps {
  color?: string
}

export const Close = styled(Flex)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
`

export const TokensListHeader = styled(Flex).attrs({
  expand: true,
})`
  flex-shrink: 0;
`

export const TokensList = styled(Flex).attrs({
  expand: true,
  align: 'flex-start',
})`
  flex-grow: 1;
  height: 100%;
  overflow-y: auto;
`

export const TokenSelectorContainer = styled(Flex)`
  padding-top: 40px;
  width: 400px;
  height: 500px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    width: 100%;
    height: 100%;
  }
`

export const HeaderText = styled(H3)`
  font-weight: ${({ theme }) => theme.text.fontWeight.semibold};
`

export const SubHeaderText = styled(H8)`
  font-weight: ${({ theme }) => theme.text.fontWeight.light};
  margin: 10px 0 10px 0;
`

export const TokenSelectorLabelContainer = styled(Flex).attrs({ justify: 'flex-end' })`
  height: 80px;
  min-height: 80px;
  padding: 10px 30px;
  box-sizing: border-box;
`

export const TokenSelectorLabel = styled(H4).attrs({ textAlign: 'left' })`
  font-weight: ${({ theme }) => theme.text.fontWeight.semibold};
`

export const NoResultsFound = styled(H6).attrs({
  textAlign: 'left',
})`
  padding: 15px 0;
`

export const NoResultsContainer = styled(Flex).attrs({
  justify: 'space-between',
  direction: 'row',
  expand: true,
})`
  padding: 0 40px;
`

export const LoadingContainer = styled(Flex).attrs({
  expand: true,
  align: 'center',
  justify: 'center',
})`
  height: 100%;
`
