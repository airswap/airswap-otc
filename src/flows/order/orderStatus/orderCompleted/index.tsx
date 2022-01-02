import { ETH_ADDRESS, WETH_CONTRACT_ADDRESS } from 'airswap.js/src/constants'
import { openEtherscanLink } from 'airswap.js/src/utils/etherscan'
import BigNumber from 'bignumber.js'
import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'

import { UserOrderRole } from '../..'
import { FormSubmitContext } from '../../../../app/context/FormSubmitContext'
import { ModalContext, ModalPosition } from '../../../../app/context/ModalContext'
import { WalletContext } from '../../../../app/context/WalletContext'
import { WidgetContext } from '../../../../app/context/WidgetContext'
import ApproveToken from '../../../../Components/ModalContent/ApproveToken'
import createValidatedValue from '../../../../Components/validationComponents/createValidatedValue'
import { formatValidationMessage } from '../../../../Components/validationComponents/validators'
import Button, { ButtonSize, ButtonVariant } from '../../../../elements/Button'
import DisplayLabel from '../../../../elements/DisplayLabel'
import { Flex } from '../../../../elements/Flex'
import MediaQuery from '../../../../elements/MediaQueryWrapper'
import { VerticalSpacer } from '../../../../elements/Spacer'
import Tooltip from '../../../../elements/Tooltip'
import { H1, H4, H5, H6, H7 } from '../../../../elements/Typography'
import { ReactComponent as ArrowRightIcon } from '../../../../static/arrow-right-icon.svg'
import theme from '../../../../theme'
import { TokenKind, TokenKindInterfaceMap, TokenMetadata } from '../../../../types/models/Tokens'
import { isMobile, redirectWithCID } from '../../../../utils/helpers'
import {
  condenseAddress,
  getFormattedNumber,
  getFormattedTokenDisplay,
  willFormatNumber,
} from '../../../../utils/transformations'
import Container, { Props } from './Container'
import {
  BlockH5,
  BottomContainer,
  DisplayLabelHeader,
  DisplayLabelWrapper,
  EtherscanButtonIcon,
  LabelColumn,
  LabelContainer,
  OrderSummaryContainer,
  PriceLabel,
  TopContainer,
} from './styles'
import UnwrapDisplayLabel, { UnwrapState } from './UnwrapDisplayLabel'

