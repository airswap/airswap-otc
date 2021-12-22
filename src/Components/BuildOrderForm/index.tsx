import React, { useContext, useEffect, useState } from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'

import { WidgetContext } from '../../app/context/WidgetContext'
import ArrowIcon, { ArrowDirection } from '../../elements/ArrowIcon'
import Button, { ButtonSize, ButtonVariant } from '../../elements/Button'
import { Flex } from '../../elements/Flex'
import MediaQuery from '../../elements/MediaQueryWrapper'
import { VerticalSpacer } from '../../elements/Spacer'
import { H1, H4, H6 } from '../../elements/Typography'
import { ReactComponent as ArrowRightIcon } from '../../static/arrow-right-icon.svg'
import theme from '../../theme'
import { TokenKind } from '../../types/models/Tokens'
import { getFormattedNumber, willFormatNumber } from '../../utils/transformations'
import ExpirationSelector from '../ExpirationSelector'
import ValidationForm from '../validationComponents/ValidationForm'
import Container, { BuildOrderFormProps } from './Container'
import CounterpartyAddressInput from './CounterpartyAddressInput'
import PriceInput from './PriceInput'
import SendReceiveInput from './SendReceiveInput'
import {
  ArrowContainer,
  BottomContainer,
  CounterpartyAddressInputContainer,
  CreateOrderButtonIcon,
  ExpirationSelectorContainer,
  FormTitleContainer,
  FormTitleSpacer,
  SendReceiveContent,
  SendReceiveContentHeader,
  SendReceiveFormContent,
  SendReceiveFormHeader,
  SubmitButtonContainer,
  TopContainer,
} from './styles'

const messages = defineMessages({
  ENTER_ADDRESS: {
    defaultMessage: 'Counterparty wallet (Recommended)',
  },
})

