import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import asValidationUI, { ValidationUIVariant } from '../../../Components/validationComponents/asValidationUI'
import { ValidatedValue } from '../../../Components/validationComponents/createValidatedValue'
import { Flex } from '../../../elements/Flex'
import { HorizontalSpacer } from '../../../elements/Spacer'
import TokenAddress from '../../../elements/TokenAddress'
import TokenTag from '../../../elements/TokenTag'
import { TokenKind } from '../../../types/models/Tokens'

const TokenSymbol = styled.p`
  font-size: ${({ theme }) => theme.text.fontSize.h1};
  font-weight: ${({ theme }) => theme.text.fontWeight.light};
  color: white;
`

const TokenAmount = styled.p`
  font-size: ${({ theme }) => theme.text.fontSize.h1};
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
  color: white;
`

interface TokenLabelContainerProps {
  colorVariant?: ValidationUIVariant
}

const TokenLabelContainer = styled(Flex).attrs({
  direction: 'row',
})<TokenLabelContainerProps>`
  position: relative;
  padding-bottom: 5px;
  margin-bottom: 10px;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: ${({ colorVariant, theme }) => {
    switch (colorVariant) {
      case ValidationUIVariant.ERROR:
        return theme.palette.errorColor
      case ValidationUIVariant.WARNING:
        return theme.palette.warningColor
      case ValidationUIVariant.SUCCESS:
        return theme.palette.successColor
      case ValidationUIVariant.DEFAULT:
      default:
        return 'transparent'
    }
  }};
`

const TokenTagContainer = styled(Flex)`
  position: absolute;
  right: 0;
  bottom: calc(100% + 5px);
`

const TokenAddressContainer = styled(Flex)`
  position: absolute;
  right: 0;
  bottom: -25px;
`

interface TokenLabelProps {
  value: ValidatedValue<string>
  tokenKind: TokenKind
  symbol: string | null
  tokenId?: string | null
  tokenAddress?: string | null
  colorVariant?: ValidationUIVariant
  tokenVariant: 'good' | 'bad' | 'unknown'
}

export default function TokenLabel(props: TokenLabelProps) {
  const tokenLabelContent = useMemo(() => {
    switch (props.tokenKind) {
      case TokenKind.ERC721:
        return (
          <>
            <TokenSymbol>{props.symbol}</TokenSymbol>
            <HorizontalSpacer units={4} />
            <TokenAmount>
              <FormattedMessage defaultMessage="#{value}" values={{ value: props.value.value }} />
            </TokenAmount>
          </>
        )
      case TokenKind.ERC1155:
        return (
          <>
            <TokenAmount>{props.value.value}</TokenAmount>
            <HorizontalSpacer units={4} />
            <TokenSymbol>
              <FormattedMessage
                defaultMessage="{symbol} #{tokenId}"
                values={{ symbol: props.symbol, tokenId: props.tokenId }}
              />
            </TokenSymbol>
          </>
        )
      default:
        return (
          <>
            <TokenAmount>{props.value.value}</TokenAmount>
            <HorizontalSpacer units={4} />
            <TokenSymbol>{props.symbol}</TokenSymbol>
          </>
        )
    }
  }, [props.value.value, props.symbol, props.tokenId])

  return (
    <TokenLabelContainer colorVariant={props.colorVariant}>
      {tokenLabelContent}
      {props.tokenAddress && (
        <>
          <TokenTagContainer>
            <TokenTag white variant={props.tokenVariant} />
          </TokenTagContainer>
          <TokenAddressContainer>
            <TokenAddress large white variant={props.tokenVariant} address={props.tokenAddress} />
          </TokenAddressContainer>
        </>
      )}
    </TokenLabelContainer>
  )
}

export const ValidatedTokenLabel = asValidationUI(TokenLabel)
