import React, { useContext, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { ModalContext } from '../../../app/context/ModalContext'
import { WidgetContext } from '../../../app/context/WidgetContext'
import Button, { ButtonVariant } from '../../../elements/Button'
import { Flex } from '../../../elements/Flex'
import { VerticalSpacer } from '../../../elements/Spacer'
import { H3, H6 } from '../../../elements/Typography'
import DSProtocolPreTransferCheckMessages from '../../../resource/dsProtocolPreTransferCheckMessages.json'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { ReactComponent as WarningIcon } from '../../../static/warning-icon.svg'
import theme from '../../../theme'
import Container, { PreTransferCheckProps } from './Container'

const Close = styled(Flex)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
`

const ContentContainer = styled(Flex).attrs({ justify: 'space-between' })`
  padding: 50px;
  width: 400px;
  height: 400px;

  @media (max-width: ${`${theme.breakpoints.sm[1]}px`}) {
    width: 100%;
    height: auto;
  }
`

function PreTransferCheck(props: PreTransferCheckProps) {
  const { setModalOpen } = useContext(ModalContext)
  const { widgetParams } = useContext(WidgetContext)

  const closeModal = () => {
    setModalOpen(false)
  }

  const preTransferCheckError = useMemo(() => {
    const makerToken = props.tokensByAddress[props.order.makerToken]
    const message = DSProtocolPreTransferCheckMessages[props.code]

    if (message) {
      if (makerToken.security && props.connectedWalletAddress === props.order.makerWallet) {
        return message.maker
      }
      return message.taker
    }

    return { message: `Pre-Transfer Check has failed with reason: ${props.reason}` }
  }, [props.connectedWalletAddress, props.code, JSON.stringify(props.order)])

  const actionUrl = useMemo(() => {
    const makerToken = props.tokensByAddress[props.order.makerToken]
    const error = widgetParams.preTransferCheckErrors && widgetParams.preTransferCheckErrors[props.code]

    if (error) {
      if (makerToken.security && props.connectedWalletAddress === props.order.makerWallet) {
        return error.maker.redirectURL
      }
      return error.taker.redirectURL
    }

    return null
  }, [props.connectedWalletAddress, props.code, JSON.stringify(props.order), widgetParams.preTransferCheckErrors])

  const onActionClick = () => {
    if (actionUrl || (preTransferCheckError.actionUrl && preTransferCheckError.actionUrl.length)) {
      window.open(
        `${actionUrl || preTransferCheckError.actionUrl}?errorCode=${props.code}&expiry=${
          props.order.expiry
        }&makerToken=${props.order.makerToken}&makerAmount=${props.order.makerAmount}&takerToken=${
          props.order.takerToken
        }&takerAmount=${props.order.takerAmount}`,
      )
    } else {
      closeModal()
    }
  }

  return (
    <ContentContainer>
      <Close onClick={closeModal}>
        <CloseIcon />
      </Close>
      <WarningIcon />
      <VerticalSpacer units={4} />
      <H3 weight={theme.text.fontWeight.medium}>
        <FormattedMessage defaultMessage="Pre-Transfer Check Failed" />
      </H3>
      <VerticalSpacer units={4} />
      <H6 weight={theme.text.fontWeight.light}>{preTransferCheckError.message}</H6>
      <VerticalSpacer units={10} />
      <Button variant={ButtonVariant.PRIMARY} onClick={onActionClick}>
        {actionUrl ||
        (preTransferCheckError && preTransferCheckError.actionUrl && preTransferCheckError.actionUrl.length) ? (
          preTransferCheckError.actionText || <FormattedMessage defaultMessage="Redirect" />
        ) : (
          <FormattedMessage defaultMessage="Close" />
        )}
      </Button>
    </ContentContainer>
  )
}

export default Container(PreTransferCheck)
