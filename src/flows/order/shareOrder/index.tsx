import { ETH_ADDRESS } from 'airswap.js/src/constants'
import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'

import { ModalContext, ModalPosition } from '../../../app/context/ModalContext'
import { WidgetContext } from '../../../app/context/WidgetContext'
import CancellationStatus from '../../../Components/ModalContent/CancellationStatus'
import { ValidationUIVariant } from '../../../Components/validationComponents/asValidationUI'
import DisplayLabel from '../../../elements/DisplayLabel'
import { Flex } from '../../../elements/Flex'
import MediaQuery from '../../../elements/MediaQueryWrapper'
import { VerticalSpacer } from '../../../elements/Spacer'
import Tooltip from '../../../elements/Tooltip'
import { H1, H4, H5, H6, H7 } from '../../../elements/Typography'
import theme from '../../../theme'
import { TokenKind, TokenKindInterfaceMap, TokenMetadata } from '../../../types/models/Tokens'
import { getShareUrl, redirectWithParam } from '../../../utils/helpers'
import { formatExpirationFromDate } from '../../../utils/numbers'
import {
  condenseAddress,
  getFormattedNumber,
  getFormattedTokenDisplay,
  willFormatNumber,
} from '../../../utils/transformations'
import useInterval from '../../../utils/useInterval'
import Container, { OrderSummaryDispatchProps, OrderSummaryProps } from './Container'
import {
  BlockH5,
  BottomContainer,
  BottomShareContainer,
  CancelCreateContainer,
  CancelOrderTextButton,
  CreateOrderTextButton,
  DisplayLabelHeader,
  DisplayLabelWrapper,
  LabelColumn,
  LabelContainer,
  OrderSummaryContainer,
  PriceLabel,
  TopContainer,
} from './styles'

