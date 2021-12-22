import { ETH_ADDRESS } from 'airswap.js/src/constants'
import { openEtherscanLink } from 'airswap.js/src/utils/etherscan'
import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { UserOrderRole } from '../..'
import { WidgetContext } from '../../../../app/context/WidgetContext'
import Button, { ButtonSize, ButtonVariant } from '../../../../elements/Button'
import DisplayLabel from '../../../../elements/DisplayLabel'
import { Flex } from '../../../../elements/Flex'
import MediaQuery from '../../../../elements/MediaQueryWrapper'
import { VerticalSpacer } from '../../../../elements/Spacer'
import { H1, H4, H5, H6 } from '../../../../elements/Typography'
import { ReactComponent as ArrowRightIcon } from '../../../../static/arrow-right-icon.svg'
import theme from '../../../../theme'
import { TokenKind, TokenKindInterfaceMap, TokenMetadata } from '../../../../types/models/Tokens'
import { redirectWithParam } from '../../../../utils/helpers'
import { condenseAddress, getFormattedTokenDisplay } from '../../../../utils/transformations'
import Container, { Props } from './Container'
import {
  BlockH5,
  BottomContainer,
  CreateOrderTextButton,
  DisplayLabelHeader,
  DisplayLabelWrapper,
  EtherscanButtonIcon,
  LabelColumn,
  LabelContainer,
  OrderSummaryContainer,
  PriceLabel,
  TopContainer,
} from './styles'