function BuildOrderForm(props: BuildOrderFormProps) {
  const [makerRate, setMakerRate] = useState<string>()
  const [takerRate, setTakerRate] = useState<string>()
  const [isReverse, setIsReverse] = useState<boolean>(false)

  const { isWidget, widgetParams } = useContext(WidgetContext)

  const {
    makerTokenAddress,
    setMakerTokenAddress,
    makerTokenId,
    setMakerTokenId,
    makerParam,
    setMakerParam,
    makerTokenKind,
    setMakerTokenKind,
    orderExpiry,
    setOrderExpiry,
    takerTokenAddress,
    setTakerTokenAddress,
    takerTokenId,
    setTakerTokenId,
    takerParam,
    setTakerParam,
    takerTokenKind,
    setTakerTokenKind,
    takerWallet,
    setTakerWallet,
    expirationType,
    setExpirationType,
    onSubmit,
    intl: { formatMessage },
    tokensByAddress,
  } = props
  const makerTokenSymbol =
    tokensByAddress && makerTokenAddress.value && tokensByAddress[makerTokenAddress.value]
      ? tokensByAddress[makerTokenAddress.value].symbol
      : 'N/A'

  const takerTokenSymbol =
    tokensByAddress && takerTokenAddress.value && tokensByAddress[takerTokenAddress.value]
      ? tokensByAddress[takerTokenAddress.value].symbol
      : 'N/A'

  const priceLocked = makerParam.locked || takerParam.locked
  const arrowLocked = priceLocked || makerTokenAddress.locked || takerTokenAddress.locked
  const showPriceInput =
    makerTokenKind !== TokenKind.ERC721 &&
    makerTokenKind !== TokenKind.ERC1155 &&
    takerTokenKind !== TokenKind.ERC721 &&
    takerTokenKind !== TokenKind.ERC1155

  const formatAmountValue = (value: string) => {
    if (willFormatNumber(value, 20, 8)) {
      return getFormattedNumber(value, 20, 8)
    }
    return value
  }

  const safeDivision = (value1, value2) => {
    if (!value1 || !value2) return '0'
    if (!Number(value1) || !Number(value2)) return '0'
    return `${Number(value1) / Number(value2)}`
  }

  const safeMultiplication = (value1, value2) => {
    if (!value1 || !value2) return '0'
    if (!Number(value1) || !Number(value2)) return '0'
    return `${Number(value1) * Number(value2)}`
  }

  const updatemakerParam = (value: string) => {
    setMakerParam(formatAmountValue(value))
    // if maker price not set, set it
    if (!makerRate) {
      setMakerRate('1')
    }

    // update price
    if (showPriceInput) {
      setMakerRate(formatAmountValue(safeDivision(takerParam.value, value)))
      setTakerRate(formatAmountValue(safeDivision(value, takerParam.value)))
    }
  }

  const updatetakerParam = (value: string) => {
    setTakerParam(formatAmountValue(value))
    // if taker price not set, set it
    if (!takerRate) {
      setTakerRate('1')
    }

    // update price
    if (showPriceInput) {
      setMakerRate(formatAmountValue(safeDivision(value, makerParam.value)))
      setTakerRate(formatAmountValue(safeDivision(makerParam.value, value)))
    }
  }

  const onMakerRateChange = (value: string) => {
    setMakerRate(value)

    // if maker param not set, set it
    if (!makerParam.value) {
      setMakerParam('1')
    }

    // update taker amount and price
    setTakerParam(formatAmountValue(safeMultiplication(value, makerParam.value || 1)))
    setTakerRate(formatAmountValue(safeDivision(1, value || 1)))
  }

  const onTakerRateChange = (value: string) => {
    setTakerRate(value)

    // if taker param not set, set it
    if (!takerParam.value) {
      setTakerParam('1')
    }

    // update maker amount and price
    setMakerParam(formatAmountValue(safeMultiplication(value, takerParam.value || 1)))
    setMakerRate(formatAmountValue(safeDivision(1, Number(value || 1))))
  }

  const reverse = () => {
    setIsReverse(!isReverse)
    // Swap Price
    setMakerRate(formatAmountValue(safeDivision(makerParam.value, takerParam.value)))
    setTakerRate(formatAmountValue(safeDivision(takerParam.value, makerParam.value)))
    props.reverse()
  }

  useEffect(() => {
    if (isWidget && widgetParams.order && showPriceInput) {
      setMakerRate(formatAmountValue(safeDivision(takerParam.value, makerParam.value)))
      setTakerRate(formatAmountValue(safeDivision(makerParam.value, takerParam.value)))
    }
  }, [makerParam.value, takerParam.value, showPriceInput])

  const widgetPrimaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.primaryColor
    : undefined
  const widgetSecondaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.secondaryColor
    : undefined

  return (
    <ValidationForm onSubmit={onSubmit} validatedValues={[makerParam, orderExpiry, takerParam, takerWallet]}>
      <TopContainer backgroundColor={widgetPrimaryColor}>
        <SendReceiveFormHeader>
          <H1 color="white" weight={theme.text.fontWeight.medium}>
            <FormattedMessage defaultMessage="Start a Trade" />
          </H1>
          <MediaQuery size="sm">
            <VerticalSpacer units={2} />
            <H6 color="rgba(255, 255, 255, 0.25)" weight={theme.text.fontWeight.light}>
              <FormattedMessage defaultMessage="Select the tokens, amounts, and expiration for your trade" />
            </H6>
          </MediaQuery>
          <MediaQuery size="md-up">
            <VerticalSpacer units={4} />
            <H4 color="rgba(255, 255, 255, 0.75)" weight={theme.text.fontWeight.light}>
              <FormattedMessage defaultMessage="Select the tokens, amounts, and expiration for your trade" />
            </H4>
            <VerticalSpacer units={12} />
          </MediaQuery>
        </SendReceiveFormHeader>

        {/* Form Title */}
        <MediaQuery size="md-up">
          <FormTitleContainer>
            <SendReceiveContentHeader textAlign="right">
              <FormattedMessage defaultMessage="You’ll send" />
            </SendReceiveContentHeader>
            <FormTitleSpacer />
            <SendReceiveContentHeader textAlign="left">
              <FormattedMessage defaultMessage="You’ll receive" />
            </SendReceiveContentHeader>
          </FormTitleContainer>
        </MediaQuery>

        {/* Form Inputs */}
        <SendReceiveFormContent>
          {/* Maker */}
          <SendReceiveContent align="flex-end">
            <MediaQuery size="sm">
              <SendReceiveContentHeader textAlign="center">
                <FormattedMessage defaultMessage="You’ll send" />
              </SendReceiveContentHeader>
              <SendReceiveInput
                showBalance
                showPriceInput={showPriceInput}
                dataTest="build-order-form-send-mobile"
                justify="flex-start"
                errorAlign="right"
                value={makerParam}
                onChange={updatemakerParam}
                tokenId={makerTokenId}
                setTokenId={setMakerTokenId}
                tokenAddress={makerTokenAddress}
                onTokenAddressChange={setMakerTokenAddress}
                tokenKind={makerTokenKind}
                setTokenKind={setMakerTokenKind}
                tokensByAddress={tokensByAddress}
              />
              {showPriceInput && (
                <PriceInput
                  align="center"
                  locked={priceLocked}
                  baseTokenSymbol={makerTokenSymbol}
                  tokenSymbol={takerTokenSymbol}
                  value={makerRate || null}
                  onChange={onMakerRateChange}
                />
              )}
            </MediaQuery>
            <MediaQuery size="md-up">
              <SendReceiveInput
                showBalance
                isReverse
                showPriceInput={showPriceInput}
                dataTest="build-order-form-send"
                justify="flex-start"
                errorAlign="right"
                value={makerParam}
                onChange={updatemakerParam}
                tokenId={makerTokenId}
                setTokenId={setMakerTokenId}
                tokenAddress={makerTokenAddress}
                onTokenAddressChange={setMakerTokenAddress}
                tokenKind={makerTokenKind}
                setTokenKind={setMakerTokenKind}
                tokensByAddress={tokensByAddress}
              />
              {showPriceInput && (
                <PriceInput
                  align="flex-end"
                  locked={priceLocked}
                  baseTokenSymbol={makerTokenSymbol}
                  tokenSymbol={takerTokenSymbol}
                  value={makerRate || null}
                  onChange={onMakerRateChange}
                />
              )}
            </MediaQuery>
          </SendReceiveContent>

          <ArrowContainer>
            <MediaQuery size="sm">
              <ArrowIcon
                color={widgetPrimaryColor}
                isReverse={isReverse}
                direction={ArrowDirection.DOWN}
                onClick={arrowLocked ? undefined : reverse}
              />
            </MediaQuery>
            <MediaQuery size="md-up">
              <ArrowIcon
                color={widgetPrimaryColor}
                isReverse={isReverse}
                direction={ArrowDirection.RIGHT}
                onClick={arrowLocked ? undefined : reverse}
              />
            </MediaQuery>
          </ArrowContainer>

          {/* Taker */}
          <SendReceiveContent align="flex-start">
            <MediaQuery size="sm">
              <SendReceiveContentHeader textAlign="center">
                <FormattedMessage defaultMessage="You’ll receive" />
              </SendReceiveContentHeader>
              <SendReceiveInput
                showPriceInput={showPriceInput}
                justify="flex-start"
                errorAlign="right"
                dataTest="build-order-form-receive-mobile"
                value={takerParam}
                onChange={updatetakerParam}
                tokenId={takerTokenId}
                setTokenId={setTakerTokenId}
                tokenAddress={takerTokenAddress}
                onTokenAddressChange={setTakerTokenAddress}
                tokenKind={takerTokenKind}
                setTokenKind={setTakerTokenKind}
                tokensByAddress={tokensByAddress}
              />
              {showPriceInput && (
                <PriceInput
                  align="center"
                  locked={priceLocked}
                  baseTokenSymbol={takerTokenSymbol}
                  tokenSymbol={makerTokenSymbol}
                  value={takerRate || null}
                  onChange={onTakerRateChange}
                />
              )}
            </MediaQuery>
            <MediaQuery size="md-up">
              <SendReceiveInput
                showPriceInput={showPriceInput}
                justify="flex-start"
                errorAlign="left"
                dataTest="build-order-form-receive"
                value={takerParam}
                onChange={updatetakerParam}
                tokenId={takerTokenId}
                setTokenId={setTakerTokenId}
                tokenAddress={takerTokenAddress}
                onTokenAddressChange={setTakerTokenAddress}
                tokenKind={takerTokenKind}
                setTokenKind={setTakerTokenKind}
                tokensByAddress={tokensByAddress}
              />
              {showPriceInput && (
                <PriceInput
                  align="flex-start"
                  locked={priceLocked}
                  baseTokenSymbol={takerTokenSymbol}
                  tokenSymbol={makerTokenSymbol}
                  value={takerRate || null}
                  onChange={onTakerRateChange}
                />
              )}
            </MediaQuery>
          </SendReceiveContent>
        </SendReceiveFormContent>
      </TopContainer>

      <BottomContainer>
        <CounterpartyAddressInputContainer>
          <CounterpartyAddressInput
            iconColor={widgetSecondaryColor}
            expand
            errorAlign="left"
            value={takerWallet}
            onChange={setTakerWallet}
            placeholder={formatMessage(messages.ENTER_ADDRESS)}
          />
        </CounterpartyAddressInputContainer>
        <ExpirationSelectorContainer>
          <ExpirationSelector
            iconColor={widgetSecondaryColor}
            expirationValue={orderExpiry}
            setExpirationValue={setOrderExpiry}
            selectedExpirationType={expirationType}
            onSelectExpirationType={setExpirationType}
          />
        </ExpirationSelectorContainer>
        <SubmitButtonContainer>
          <Button
            submit
            expand
            backgroundColor={widgetSecondaryColor}
            variant={ButtonVariant.PRIMARY}
            size={ButtonSize.LARGE}
            dataTest="build-order-form-submit-btn"
            hoverColor={theme.palette.successColor}
          >
            <Flex align="center" direction="row" justify="center">
              <H6 fit>
                <FormattedMessage defaultMessage="Create" />
              </H6>
              <CreateOrderButtonIcon>
                <ArrowRightIcon />
              </CreateOrderButtonIcon>
            </Flex>
          </Button>
        </SubmitButtonContainer>
      </BottomContainer>
    </ValidationForm>
  )
}

export default Container(injectIntl(BuildOrderForm))