function OrderSummary(props: OrderSummaryProps & OrderSummaryDispatchProps) {
  const [orderUrl, setOrderUrl] = useState<string>('')
  const [expirationString, setExpirationString] = useState<string>('')

  const [makerParam, setMakerParam] = useState<number>(0)
  const [makerWallet, setMakerWallet] = useState<string>('')
  const [makerToken, setMakerToken] = useState<TokenMetadata>()
  const [makerTokenId, setMakerTokenId] = useState<string>()

  const [takerParam, setTakerParam] = useState<number>(0)
  const [takerWallet, setTakerWallet] = useState<string>('')
  const [takerToken, setTakerToken] = useState<TokenMetadata>()
  const [takerTokenId, setTakerTokenId] = useState<string>()

  const { setModalOpen, setModalContent, setModalSettings } = useContext(ModalContext)
  const { isWidget, widgetParams } = useContext(WidgetContext)

  const showCancellationModal = () => {
    if (expirationString === 'Expired') return

    setModalContent(<CancellationStatus signedOrder={props.order} orderCID={props.match.params.orderCID} />)
    setModalSettings({ canDismiss: true, mobilePosition: ModalPosition.BOTTOM })
    setModalOpen(true)
  }

  useEffect(() => {
    if (!props.order) return
    const foundTakerToken = props.tokensByAddress && props.tokensByAddress[props.order.takerToken]
    const foundMakerToken = props.tokensByAddress && props.tokensByAddress[props.order.makerToken]

    const formattedTakerAmount = props.getDisplayByToken(
      { address: props.order.takerToken },
      props.order.takerAmount || '',
    )
    setTakerParam(
      Number(
        props.order.takerKind === TokenKindInterfaceMap[TokenKind.ERC20] ||
          props.order.takerKind === TokenKindInterfaceMap[TokenKind.ERC1155]
          ? formattedTakerAmount
          : props.order.takerId,
      ),
    )
    setTakerTokenId(props.order.takerId)
    setTakerWallet(props.order.takerWallet)
    if (foundTakerToken) {
      setTakerToken(foundTakerToken)
    }

    const formattedMakerAmount = props.getDisplayByToken(
      { address: props.order.makerToken },
      props.order.makerAmount || '',
    )
    setMakerParam(
      Number(
        props.order.makerKind === TokenKindInterfaceMap[TokenKind.ERC20] ||
          props.order.makerKind === TokenKindInterfaceMap[TokenKind.ERC1155]
          ? formattedMakerAmount
          : props.order.makerId,
      ),
    )
    setMakerTokenId(props.order.makerId)
    setMakerWallet(props.connectedWalletAddress)
    if (foundMakerToken) {
      setMakerToken(foundMakerToken)
    }

    setExpirationString(formatExpirationFromDate(props.order.expiry || 0))
    setOrderUrl(getShareUrl(props.match.params.orderCID || widgetParams.cid, widgetParams))
  }, [JSON.stringify(props.order), props.getDisplayByToken, Object.keys(props.tokensByAddress).length])

  useInterval(() => {
    if (!props.order) return
    setExpirationString(formatExpirationFromDate(props.order.expiry || 0))
  }, 1000)

  const renderPriceLabel = (baseSymbol: string, amount: number, symbol: string) => {
    const showPriceLabel =
      makerToken &&
      makerToken.kind !== TokenKind.ERC721 &&
      makerToken.kind !== TokenKind.ERC1155 &&
      takerToken &&
      takerToken.kind !== TokenKind.ERC721 &&
      takerToken.kind !== TokenKind.ERC1155

    if (willFormatNumber(amount, 20, 8) && showPriceLabel) {
      return (
        <Tooltip
          expand
          render={() => <H7 color="white">{`1 ${baseSymbol} = ${amount} ${symbol}`}</H7>}
          position="bottom"
        >
          <PriceLabel>{`1 ${baseSymbol} = ${getFormattedNumber(amount, 20, 8)} ${symbol}`}</PriceLabel>
        </Tooltip>
      )
    }
    return <PriceLabel>{showPriceLabel ? `1 ${baseSymbol} = ${amount} ${symbol}` : ''}</PriceLabel>
  }

  const calculatePrice = (sendValue: number | null, receiveValue: number | null) => {
    if (!sendValue || !receiveValue || !Number(receiveValue) || !Number(sendValue)) {
      return 0
    }
    return Number(receiveValue) / Number(sendValue)
  }

  const onCreateNewOrderClick = () => {
    redirectWithParam(null, props.history)
  }

  const isExpired = expirationString === 'Expired'

  const widgetPrimaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.primaryColor
    : undefined
  const widgetSecondaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.secondaryColor
    : undefined

  return (
    <OrderSummaryContainer color={widgetPrimaryColor} data-test="share-order" data-cid={props.match.params.orderCID}>
      <TopContainer color={widgetPrimaryColor} justify="center">
        <H1 color="white" weight={theme.text.fontWeight.medium}>
          {isExpired ? (
            <FormattedMessage defaultMessage="Trade Expired" />
          ) : (
            <FormattedMessage defaultMessage="Ready to Share" />
          )}
        </H1>
        <VerticalSpacer units={4} />
        <H4 color="rgba(255, 255, 255, 0.75)" weight={theme.text.fontWeight.light}>
          {isExpired ? (
            <FormattedMessage defaultMessage="Trade expired and is no longer available" />
          ) : (
            <FormattedMessage defaultMessage="Share the link below to complete your trade" />
          )}
        </H4>
        <VerticalSpacer units={4} />

        {makerToken && takerToken && (
          <>
            {/* Left Column */}
            <LabelContainer justify="center" expand>
              <LabelColumn direction="column">
                <Flex>
                  <DisplayLabelHeader textAlign="left">
                    <FormattedMessage defaultMessage="You'll send" />
                  </DisplayLabelHeader>
                  <DisplayLabelWrapper>
                    <DisplayLabel
                      white
                      expand
                      value={getFormattedTokenDisplay({
                        amount: makerParam,
                        id: makerTokenId,
                        symbol: makerToken.name,
                        kind: makerToken.kind,
                      })}
                    >
                      <BlockH5 weight={theme.text.fontWeight.medium}>
                        {getFormattedTokenDisplay({
                          amount: makerParam,
                          id: makerTokenId,
                          symbol: makerToken.symbol,
                          kind: makerToken.kind,
                        })}
                      </BlockH5>
                    </DisplayLabel>
                  </DisplayLabelWrapper>
                  {renderPriceLabel(makerToken.symbol, calculatePrice(makerParam, takerParam), takerToken.symbol)}
                </Flex>

                <VerticalSpacer units={2} />

                <Flex>
                  <DisplayLabelHeader textAlign="left">
                    <FormattedMessage defaultMessage="Your wallet" />
                  </DisplayLabelHeader>
                  <DisplayLabelWrapper>
                    <DisplayLabel value={makerWallet} white expand>
                      <BlockH5 weight={theme.text.fontWeight.light}>
                        {condenseAddress(makerWallet, true, false, 'bottom')}
                      </BlockH5>
                    </DisplayLabel>
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
                  <DisplayLabelHeader textAlign="left">
                    <FormattedMessage defaultMessage="You'll receive" />
                  </DisplayLabelHeader>
                  <DisplayLabelWrapper>
                    <DisplayLabel
                      white
                      expand
                      value={getFormattedTokenDisplay({
                        amount: takerParam,
                        id: takerTokenId,
                        symbol: takerToken.name,
                        kind: takerToken.kind,
                      })}
                    >
                      <H5 textAlign="left" display="inline-flex" weight={theme.text.fontWeight.medium}>
                        {getFormattedTokenDisplay({
                          amount: takerParam,
                          id: takerTokenId,
                          symbol: takerToken.symbol,
                          kind: takerToken.kind,
                        })}
                      </H5>
                    </DisplayLabel>
                  </DisplayLabelWrapper>
                  {renderPriceLabel(takerToken.symbol, calculatePrice(takerParam, makerParam), makerToken.symbol)}
                </Flex>

                <VerticalSpacer units={2} />

                <Flex>
                  <DisplayLabelHeader textAlign="left">
                    <FormattedMessage defaultMessage="Counterparty wallet" />
                  </DisplayLabelHeader>
                  <DisplayLabelWrapper>
                    <DisplayLabel color={widgetSecondaryColor} value={takerWallet} white expand>
                      <BlockH5 weight={theme.text.fontWeight.light}>
                        {takerWallet === ETH_ADDRESS
                          ? 'Public Order'
                          : condenseAddress(takerWallet, true, false, 'bottom')}
                      </BlockH5>
                    </DisplayLabel>
                  </DisplayLabelWrapper>
                </Flex>
              </LabelColumn>
            </LabelContainer>
          </>
        )}

        <VerticalSpacer units={5} />

        <Flex>
          <DisplayLabelHeader>
            <FormattedMessage defaultMessage="Expires in" />
          </DisplayLabelHeader>
          <H6 color="white">{expirationString}</H6>
        </Flex>
      </TopContainer>

      <BottomContainer>
        <BottomShareContainer>
          <DisplayLabel
            color={widgetSecondaryColor}
            value={orderUrl}
            clickToCopy
            expand
            colorVariant={isExpired ? ValidationUIVariant.ERROR : ValidationUIVariant.DEFAULT}
          />
          <VerticalSpacer units={2} />
          <CancelCreateContainer>
            <CancelOrderTextButton onClick={showCancellationModal} disabled={isExpired}>
              <FormattedMessage defaultMessage="Cancel this trade" />
            </CancelOrderTextButton>
            <CreateOrderTextButton color={widgetSecondaryColor} onClick={onCreateNewOrderClick} textAlign="right">
              <FormattedMessage defaultMessage="Start a new trade" />
            </CreateOrderTextButton>
          </CancelCreateContainer>
        </BottomShareContainer>
      </BottomContainer>
    </OrderSummaryContainer>
  )
}

export default Container(withRouter(injectIntl(OrderSummary)))