function OrderCancelled(props: Props) {
  const [makerToken, setMakerToken] = useState<TokenMetadata>()
  const [makerParam, setMakerParam] = useState<number>(0)
  const [makerTokenId, setMakerTokenId] = useState<string>()
  const [makerWallet, setMakerWallet] = useState<string>('')

  const [takerToken, setTakerToken] = useState<TokenMetadata>()
  const [takerParam, setTakerParam] = useState<number>(0)
  const [takerTokenId, setTakerTokenId] = useState<string>()
  const [takerWallet, setTakerWallet] = useState<string>('')

  const { isWidget, widgetParams } = useContext(WidgetContext)

  const onCreateNewOrderClick = () => {
    redirectWithParam(null, props.history)
  }

  useEffect(() => {
    if (!props.order || !props.tokensByAddress) return

    const foundMakerToken = props.tokensByAddress[props.order.makerToken]
    const foundTakerToken = props.tokensByAddress[props.order.takerToken]
    const foundMakerAmount = props.getDisplayByToken({ address: props.order.makerToken }, props.order.makerAmount || '')
    const foundTakerAmount = props.getDisplayByToken({ address: props.order.takerToken }, props.order.takerAmount || '')

    setMakerParam(
      Number(
        props.order.makerKind === TokenKindInterfaceMap[TokenKind.ERC20] ||
          props.order.makerKind === TokenKindInterfaceMap[TokenKind.ERC1155]
          ? foundMakerAmount
          : props.order.makerId,
      ),
    )
    setMakerTokenId(props.order.makerId)
    setMakerToken(foundMakerToken)
    setMakerWallet(props.order.makerWallet)

    setTakerParam(
      Number(
        props.order.takerKind === TokenKindInterfaceMap[TokenKind.ERC20] ||
          props.order.takerKind === TokenKindInterfaceMap[TokenKind.ERC1155]
          ? foundTakerAmount
          : props.order.takerId,
      ),
    )
    setTakerTokenId(props.order.takerId)
    setTakerToken(foundTakerToken)
    setTakerWallet(props.order.takerWallet)
  }, [props.getDisplayByToken, Object.keys(props.tokensByAddress).length])

  const calculatePrice = (sendValue: number | null, receiveValue: number | null) => {
    if (!sendValue || !receiveValue || !Number(receiveValue) || !Number(sendValue)) {
      return 0
    }
    return Number(receiveValue) / Number(sendValue)
  }

  const withLineThrough = styledComponent => {
    return styled(styledComponent)`
      text-decoration: line-through;
    `
  }

  const LH5 = withLineThrough(H5)
  const BlockLH5 = withLineThrough(BlockH5)
  const LTPriceLabel = withLineThrough(PriceLabel)

  // Maker Labels
  const makerAmountLabel = (
    <DisplayLabel
      value={getFormattedTokenDisplay({
        amount: makerParam,
        id: makerTokenId,
        symbol: makerToken && makerToken.symbol,
        kind: makerToken && makerToken.kind,
      })}
      white
      expand
    >
      <LH5 textAlign="left" display="inline-flex" weight={theme.text.fontWeight.medium}>
        {getFormattedTokenDisplay({
          amount: makerParam,
          id: makerTokenId,
          symbol: makerToken && makerToken.symbol,
          kind: makerToken && makerToken.kind,
        })}
      </LH5>
    </DisplayLabel>
  )
  const makerPriceLabel = (
    <LTPriceLabel>
      {`1 ${makerToken ? makerToken.symbol : ''}   =   ${calculatePrice(makerParam, takerParam)} ${
        takerToken ? takerToken.symbol : ''
      }`}
    </LTPriceLabel>
  )
  const makerWalletLabel = (
    <DisplayLabel value={makerWallet} white expand>
      <BlockLH5>{condenseAddress(makerWallet, true, false, 'bottom')}</BlockLH5>
    </DisplayLabel>
  )

  // Taker Labels
  const takerAmountLabel = (
    <DisplayLabel
      value={getFormattedTokenDisplay({
        amount: takerParam,
        id: takerTokenId,
        symbol: takerToken && takerToken.symbol,
        kind: takerToken && takerToken.kind,
      })}
      white
      expand
    >
      <LH5 textAlign="left" display="inline-flex" weight={theme.text.fontWeight.medium}>
        {getFormattedTokenDisplay({
          amount: takerParam,
          id: takerTokenId,
          symbol: takerToken && takerToken.symbol,
          kind: takerToken && takerToken.kind,
        })}
      </LH5>
    </DisplayLabel>
  )
  const takerPriceLabel = (
    <LTPriceLabel>
      {`1 ${takerToken ? takerToken.symbol : ''}   =   ${calculatePrice(takerParam, makerParam)} ${
        makerToken ? makerToken.symbol : ''
      }`}
    </LTPriceLabel>
  )
  const takerWalletLabel = (
    <DisplayLabel value={takerWallet} white expand>
      <LH5 display="inline-flex" color="white" textAlign="left" weight={200}>
        {takerWallet === ETH_ADDRESS ? 'Public Order' : condenseAddress(takerWallet, true, false, 'bottom')}
      </LH5>
    </DisplayLabel>
  )

  const showPriceLabel =
    takerToken &&
    takerToken.kind !== TokenKind.ERC721 &&
    takerToken.kind !== TokenKind.ERC1155 &&
    makerToken &&
    makerToken.kind !== TokenKind.ERC721 &&
    makerToken.kind !== TokenKind.ERC1155

  const widgetPrimaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.primaryColor
    : undefined
  const widgetSecondaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.secondaryColor
    : undefined

  return (
    <OrderSummaryContainer color={widgetPrimaryColor}>
      <TopContainer justify="center" color={widgetPrimaryColor}>
        <H1 color="white" weight={theme.text.fontWeight.medium}>
          <FormattedMessage defaultMessage="Trade Canceled" />
        </H1>
        <VerticalSpacer units={4} />
        <H4 color="rgba(255, 255, 255, 0.75)" weight={theme.text.fontWeight.light}>
          <FormattedMessage defaultMessage="This trade has been canceled and is no longer available" />
        </H4>
        <VerticalSpacer units={12} />

        {/* Left Column */}
        <LabelContainer justify="center" expand>
          <LabelColumn direction="column">
            <Flex>
              <DisplayLabelHeader>
                {props.userOrderRole === UserOrderRole.MAKER ? (
                  <FormattedMessage defaultMessage="You’ll send" />
                ) : (
                  <FormattedMessage defaultMessage="Maker send" />
                )}
              </DisplayLabelHeader>
              <DisplayLabelWrapper>
                {props.userOrderRole === UserOrderRole.TAKER ? takerAmountLabel : makerAmountLabel}
              </DisplayLabelWrapper>
              {showPriceLabel && (props.userOrderRole === UserOrderRole.TAKER ? takerPriceLabel : makerPriceLabel)}
            </Flex>

            <VerticalSpacer units={5} />

            <Flex>
              <DisplayLabelHeader>
                {props.userOrderRole === UserOrderRole.MAKER ? (
                  <FormattedMessage defaultMessage="Your wallet" />
                ) : (
                  <FormattedMessage defaultMessage="Maker wallet" />
                )}
              </DisplayLabelHeader>
              <DisplayLabelWrapper>
                {props.userOrderRole === UserOrderRole.TAKER ? takerWalletLabel : makerWalletLabel}
              </DisplayLabelWrapper>
              <H6 />
            </Flex>
          </LabelColumn>

          <MediaQuery size="sm">
            <VerticalSpacer units={5} />
          </MediaQuery>

          {/* Right Column */}
          <LabelColumn direction="column">
            <Flex>
              <DisplayLabelHeader>
                {props.userOrderRole === UserOrderRole.MAKER ? (
                  <FormattedMessage defaultMessage="You’ll receive" />
                ) : (
                  <FormattedMessage defaultMessage="Taker receive" />
                )}
              </DisplayLabelHeader>
              <DisplayLabelWrapper>
                {props.userOrderRole === UserOrderRole.TAKER ? makerAmountLabel : takerAmountLabel}
              </DisplayLabelWrapper>
              {showPriceLabel && (props.userOrderRole === UserOrderRole.TAKER ? makerPriceLabel : takerPriceLabel)}
            </Flex>

            <VerticalSpacer units={5} />

            <Flex>
              <DisplayLabelHeader>
                {props.userOrderRole === UserOrderRole.MAKER ? (
                  <FormattedMessage defaultMessage="Counterparty wallet" />
                ) : (
                  <FormattedMessage defaultMessage="Taker wallet" />
                )}
              </DisplayLabelHeader>
              <DisplayLabelWrapper>
                {props.userOrderRole === UserOrderRole.TAKER ? makerWalletLabel : takerWalletLabel}
              </DisplayLabelWrapper>
            </Flex>
          </LabelColumn>
        </LabelContainer>
      </TopContainer>

      <BottomContainer color={widgetPrimaryColor}>
        <Flex expand>
          <MediaQuery size="sm">
            <Button
              color={widgetPrimaryColor}
              onClick={openEtherscanLink.bind(null, props.transactionHash, 'tx')}
              variant={ButtonVariant.SECONDARY}
              size={ButtonSize.LARGE}
              expand
            >
              <Flex align="center" direction="row" justify="center">
                <H6 fit>
                  <FormattedMessage defaultMessage="View on Etherscan" />
                </H6>
                <EtherscanButtonIcon color={widgetSecondaryColor}>
                  <ArrowRightIcon />
                </EtherscanButtonIcon>
              </Flex>
            </Button>
          </MediaQuery>
          <MediaQuery size="md-up">
            <Button
              color={widgetPrimaryColor}
              onClick={openEtherscanLink.bind(null, props.transactionHash, 'tx')}
              variant={ButtonVariant.SECONDARY}
              size={ButtonSize.LARGE}
            >
              <Flex align="center" direction="row" justify="center">
                <H6 fit>
                  <FormattedMessage defaultMessage="View on Etherscan" />
                </H6>
                <EtherscanButtonIcon color={widgetPrimaryColor}>
                  <ArrowRightIcon />
                </EtherscanButtonIcon>
              </Flex>
            </Button>
          </MediaQuery>
          <VerticalSpacer units={4} />
          <CreateOrderTextButton onClick={onCreateNewOrderClick} textAlign="center">
            <FormattedMessage defaultMessage="Start a new trade" />
          </CreateOrderTextButton>
        </Flex>
      </BottomContainer>
    </OrderSummaryContainer>
  )
}

export default Container(withRouter(injectIntl(OrderCancelled)))
