import React, { useContext, useEffect, useState } from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'

import { FormSubmitContext } from '../../../app/context/FormSubmitContext'
import { ModalContext, ModalPosition } from '../../../app/context/ModalContext'
import { WalletContext } from '../../../app/context/WalletContext'
import { WidgetContext } from '../../../app/context/WidgetContext'
import { Flex } from '../../../elements/Flex'
import { VerticalSpacer } from '../../../elements/Spacer'
import { H3, H4, H6 } from '../../../elements/Typography'
import SubmitIconGif from '../../../static/animated-submit-icon.gif'
import SuccessIconGif from '../../../static/animated-success-icon.gif'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { ReactComponent as ErrorIcon } from '../../../static/wallet-connect-error-icon.svg'
import theme from '../../../theme'
import { isMobile } from '../../../utils/helpers'
import ActionStatus from '../ActionStatus'
import { IconContainer } from '../styles'
import Container, { TransactionStatusProps } from './Container'
import { Close, ModalContainer } from './styles'

const messages = defineMessages({
  SUBMITTING: {
    defaultMessage: 'Submitting transaction',
  },
  SUBMITTING_DESCRIPTION: {
    defaultMessage:
      'Authorize this action by signing with your wallet and then wait while the transaction is finalized.',
  },
  ERROR_SUBMITTING: {
    defaultMessage: 'Error submitting transaction',
  },
  ERROR_SUBMITTING_DESCRIPTION: {
    defaultMessage: 'There was an error submitting the transaction. Try again later',
  },
  ERROR_MINING: {
    defaultMessage: 'Error mining transaction.',
  },
  ERROR_MINING_DESCRIPTION: {
    defaultMessage: 'There was an error mining the transaction. Try again later',
  },
  SUBMIT_SUCCESS: {
    defaultMessage: 'Transaction successful!',
  },
  SIGN_ORDER: {
    defaultMessage: 'Sign to Create Order',
  },
  SIGN_ORDER_DESCRIPTION: {
    defaultMessage: 'To create this order, you must confirm the transaction with your wallet.',
  },
})

function TransactionStatus(props: TransactionStatusProps) {
  const {
    intl: { formatMessage },
  } = props
  const [ready, setReady] = useState<boolean>(false)
  const [hasCompleted, setHasCompleted] = useState<boolean>(false)
  const { setModalOpen, setModalSettings } = useContext(ModalContext)
  const { setShowWalletConnect } = useContext(WalletContext)
  const { setIsFormSubmitting, setShouldProgress } = useContext(FormSubmitContext)
  const { isWidget, widgetParams } = useContext(WidgetContext)

  useEffect(() => {
    if (!props.isTransaction && props.isWalletSigning) {
      setReady(true)
    }

    if (props.isWalletSigning || props.isSubmittingFillOrder || props.isMiningFillOrder) {
      setReady(true)
    }

    if (props.errorMiningFillOrder || props.errorSubmittingFillOrder) {
      setIsFormSubmitting(false)
      setModalSettings({ canDismiss: true, mobilePosition: ModalPosition.BOTTOM })
    }
  }, [
    props.isWalletSigning,
    props.isSubmittingFillOrder,
    props.isMiningFillOrder,
    props.isTransaction,
    props.errorMiningFillOrder,
    props.errorSubmittingFillOrder,
  ])

  // Widget callback for errors
  useEffect(() => {
    if (
      isWidget &&
      widgetParams.onError &&
      ready &&
      props.isTransaction &&
      (props.errorMiningFillOrder || props.errorSubmittingFillOrder)
    ) {
      widgetParams.onError(props.errorMiningFillOrder || props.errorSubmittingFillOrder)
    }
  }, [
    isWidget,
    JSON.stringify(widgetParams),
    ready,
    props.isTransaction,
    props.errorMiningFillOrder,
    props.errorSubmittingFillOrder,
  ])

  // Building an Order
  if (!props.isTransaction && props.isWalletSigning) {
    return (
      <ModalContainer justify="center">
        <IconContainer>
          <img src={SubmitIconGif} />
        </IconContainer>
        <VerticalSpacer units={10} />
        <Flex>
          <H3 weight={theme.text.fontWeight.semibold}>{formatMessage(messages.SIGN_ORDER)}</H3>
          <VerticalSpacer units={3} />
          <H6 weight={theme.text.fontWeight.light}>{formatMessage(messages.SIGN_ORDER_DESCRIPTION)}</H6>
        </Flex>
      </ModalContainer>
    )
  }

  // Sign/Filling Order
  if (props.isWalletSigning || props.isSubmittingFillOrder || props.isMiningFillOrder) {
    return <ActionStatus gif={SubmitIconGif} title="Submit Order" />
  }

  // Error
  if (ready && props.isTransaction && (props.errorMiningFillOrder || props.errorSubmittingFillOrder)) {
    return (
      <ModalContainer justify="center">
        <Close onClick={() => setModalOpen(false)}>
          <CloseIcon />
        </Close>
        <IconContainer>
          <ErrorIcon />
        </IconContainer>
        <VerticalSpacer units={10} />
        <Flex>
          <H3 weight={theme.text.fontWeight.semibold}>
            {formatMessage(props.errorMiningFillOrder ? messages.ERROR_MINING : messages.ERROR_SUBMITTING)}
          </H3>
          <VerticalSpacer units={3} />
          <H6 weight={theme.text.fontWeight.light}>
            {formatMessage(
              props.errorMiningFillOrder ? messages.ERROR_MINING_DESCRIPTION : messages.ERROR_SUBMITTING_DESCRIPTION,
            )}
          </H6>
        </Flex>
      </ModalContainer>
    )
  }

  if (ready && !hasCompleted) {
    // Trigger widget callback
    if (isWidget && widgetParams.onSwap && props.isTransaction && props.transactionHash) {
      widgetParams.onSwap(props.transactionHash)
    }

    setHasCompleted(true)
    setTimeout(
      async () => {
        setShowWalletConnect(false)
        await setModalOpen(false)
        setShouldProgress(true)
        if (props.onTransactionComplete) {
          props.onTransactionComplete()
        }
      },
      isMobile() ? 0 : 1000,
    )
  }

  // Success
  return (
    <ModalContainer justify="center">
      <IconContainer>
        <img src={SuccessIconGif} />
      </IconContainer>
      <VerticalSpacer units={10} />
      <Flex>
        <H4 weight={theme.text.fontWeight.semibold}>
          <FormattedMessage defaultMessage="Success!" />
        </H4>
      </Flex>
    </ModalContainer>
  )
}

export default Container(injectIntl(TransactionStatus))
