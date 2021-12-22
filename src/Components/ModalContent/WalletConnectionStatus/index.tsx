import React, { useContext, useEffect, useMemo } from 'react'
import { defineMessages, injectIntl } from 'react-intl'

import { FormSubmitContext } from '../../../app/context/FormSubmitContext'
import { ModalContext } from '../../../app/context/ModalContext'
import { WalletContext } from '../../../app/context/WalletContext'
import { Flex } from '../../../elements/Flex'
import { VerticalSpacer } from '../../../elements/Spacer'
import { H3, H4, H6 } from '../../../elements/Typography'
import SuccessIconGif from '../../../static/animated-success-icon.gif'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { ReactComponent as ConnectingIcon } from '../../../static/connecting-logo.svg'
import { ReactComponent as SignConnectIcon } from '../../../static/sign-to-connect-icon.svg'
import { ReactComponent as ErrorIcon } from '../../../static/wallet-connect-error-icon.svg'
import theme from '../../../theme'
import { isMobile } from '../../../utils/helpers'
import { IconContainer } from '../styles'
import Container, { WalletConnectionStatusProps } from './Container'
import { Close, ModalContainer } from './styles'

const messages = defineMessages({
  APPROVE_TOKEN: {
    defaultMessage: 'Confirm transaction to approve token',
  },
  HANDSHAKE: {
    defaultMessage: 'Sign to Connect',
  },
  HANDSHAKE_SUBTITLE: {
    defaultMessage: 'Sign with your wallet to connect with AirSwap.',
  },
  WRAP_WETH: {
    defaultMessage: 'Confirm transaction to wrap ETH',
  },
  UNWRAP_WETH: {
    defaultMessage: 'Confirm transaction to unwrap WETH',
  },
  WALLET_ERROR: {
    defaultMessage: 'Wallet Error',
  },
  WALLET_ERROR_TEXT_1: {
    defaultMessage: 'Something went wrong when connecting your wallet. Please try again.',
  },
  WALLET_ERROR_TEXT_2: {
    defaultMessage: 'If the issue persists, please report the problem on Discord.',
  },
  SEARCHING: {
    defaultMessage: 'Scanning Peers',
  },
  SIGN_ORDER: {
    defaultMessage: 'Sign order to confirm',
  },
  WALLET_CONNECTING: {
    defaultMessage: 'Unlock wallet to continue',
  },
  ROUTER_CONNECTING: {
    defaultMessage: 'Connecting',
  },
  WAITING_KEYSPACE: {
    defaultMessage: 'Sign message to continue',
  },
  WALLET_CONNECTED: {
    defaultMessage: 'Wallet connected!',
  },
  CONNECT_WALLET: {
    defaultMessage: 'Connect a wallet',
  },
})

function WalletConnectionStatus(props: WalletConnectionStatusProps) {
  const {
    intl: { formatMessage },
  } = props

  const { setShowWalletConnect } = useContext(WalletContext)
  const { setModalOpen } = useContext(ModalContext)
  const { setIsFormSubmitting, setShouldProgress } = useContext(FormSubmitContext)

  // callback triggers for wallet connection success/failure
  useEffect(() => {
    if (props.walletConnectionError) {
      setIsFormSubmitting(false)
    }
  }, [props.walletConnectionError])

  const handleCloseClick = e => {
    e.preventDefault()
    setModalOpen(false)
    if (props.connectedWalletAddress) {
      setShowWalletConnect(false)
    }
  }

  const dismissWallet = async () => {
    setShowWalletConnect(false)
    await setModalOpen(false)
    setShouldProgress(true)
  }

  const connectionIcon = useMemo(() => {
    if (props.isWalletConnecting || props.isConnectingRouter) {
      return <ConnectingIcon />
    }
    if (props.isWalletSigning) {
      return <SignConnectIcon />
    }
    if (props.walletConnectionError) {
      return <ErrorIcon />
    }
    if (props.connectedWalletAddress) {
      return <img src={SuccessIconGif} />
    }
  }, [
    props.isWalletConnecting,
    props.isConnectingRouter,
    props.isWalletSigning,
    props.walletConnectionError,
    props.connectedWalletAddress,
  ])

  const connectionStatus = useMemo(() => {
    if (props.isWalletConnecting) {
      return <H4 weight={theme.text.fontWeight.semibold}>{formatMessage(messages.WALLET_CONNECTING)}</H4>
    }

    if (props.isConnectingRouter) {
      return <H4 weight={theme.text.fontWeight.semibold}>{formatMessage(messages.ROUTER_CONNECTING)}</H4>
    }

    if (props.isWalletSigning) {
      return <H3 weight={theme.text.fontWeight.semibold}>{formatMessage(messages.HANDSHAKE)}</H3>
    }

    if (props.walletConnectionError) {
      return <H3 weight={theme.text.fontWeight.semibold}>{formatMessage(messages.WALLET_ERROR)}</H3>
    }

    if (props.connectedWalletAddress) {
      // Dismiss success modal after 1 second. If Mobile, dismiss immediately
      setTimeout(dismissWallet, isMobile() ? 0 : 1000)
    }
    return (
      <H4 weight={theme.text.fontWeight.semibold}>
        {props.connectedWalletAddress
          ? formatMessage(messages.WALLET_CONNECTED)
          : formatMessage(messages.CONNECT_WALLET)}
      </H4>
    )
  }, [
    props.isWalletConnecting,
    props.isConnectingRouter,
    props.isWalletSigning,
    props.walletConnectionError,
    props.connectedWalletAddress,
  ])

  const connectionSubtext = useMemo(() => {
    if (props.isWalletSigning) {
      return <H6 weight={theme.text.fontWeight.light}>{formatMessage(messages.HANDSHAKE_SUBTITLE)}</H6>
    }

    if (props.walletConnectionError) {
      return <H6 weight={theme.text.fontWeight.light}>{props.walletConnectionError}</H6>
    }

    return null
  }, [props.isWalletSigning, props.walletConnectionError])

  return (
    <ModalContainer justify="center">
      <Close onClick={handleCloseClick} data-test="wallet-connection-status-close-btn">
        <CloseIcon />
      </Close>
      <IconContainer>{connectionIcon}</IconContainer>
      <VerticalSpacer units={10} />
      <Flex>
        {connectionStatus}
        <VerticalSpacer units={2} />
        {connectionSubtext}
      </Flex>
    </ModalContainer>
  )
}

export default Container(injectIntl(WalletConnectionStatus))
