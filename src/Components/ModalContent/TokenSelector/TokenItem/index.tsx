import React, { useMemo, useRef } from 'react'
import { FormattedMessage } from 'react-intl'

import { Flex } from '../../../../elements/Flex'
import { HorizontalSpacer, VerticalSpacer } from '../../../../elements/Spacer'
import TokenAddress from '../../../../elements/TokenAddress'
import TokenIcon from '../../../../elements/TokenIcon'
import TokenTag from '../../../../elements/TokenTag'
import { TokenKind } from '../../../../types/models/Tokens'
import Container, { TokenItemProps } from './Container'
import {
  TokenBalance,
  TokenBalanceLabel,
  TokenItemContainer,
  TokenItemContent,
  TokenItemDetails,
  TokenName,
  TokenPersonalDetails,
  TokenSymbol,
  TokenWarning,
} from './styles'

function TokenItem(props: TokenItemProps) {
  const addressRef = useRef<HTMLDivElement>(null)

  const onClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (evt.target instanceof HTMLDivElement && addressRef.current && addressRef.current.contains(evt.target)) {
      return
    }
    props.onSelect()
  }

  const displayBalance = useMemo(() => {
    if (props.connectedWalletAddress && props.atomicBalances[props.token.address]) {
      const formattedBalance = props.getDisplayByToken(
        { address: props.token.address },
        props.atomicBalances[props.token.address],
      )
      return Number(formattedBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 10 })
    }
    return '0.00'
  }, [props.connectedWalletAddress, props.atomicBalances, props.token])

  return (
    <TokenItemContainer>
      <TokenItemContent id={props.id} key={props.token.symbol} onClick={onClick} isFocused={props.isFocused}>
        <TokenIcon withShadow token={props.token} size={30} />
        <HorizontalSpacer units={3} />
        <Flex expand direction="row">
          <TokenItemDetails>
            <Flex direction="row" align="flex-end">
              <TokenSymbol textAlign="left">{props.token.symbol}</TokenSymbol>
              <HorizontalSpacer units={2} />
              <Flex ref={addressRef}>
                <TokenAddress address={props.token.address} variant={props.tokenVariant} />
              </Flex>
            </Flex>
            <VerticalSpacer units={1} />
            <TokenName textAlign="left">{props.token.name}</TokenName>
            {props.tokenVariant === 'bad' && (
              <TokenWarning>
                <FormattedMessage defaultMessage="Verify the legitimacy of this token before trading!" />
              </TokenWarning>
            )}
          </TokenItemDetails>
          <TokenPersonalDetails data-test={props.dataTest} onClick={onClick}>
            <TokenTag variant={props.tokenVariant} />
            <VerticalSpacer units={1} />
            {props.connectedWalletAddress && props.showBalance && props.token.kind !== TokenKind.ERC721 && (
              <>
                <TokenBalance textAlign="right">{displayBalance}</TokenBalance>
                <TokenBalanceLabel textAlign="right">
                  <FormattedMessage defaultMessage="Balance" />
                </TokenBalanceLabel>
              </>
            )}
          </TokenPersonalDetails>
        </Flex>
      </TokenItemContent>
    </TokenItemContainer>
  )
}

export default Container(TokenItem)
