import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps, withRouter } from 'react-router'
import styled from 'styled-components'

import { ModalContext, ModalPosition } from '../../../app/context/ModalContext'
import { Flex } from '../../../elements/Flex'
import { HorizontalSpacer } from '../../../elements/Spacer'
import { H6, H7 } from '../../../elements/Typography'
import { ReactComponent as CopyIcon } from '../../../static/copy-icon.svg'
import theme from '../../../theme'
import { SignedSimpleSwapOrderType } from '../../../types/models/Orders'
import { getShareUrl, redirectWithCID } from '../../../utils/helpers'
import { formatExpirationFromDate } from '../../../utils/numbers'
import { copyToClipboard, getFormattedTokenDisplay } from '../../../utils/transformations'
import useInterval from '../../../utils/useInterval'
import CancellationStatus from '../../ModalContent/CancellationStatus'
import { OutstandingActivityItem } from './Container'

const OutstandingLinkContainer = styled(Flex)`
  position: relative;
  height: 25px;
  border-radius: 5px;
  padding: 8px;
  cursor: pointer;
  background-color: rgba(43, 113, 255, 0.1);
`

const OutstandingItemContainer = styled(Flex)`
  min-height: 120px;
  padding: 20px;
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  svg {
    path,
    rect {
      stroke: ${theme.palette.primaryColor};
    }
  }
`

// Click to Copy
interface TooltipContainerProps {
  showCopiedTooltip: boolean
}

const TooltipContainer = styled(Flex)<TooltipContainerProps>`
  position: absolute;
  left: 50%;
  top: -100%;
  transform: translateX(-50%);
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  opacity: ${({ showCopiedTooltip }) => (showCopiedTooltip ? '1' : '0')};
  z-index: ${({ showCopiedTooltip }) => (showCopiedTooltip ? 1 : -1)};
  will-change: opacity;
  transition: ${theme.animation.defaultTransition}s;
  cursor: default;
`

const TooltipText = styled(H7)`
  color: white;
`

interface OutstandingExpirationProps {
  isExpired: boolean
}

const OutstandingExpiration = styled(H7)<OutstandingExpirationProps>`
  font-weight: ${theme.text.fontWeight.medium};
  color: ${({ isExpired }) => (isExpired ? 'rgba(0, 0, 0, 0.5)' : theme.palette.primaryColor)};
`

export const CancelButton = styled(H7)`
  width: auto;
  color: rgba(0, 0, 0, 0.5);
  text-decoration: underline;
  text-decoration-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
`

const LinkContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
})`
  height: 25px;
  max-width: 200px;
  overflow: hidden;
`

const OrderDetails = styled(Flex)`
  cursor: pointer;
`

interface OutstandingItemProps extends RouteComponentProps, OutstandingActivityItem {
  hideOutstandingMakerOrder(order: SignedSimpleSwapOrderType): void
  setIsOpen(value: boolean): void
}

function OutstandingItem(props: OutstandingItemProps) {
  const [expirationString, setExpirationString] = useState<string>(formatExpirationFromDate(props.expiry))
  const [showCopiedTooltip, setShowCopiedTooltip] = useState<boolean>(false)

  const { setModalOpen, setModalContent, setModalSettings } = useContext(ModalContext)

  const isExpired = Date.now() > props.signedOrder.expiry * 1000

  const showCancellationModal = () => {
    setModalContent(<CancellationStatus signedOrder={props.signedOrder} orderCID={props.orderCID} />)
    setModalSettings({ mobilePosition: ModalPosition.BOTTOM, canDismiss: true })
    setModalOpen(true)
    props.setIsOpen(false)
  }

  const handleCopyClick = () => {
    const url = getShareUrl(props.orderCID)
    if (copyToClipboard(url)) {
      setShowCopiedTooltip(true)
      setTimeout(() => {
        setShowCopiedTooltip(false)
      }, 2000)
    }
  }

  const navigateToOrder = () => {
    redirectWithCID(props.orderCID)
    props.setIsOpen(false)
  }

  useEffect(() => {
    if (props.signedOrder && props.signedOrder.expiry) {
      setExpirationString(formatExpirationFromDate(props.signedOrder.expiry))
    }
  }, [JSON.stringify(props.signedOrder)])

  useInterval(() => {
    if (props.signedOrder && props.signedOrder.expiry) {
      setExpirationString(formatExpirationFromDate(props.signedOrder.expiry))
    }
  }, 1000)

  return (
    <OutstandingItemContainer expand justify="space-between">
      <Flex expand direction="row">
        <OutstandingExpiration textAlign="left" isExpired={expirationString === 'Expired'}>
          {expirationString}
        </OutstandingExpiration>
      </Flex>
      <Flex expand justify="space-between" direction="row">
        <OrderDetails onClick={navigateToOrder}>
          <H6 textAlign="left" weight={theme.text.fontWeight.medium}>
            {`${getFormattedTokenDisplay({
              amount: props.makerAmount ? props.makerAmount.toLocaleString() : 0,
              id: props.makerId,
              symbol: props.makerSymbol,
              kind: props.makerTokenKind,
            })}  →  ${getFormattedTokenDisplay({
              amount: props.takerAmount ? props.takerAmount.toLocaleString() : 0,
              id: props.takerId,
              symbol: props.takerSymbol,
              kind: props.takerTokenKind,
            })}`}
          </H6>
        </OrderDetails>
        {isExpired ? (
          <CancelButton onClick={() => props.hideOutstandingMakerOrder(props.signedOrder)} textAlign="right">
            <FormattedMessage defaultMessage="Remove" />
          </CancelButton>
        ) : (
          <CancelButton onClick={showCancellationModal} textAlign="right">
            <FormattedMessage defaultMessage="Cancel" />
          </CancelButton>
        )}
      </Flex>
      <Flex expand direction="row">
        <OutstandingLinkContainer direction="row">
          <TooltipContainer showCopiedTooltip={showCopiedTooltip}>
            <TooltipText>
              <FormattedMessage defaultMessage="Copied!" />
            </TooltipText>
          </TooltipContainer>
          <Flex onClick={handleCopyClick} direction="row">
            <CopyIcon width="15px" height="15px" />
            <HorizontalSpacer units={1} />
            <LinkContainer>
              <H7>{encodeURI(`${window.location.origin}#cid=${props.orderCID}`)}</H7>
            </LinkContainer>
          </Flex>
        </OutstandingLinkContainer>
      </Flex>
    </OutstandingItemContainer>
  )
}

export default withRouter(OutstandingItem)
