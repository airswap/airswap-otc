import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'

import { ModalContext, ModalPosition } from '../../app/context/ModalContext'
import { Flex } from '../../elements/Flex'
import { H1 } from '../../elements/Typography'
import { ReactComponent as ChevronDown } from '../../static/chevron-down-icon.svg'
import { TokenKind } from '../../types/models/Tokens'
import TokenSelectorModalContent from '../ModalContent/TokenSelector'
import { ValidatedValue } from '../validationComponents/createValidatedValue'

interface SelectTokenContainerProps {
  locked: boolean
}

const SelectTokenContainer = styled(Flex)`
  position: relative;
`

const SelectTokenContent = styled(Flex).attrs({
  direction: 'row',
})<SelectTokenContainerProps>`
  cursor: ${({ locked }) => (locked ? 'default' : 'pointer')};
  transition: ${({ theme }) => theme.animation.defaultTransition}s;

  &:hover {
    opacity: ${({ locked }) => (locked ? 1 : 0.85)};
  }
`

const TokenLabel = styled(H1)`
  font-weight: ${({ theme }) => theme.text.fontWeight.light};
  margin-right: 10px;
  color: white;
`

const ChevronIcon = styled(Flex)`
  svg {
    width: 10px;

    path {
      stroke: white;
    }
  }
`

interface SelectTokenProps {
  param: ValidatedValue<string>
  setParam(param: string): void
  tokenAddress: ValidatedValue<string>
  setTokenAddress(token: string): void
  tokenId: string
  setTokenId(tokenId: string): void
  tokenKind: TokenKind
  setTokenKind(tokenKind: TokenKind): void
  tokensByAddress: Record<string, Record<string, any>>[]
  showBalance?: boolean
  dataTest?: string
}

export default function SelectToken(props: SelectTokenProps) {
  const { setModalOpen, setModalSettings, setModalContent } = useContext(ModalContext)

  const openTokenSelector = () => {
    if (props.tokenAddress.locked) return

    setModalContent(
      <TokenSelectorModalContent
        param={props.param}
        setParam={props.setParam}
        tokenId={props.tokenId}
        setTokenId={props.setTokenId}
        tokenKind={props.tokenKind}
        setTokenKind={props.setTokenKind}
        tokenAddress={props.tokenAddress}
        setTokenAddress={props.setTokenAddress}
        showBalance={props.showBalance}
      />,
    )
    setModalSettings({ mobilePosition: ModalPosition.FULL_SCREEN })
    setModalOpen(true)
  }

  const tokenSymbol = useMemo(() => {
    if (props.tokensByAddress && props.tokensByAddress[props.tokenAddress.value || '']) {
      if (props.tokenKind === TokenKind.ERC1155) {
        return `${props.tokensByAddress[props.tokenAddress.value || ''].symbol} ${props.tokenId}`
      }
      return props.tokensByAddress[props.tokenAddress.value || ''].symbol
    }
    return props.tokenAddress.value
  }, [props.tokenId, props.tokensByAddress[props.tokenAddress.value || '']])

  return (
    <SelectTokenContainer>
      <SelectTokenContent onClick={openTokenSelector} data-test={props.dataTest} locked={props.tokenAddress.locked}>
        <TokenLabel>{tokenSymbol}</TokenLabel>
        {!props.tokenAddress.locked && (
          <ChevronIcon>
            <ChevronDown />
          </ChevronIcon>
        )}
      </SelectTokenContent>
    </SelectTokenContainer>
  )
}
