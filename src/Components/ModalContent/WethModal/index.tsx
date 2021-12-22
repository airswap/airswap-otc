import { ETH_ADDRESS, WETH_CONTRACT_ADDRESS } from 'airswap.js/src/constants'
import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

import { FormSubmitContext } from '../../../app/context/FormSubmitContext'
import { ModalContext, ModalPosition } from '../../../app/context/ModalContext'
import Button, { ButtonVariant } from '../../../elements/Button'
import { Flex } from '../../../elements/Flex'
import { VerticalSpacer } from '../../../elements/Spacer'
import { H3, H4, H6 } from '../../../elements/Typography'
import CandyIconGif from '../../../static/animated-candy-icon.gif'
import SuccessIconGif from '../../../static/animated-success-icon.gif'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { ReactComponent as WalletConnectErrorIcon } from '../../../static/wallet-connect-error-icon.svg'
import theme from '../../../theme'
import ActionStatus from '../ActionStatus'
import { IconContainer } from '../styles'
import { Close, ModalContainer } from '../WalletConnectionStatus/styles'
import Container, { WethModalProps } from './Container'

function WethModal(props: WethModalProps) {
  const { setModalOpen, setModalSettings } = useContext(ModalContext)
  const { setShouldProgress } = useContext(FormSubmitContext)

  const [isWrapping, setIsWrapping] = useState(false)
  const [isUnwrapping, setIsUnwrapping] = useState(false)

  const handleCloseClick = () => {
    setModalOpen(false)
  }

  const startWrapFlow = async () => {
    setModalSettings({ canDismiss: false, mobilePosition: ModalPosition.BOTTOM })
    setIsWrapping(true)
    props.wrapWeth(props.minimumWrapAmount)
  }

  const startUnwrapFlow = async () => {
    setModalSettings({ canDismiss: false, mobilePosition: ModalPosition.BOTTOM })
    setIsUnwrapping(true)
    props.unwrapWeth(props.minimumWrapAmount)
  }

  useEffect(() => {
    if (props.errorSubmittingWrapWeth || props.errorSubmittingUnwrapWeth) {
      setModalSettings({ canDismiss: true, mobilePosition: ModalPosition.BOTTOM })
      setShouldProgress(false)
      return
    }

    // This is either cancelled or filled
    if (
      isWrapping &&
      !props.isWalletSigningTx &&
      !props.isMiningWrapWeth &&
      !props.isSubmittingWrapWeth &&
      !props.isWalletWrappingWeth
    ) {
      // Success, auto-close modal in 1 second
      setTimeout(async () => {
        await setModalOpen(false)
        setShouldProgress(true)
      }, 1000)
    }

    // This is either cancelled or filled
    if (
      isUnwrapping &&
      !props.isWalletSigningTx &&
      !props.isMiningUnwrapWeth &&
      !props.isSubmittingUnwrapWeth &&
      !props.isWalletUnwrappingWeth
    ) {
      // Success, auto-close modal in 1 second
      setTimeout(async () => {
        await setModalOpen(false)
        setShouldProgress(true)
      }, 1000)
    }
  }, [
    isWrapping,
    isUnwrapping,
    props.isWalletSigningTx,
    props.isMiningWrapWeth,
    props.isMiningUnwrapWeth,
    props.isSubmittingWrapWeth,
    props.isSubmittingUnwrapWeth,
    props.isWalletWrappingWeth,
    props.isWalletUnwrappingWeth,
    props.errorSubmittingWrapWeth,
    props.errorSubmittingUnwrapWeth,
  ])

  if (!isWrapping && !isUnwrapping) {
    return (
      <ModalContainer justify="center">
        <Close onClick={handleCloseClick}>
          <CloseIcon />
        </Close>
        <Flex>
          <IconContainer>
            <img src={CandyIconGif} />
          </IconContainer>
          <VerticalSpacer units={10} />
          <H4 weight={theme.text.fontWeight.semibold}>
            {props.isWrap ? (
              <FormattedMessage defaultMessage="Wrap your Ether" />
            ) : (
              <FormattedMessage defaultMessage="Unwrap your WETH" />
            )}
          </H4>
          <VerticalSpacer units={4} />
          <H6 weight={theme.text.fontWeight.light} style={{ maxWidth: '260px' }}>
            {props.isWrap ? (
              <FormattedMessage
                defaultMessage="To trade ETH, you must first wrap it as an ERC-20 token. You currently own {wethAmount} WETH so you will need to wrap {amount} to complete this transaction."
                values={{
                  amount: props.getDisplayByToken({ address: ETH_ADDRESS }, `${props.minimumWrapAmount}`),
                  wethAmount: props.getDisplayByToken(
                    { address: WETH_CONTRACT_ADDRESS },
                    props.atomicBalances[WETH_CONTRACT_ADDRESS],
                  ),
                }}
              />
            ) : (
              <FormattedMessage
                defaultMessage="You don't have enough Ether for this transaction. Would you like to unwrap {amount} of your WETH?"
                values={{ amount: props.getDisplayByToken({ address: ETH_ADDRESS }, `${props.minimumWrapAmount}`) }}
              />
            )}
          </H6>
          <VerticalSpacer units={6} />
          <Button variant={ButtonVariant.PRIMARY} onClick={props.isWrap ? startWrapFlow : startUnwrapFlow}>
            {props.isWrap ? <FormattedMessage defaultMessage="Wrap" /> : <FormattedMessage defaultMessage="Unwrap" />}
          </Button>
        </Flex>
      </ModalContainer>
    )
  }

  // Sign/Filling for Wrap
  if (props.isWrap && (props.isWalletWrappingWeth || props.isSubmittingWrapWeth || props.isMiningWrapWeth)) {
    return <ActionStatus gif={CandyIconGif} title="Wrap Ether" />
  }

  // Sign/Filling for Unwrap
  if (!props.isWrap && (props.isWalletUnwrappingWeth || props.errorSubmittingUnwrapWeth || props.isMiningUnwrapWeth)) {
    return <ActionStatus gif={CandyIconGif} title="Unwrap Weth" />
  }

  // Error
  if (props.errorSubmittingWrapWeth || props.errorSubmittingUnwrapWeth) {
    return (
      <ModalContainer justify="center">
        <Close onClick={handleCloseClick}>
          <CloseIcon />
        </Close>
        <IconContainer>
          <WalletConnectErrorIcon />
        </IconContainer>
        <VerticalSpacer units={10} />
        <Flex>
          <H3 weight={theme.text.fontWeight.semibold}>
            <FormattedMessage defaultMessage="Error" />
          </H3>
          <VerticalSpacer units={3} />
          <H6 weight={theme.text.fontWeight.light}>
            {`${props.errorSubmittingWrapWeth || props.errorSubmittingUnwrapWeth}`}
          </H6>
        </Flex>
      </ModalContainer>
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
        <H4 weight={700}>
          <FormattedMessage defaultMessage="Success!" />
        </H4>
      </Flex>
    </ModalContainer>
  )
}

export default Container(injectIntl(WethModal))
