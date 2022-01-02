import { getSwapOrderId } from 'airswap.js/src/swap/utils'
import React, { useContext, useEffect, useState } from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { ModalContext } from '../../../app/context/ModalContext'
import { WidgetContext } from '../../../app/context/WidgetContext'
import Button, { ButtonVariant } from '../../../elements/Button'
import { Flex } from '../../../elements/Flex'
import { HorizontalSpacer, VerticalSpacer } from '../../../elements/Spacer'
import { H4, H6 } from '../../../elements/Typography'
import SuccessIconGif from '../../../static/animated-success-icon.gif'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { ReactComponent as TrashIcon } from '../../../static/dumpster-icon.svg'
import { ReactComponent as ErrorIcon } from '../../../static/wallet-connect-error-icon.svg'
import theme from '../../../theme'
import { isMobile, redirectWithCID } from '../../../utils/helpers'
import ActionStatus from '../ActionStatus'
import { IconContainer } from '../styles'
import { Close, ModalContainer } from '../WalletConnectionStatus/styles'
import Container, { CancellationStatusProps } from './Container'

const ModalButton = styled(Button)`
  width: 120px;
  height: 40px;
`

const messages = defineMessages({
  IS_CONVICTION: {
    defaultMessage: 'Are you sure?',
  },
  ERROR_SUBMITTING: {
    defaultMessage: 'Error submitting cancellation.',
  },
  ERROR_MINING: {
    defaultMessage: 'Error mining cancellation.',
  },
  SUBMIT_SUCCESS: {
    defaultMessage: 'Cancellation successful!',
  },
  CANCEL_CONFIRM: {
    defaultMessage: 'Are you sure you want to cancel this trade? It will cost gas to cancel.',
  },
})

function CancellationStatusModal(props: CancellationStatusProps) {
  const { setModalOpen } = useContext(ModalContext)
  const { isWidget, widgetParams } = useContext(WidgetContext)

  const [ready, setReady] = useState<boolean>(false)
  const [isUserReady, setIsUserReady] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const {
    intl: { formatMessage },
  } = props

  const handleCloseClick = () => setModalOpen(false)

  const orderId = getSwapOrderId(props.signedOrder)

  useEffect(() => {
    if (props.isWalletSigningTx || props.submittingCancelSwap[orderId]) {
      setReady(true)
    }

    // dispatch cancel order action after user confirms
    if (isUserReady && !isCancelling) {
      setIsCancelling(true)
      if (Number(widgetParams.orderGasLimit)) {
        props.cancelSwap(props.signedOrder, { gasLimit: Number(widgetParams.orderGasLimit) })
      } else {
        props.cancelSwap(props.signedOrder)
      }
    }

    // show cancel popover card after successful cancel
    if (
      isCancelling &&
      !props.miningCancelSwap[orderId] &&
      !props.submittingCancelSwap[orderId] &&
      !props.isWalletSigningTx[orderId] &&
      !props.errorSubmittingCancelSwap[orderId]
    ) {
      if (ready) {
        if (isWidget && widgetParams.onCancel && props.transactionsCancelSwap[orderId]) {
          widgetParams.onCancel(props.transactionsCancelSwap[orderId].hash)
        }

        setTimeout(
          async () => {
            await setModalOpen(false)
            redirectWithCID(props.orderCID)
          },
          isMobile() ? 0 : 1000,
        )
      }
    }
  }, [
    isUserReady,
    isCancelling,
    props.submittingCancelSwap,
    props.miningCancelSwap,
    props.isWalletSigningTx,
    props.submittingCancelSwap,
    props.transactionsCancelSwap,
  ])

  const widgetSecondaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.secondaryColor
    : undefined

  // Conviction
  if (!isUserReady) {
    return (
      <ModalContainer justify="center">
        <Close onClick={handleCloseClick}>
          <CloseIcon />
        </Close>
        <IconContainer>
          <TrashIcon />
        </IconContainer>
        <VerticalSpacer units={10} />
        <Flex>
          <H4 weight={theme.text.fontWeight.semibold}>{formatMessage(messages.IS_CONVICTION)}</H4>
          <VerticalSpacer units={2} />
          <H6 weight={theme.text.fontWeight.light}>{formatMessage(messages.CANCEL_CONFIRM)}</H6>
        </Flex>
        <VerticalSpacer units={12} />
        <Flex justify="center" expand direction="row">
          <ModalButton
            color={widgetSecondaryColor}
            onClick={() => setModalOpen(false)}
            variant={ButtonVariant.SECONDARY}
          >
            <FormattedMessage defaultMessage="Not now" />
          </ModalButton>
          <HorizontalSpacer units={6} />
          <ModalButton
            backgroundColor={widgetSecondaryColor}
            onClick={() => setIsUserReady(true)}
            variant={ButtonVariant.PRIMARY}
          >
            <FormattedMessage defaultMessage="Cancel trade" />
          </ModalButton>
        </Flex>
      </ModalContainer>
    )
  }

  // Sign/Filling Order
  if (props.isWalletSigningTx || props.submittingCancelSwap[orderId] || props.miningCancelSwap[orderId]) {
    return <ActionStatus icon={TrashIcon} title="Cancel Trade" />
  }

  // Error
  if (props.errorSubmittingCancelSwap[orderId] || props.errorMiningCancelSwap[orderId]) {
    return (
      <ModalContainer justify="center">
        <Close onClick={handleCloseClick}>
          <CloseIcon />
        </Close>
        <IconContainer>
          <ErrorIcon />
        </IconContainer>
        <VerticalSpacer units={10} />
        <Flex>
          <H4 weight={theme.text.fontWeight.semibold}>
            {formatMessage(
              props.errorSubmittingCancelSwap[orderId] ? messages.ERROR_SUBMITTING : messages.ERROR_MINING,
            )}
          </H4>
        </Flex>
      </ModalContainer>
    )
  }

  if (props.errorMiningCancelSwap[orderId]) {
    return <H4 weight={theme.text.fontWeight.semibold}>{formatMessage(messages.ERROR_MINING)}</H4>
  }

  return (
    <ModalContainer justify="center">
      <Close onClick={handleCloseClick}>
        <CloseIcon />
      </Close>
      <IconContainer>
        <img src={SuccessIconGif} />
      </IconContainer>
      <VerticalSpacer units={10} />
      <Flex>
        <H4 weight={700}>{formatMessage(messages.SUBMIT_SUCCESS)}</H4>
      </Flex>
    </ModalContainer>
  )
}

export default Container(withRouter(injectIntl(CancellationStatusModal)))