function OrderCompleted(props: Props) {
  const [takerToken, setTakerToken] = useState<TokenMetadata>()
  const [takerParam, setTakerParam] = useState<number>(1)
  const [takerSymbol, setTakerSymbol] = useState<string>('AST')
  const [takerTokenId, setTakerTokenId] = useState<string>()
  const [takerWallet, setTakerWallet] = useState<string>('0x123')

  const [makerToken, setMakerToken] = useState<TokenMetadata>()
  const [makerParam, setMakerParam] = useState<number>(2)
  const [makerSymbol, setMakerSymbol] = useState<string>('WETH')
  const [makerWallet, setMakerWallet] = useState<string>('0x123')
  const [makerDisplayLabel, setMakerDisplayLabel] = createValidatedValue<string>([])

  const [unwrapState, setUnwrapState] = useState<UnwrapState>(UnwrapState.DEFAULT)

  const { isWidget, widgetParams } = useContext(WidgetContext)
  const { startWalletConnect } = useContext(WalletContext)
  const { setModalContent, setModalOpen, setModalSettings } = useContext(ModalContext)
  const { isFormSubmitting, setIsFormSubmitting, shouldProgress, setShouldProgress } = useContext(FormSubmitContext)

  const onCreateNewOrderClick = () => {
    setShouldProgress(false)
    setIsFormSubmitting(false)
    redirectWithCID(null)
  }

  const unwrap = () => {
    setIsFormSubmitting(true)
    setShouldProgress(true)
  }

  const renderPriceLabel = (baseSymbol: string, amount: number, symbol: string) => {
    if (willFormatNumber(amount, 20, 8)) {
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
    return <PriceLabel>{`1 ${baseSymbol} = ${amount} ${symbol}`}</PriceLabel>
  }

  useEffect(() => {
    if (unwrapState !== UnwrapState.UNWRAPPED) {
      if (isFormSubmitting) {
        setUnwrapState(UnwrapState.UNWRAPPING)
      } else {
        setUnwrapState(UnwrapState.DEFAULT)
      }
    }
  }, [isFormSubmitting])

  useEffect(() => {
    if (isFormSubmitting && shouldProgress && takerSymbol === 'WETH') {
      // Check Wallet Connection
      if (!props.connectedWalletAddress) {
        setShouldProgress(false)
        startWalletConnect()
        return
      }

      // Check Token Approval
      if (props.connectedApprovals && !props.connectedApprovals[WETH_CONTRACT_ADDRESS]) {
        setShouldProgress(false)
        setModalContent(<ApproveToken tokenAddress={WETH_CONTRACT_ADDRESS} tokenKind={TokenKind.ERC20} />)
        setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
        setModalOpen(true)
        return
      }

      // Check WETH Balance
      const takerTotalEthAmountAtomic = props.atomicBalances[WETH_CONTRACT_ADDRESS]
      const takerParamAtomic = props.getAtomicByToken({ address: WETH_CONTRACT_ADDRESS }, `${takerParam}`)
      if (new BigNumber(takerTotalEthAmountAtomic).lt(new BigNumber(takerParamAtomic))) {
        setShouldProgress(false)
        makerDisplayLabel.setMessage(formatValidationMessage('Not enough WETH Balance', true))
        setIsFormSubmitting(false)
        return
      }

      // Unwrap
      setShouldProgress(false)
      props.unwrapWeth(props.getAtomicByToken({ address: WETH_CONTRACT_ADDRESS }, `${takerParam}`))
      setIsFormSubmitting(false)
    }
  }, [isFormSubmitting, shouldProgress])

  useEffect(() => {
    if (
      unwrapState === UnwrapState.UNWRAPPING &&
      !props.isSubmittingUnwrapWeth &&
      !props.isWalletUnwrappingWeth &&
      !props.isMiningUnwrapWeth &&
      !props.errorSubmittingUnwrapWeth
    ) {
      setUnwrapState(UnwrapState.UNWRAPPED)
    }
    if (props.errorSubmittingUnwrapWeth) {
      setUnwrapState(UnwrapState.DEFAULT)
      makerDisplayLabel.setMessage(formatValidationMessage(props.errorSubmittingUnwrapWeth, true))
    }
  }, [
    props.isSubmittingUnwrapWeth,
    props.isWalletUnwrappingWeth,
    props.isMiningUnwrapWeth,
    props.errorSubmittingUnwrapWeth,
  ])

  useEffect(() => {
    if (!props.currentOrder) return

    const foundMakerToken = props.tokensByAddress && props.tokensByAddress[props.currentOrder.makerToken]
    const foundTakerToken = props.tokensByAddress && props.tokensByAddress[props.currentOrder.takerToken]

    const takerTokenSymbol =
      props.tokensByAddress && props.tokensByAddress[props.currentOrder.takerToken]
        ? props.tokensByAddress[props.currentOrder.takerToken].symbol
        : ''
    const makerTokenSymbol =
      props.tokensByAddress && props.tokensByAddress[props.currentOrder.makerToken]
        ? props.tokensByAddress[props.currentOrder.makerToken].symbol
        : ''

    const formattedTakerAmount = props.getDisplayByToken(
      { address: props.currentOrder.takerToken },
      props.currentOrder.takerAmount || '',
    )
    setTakerToken(foundTakerToken)
    setTakerParam(
      Number(
        props.currentOrder.takerKind === TokenKindInterfaceMap[TokenKind.ERC20]
          ? formattedTakerAmount
          : props.currentOrder.takerId,
      ),
    )
    setTakerTokenId(props.currentOrder.takerId)
    setTakerSymbol(takerTokenSymbol)
    if (props.filledOrder && props.filledOrder && props.filledOrder.takerWallet) {
      setTakerWallet(props.filledOrder.takerWallet)
    } else {
      setTakerWallet(props.currentOrder.takerWallet)
    }

    const formattedMakerAmount = props.getDisplayByToken(
      { address: props.currentOrder.makerToken },
      props.currentOrder.makerAmount || '',
    )

    setMakerToken(foundMakerToken)
    setMakerParam(
      Number(
        props.currentOrder.makerKind === TokenKindInterfaceMap[TokenKind.ERC20]
          ? formattedMakerAmount
          : props.currentOrder.makerId,
      ),
    )
    setMakerSymbol(makerTokenSymbol)
    setMakerWallet(props.currentOrder.makerWallet)

    setMakerDisplayLabel(
      getFormattedTokenDisplay({
        amount: formattedMakerAmount,
        id: props.currentOrder.makerId,
        symbol: makerTokenSymbol,
        kind: foundMakerToken && foundMakerToken.kind,
      }),
    )
  }, [
    props.getDisplayByToken,
    JSON.stringify(props.currentOrder),
    JSON.stringify(props.filledOrder),
    Object.keys(props.tokensByAddress).length,
  ])

  const calculatePrice = (sendValue: number | null, receiveValue: number | null) => {
    if (!sendValue || !receiveValue || !Number(receiveValue) || !Number(sendValue)) {
      return 0
    }
    return Number(receiveValue) / Number(sendValue)
  }

  // Maker Labels
  const makerParamLabel =
    makerSymbol === 'WETH' && props.userOrderRole === UserOrderRole.TAKER ? (
      <UnwrapDisplayLabel errorOffset={20} expand value={makerDisplayLabel} unwrapState={unwrapState} unwrap={unwrap} />
    ) : (
      <DisplayLabel value={makerDisplayLabel.value || ''} white expand>
        <H5 textAlign="left" display="inline-flex" weight={theme.text.fontWeight.medium}>
          {makerDisplayLabel.value}
        </H5>
      </DisplayLabel>
    )

  const makerPriceLabel = renderPriceLabel(makerSymbol, calculatePrice(makerParam, takerParam), takerSymbol)
  const makerWalletLabel = (
    <DisplayLabel value={makerWallet} white expand>
      <BlockH5>
        {makerWallet === ETH_ADDRESS ? 'Public Order' : condenseAddress(makerWallet, true, false, 'bottom')}
      </BlockH5>
    </DisplayLabel>
  )

  // Taker Labels
  const takerParamLabel = (
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
      <H5 textAlign="left" display="inline-flex" weight={theme.text.fontWeight.medium}>
        {getFormattedTokenDisplay({
          amount: takerParam,
          id: takerTokenId,
          symbol: takerToken && takerToken.symbol,
          kind: takerToken && takerToken.kind,
        })}
      </H5>
    </DisplayLabel>
  )

  const takerPriceLabel = renderPriceLabel(takerSymbol, calculatePrice(takerParam, makerParam), makerSymbol)
  const takerWalletLabel = (
    <DisplayLabel value={takerWallet} white expand>
      <BlockH5>
        {takerWallet === ETH_ADDRESS ? 'Public Order' : condenseAddress(takerWallet, true, false, 'bottom')}
      </BlockH5>
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

  return (
    <OrderSummaryContainer color={widgetPrimaryColor}>
      <TopContainer color={widgetPrimaryColor} justify="center">
        <H1 color="white" weight={theme.text.fontWeight.medium} data-test="trade-completed-title">
          <FormattedMessage defaultMessage="Trade Completed" />
        </H1>
        <VerticalSpacer units={4} />
        <H4 color="rgba(255, 255, 255, 0.75)" weight={theme.text.fontWeight.light}>
          <FormattedMessage defaultMessage="This trade has been executed and is no longer active" />
        </H4>
        <VerticalSpacer units={12} />

        {/* Left Column */}
        <LabelContainer justify="center" expand>
          <LabelColumn direction="column">
            <Flex>
              <DisplayLabelHeader>
                {props.userOrderRole === UserOrderRole.OTHER ? (
                  <FormattedMessage defaultMessage="Maker sent" />
                ) : (
                  <FormattedMessage defaultMessage="You sent" />
                )}
              </DisplayLabelHeader>
              <DisplayLabelWrapper>
                {props.userOrderRole === UserOrderRole.MAKER ? makerParamLabel : takerParamLabel}
              </DisplayLabelWrapper>
              {showPriceLabel && (props.userOrderRole === UserOrderRole.MAKER ? makerPriceLabel : takerPriceLabel)}
            </Flex>

            <VerticalSpacer units={5} />

            <Flex>
              <DisplayLabelHeader>
                {props.userOrderRole === UserOrderRole.OTHER ? (
                  <FormattedMessage defaultMessage="Maker wallet" />
                ) : (
                  <FormattedMessage defaultMessage="Your wallet" />
                )}
              </DisplayLabelHeader>
              <DisplayLabelWrapper>
                {props.userOrderRole === UserOrderRole.MAKER ? makerWalletLabel : takerWalletLabel}
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
                {props.userOrderRole === UserOrderRole.OTHER ? (
                  <FormattedMessage defaultMessage="Taker received" />
                ) : (
                  <FormattedMessage defaultMessage="You received" />
                )}
              </DisplayLabelHeader>
              <DisplayLabelWrapper>
                {props.userOrderRole === UserOrderRole.MAKER ? takerParamLabel : makerParamLabel}
              </DisplayLabelWrapper>
              {showPriceLabel && (props.userOrderRole === UserOrderRole.MAKER ? takerPriceLabel : makerPriceLabel)}
            </Flex>

            <VerticalSpacer units={5} />

            <Flex>
              <DisplayLabelHeader>
                {props.userOrderRole === UserOrderRole.OTHER ? (
                  <FormattedMessage defaultMessage="Taker wallet" />
                ) : (
                  <FormattedMessage defaultMessage="Counterparty wallet" />
                )}
              </DisplayLabelHeader>
              <DisplayLabelWrapper>
                {props.userOrderRole === UserOrderRole.MAKER ? takerWalletLabel : makerWalletLabel}
              </DisplayLabelWrapper>
            </Flex>
          </LabelColumn>
        </LabelContainer>
      </TopContainer>

      <BottomContainer color={widgetPrimaryColor}>
        <Flex expand>
          <Button
            color={widgetPrimaryColor}
            onClick={openEtherscanLink.bind(null, props.transactionHash, 'tx')}
            variant={ButtonVariant.SECONDARY}
            size={ButtonSize.LARGE}
            expand={isMobile()}
          >
            <Flex align="center" direction="row" justify="center">
              <H6 fit>
                <FormattedMessage defaultMessage="Etherscan" />
              </H6>
              <EtherscanButtonIcon color={widgetPrimaryColor}>
                <ArrowRightIcon />
              </EtherscanButtonIcon>
            </Flex>
          </Button>
          <VerticalSpacer units={4} />
          <Button variant={ButtonVariant.BLANK} onClick={onCreateNewOrderClick}>
            <FormattedMessage defaultMessage="Create a new order" />
          </Button>
        </Flex>
      </BottomContainer>
    </OrderSummaryContainer>
  )
}

export default Container(withRouter(injectIntl(OrderCompleted)))
