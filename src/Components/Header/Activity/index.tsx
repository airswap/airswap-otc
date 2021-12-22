import { openEtherscanLink } from 'airswap.js/src/utils/etherscan'
import { distanceInWords } from 'date-fns'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { WalletContext } from '../../../app/context/WalletContext'
import { Flex, FlexItem } from '../../../elements/Flex'
import MediaQuery from '../../../elements/MediaQueryWrapper'
import { VerticalSpacer } from '../../../elements/Spacer'
import { H4, H7 } from '../../../elements/Typography'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { ReactComponent as ConnectingIcon } from '../../../static/connecting-logo.svg'
import { ReactComponent as FriendshipIcon } from '../../../static/friendship-icon.svg'
import theme from '../../../theme'
import { getFormattedTokenDisplay } from '../../../utils/transformations'
import { useDebouncedCallback } from '../../../utils/useDebounce'
import Container, { Props } from './Container'
import OutstandingItem from './OutstandingItem'
import {
  Close,
  ConnectingIconContainer,
  ConnectText,
  DesktopDropdown,
  EtherscanLink,
  FinalizedItemContainer,
  MobileDropdown,
  OpenDropdown,
  TabCell,
  TabContainer,
} from './styles'

function getStatusColor(status: 'Confirmed' | 'Cancelled' | 'Pending' | 'Failed') {
  switch (status) {
    case 'Confirmed':
      return '#4BC68B'
    case 'Failed':
      return '#FF4601'
    default:
      return 'rgba(0, 0, 0, 0.5)'
  }
}

function Activity(props: Props) {
  const { startWalletConnect } = useContext(WalletContext)
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const desktopRef = useRef<HTMLDivElement>(null)

  const TransactionActivity = ({ description, txStatus, txHash, timestamp }) => {
    if (!txHash) return null

    return (
      <FinalizedItemContainer expand justify="space-between">
        <Flex expand direction="row" justify="space-between">
          <H7 textAlign="left" color={getStatusColor(txStatus)} weight={theme.text.fontWeight.medium}>
            {txStatus}
          </H7>
          {timestamp && (
            <H7 textAlign="right" color="rgba(0, 0, 0, 0.25)">
              {`${distanceInWords(timestamp * 1000, Date.now())} ago`}
            </H7>
          )}
        </Flex>
        <Flex expand direction="row" justify="space-between">
          {description}
          <FlexItem flex={1}>
            <EtherscanLink textAlign="right" onClick={() => openEtherscanLink(txHash, 'tx')}>
              <FormattedMessage defaultMessage="Etherscan" />
            </EtherscanLink>
          </FlexItem>
        </Flex>
      </FinalizedItemContainer>
    )
  }

  const FinalizedItem = ({
    makerSymbol,
    makerAmount,
    makerKind,
    makerId,
    takerSymbol,
    takerAmount,
    takerKind,
    takerId,
    txHash,
    timestamp,
    txStatus,
  }) => {
    return (
      <FinalizedItemContainer expand justify="space-between">
        <Flex expand direction="row" justify="space-between">
          <H7 textAlign="left" color={getStatusColor(txStatus)} weight={theme.text.fontWeight.medium}>
            {txStatus}
          </H7>
          {timestamp && (
            <H7 textAlign="right" color="rgba(0, 0, 0, 0.25)">
              {`${distanceInWords(timestamp * 1000, Date.now())} ago`}
            </H7>
          )}
        </Flex>
        <Flex expand direction="row" justify="space-between">
          <H7 textAlign="left" weight={theme.text.fontWeight.medium}>
            {`${getFormattedTokenDisplay({
              amount: makerAmount ? makerAmount.toLocaleString() : 0,
              id: makerId,
              symbol: makerSymbol,
              kind: makerKind,
            })}  →  ${getFormattedTokenDisplay({
              amount: takerAmount ? takerAmount.toLocaleString() : 0,
              id: takerId,
              symbol: takerSymbol,
              kind: takerKind,
            })}`}
          </H7>
          <FlexItem flex={1}>
            <EtherscanLink textAlign="right" onClick={() => openEtherscanLink(txHash, 'tx')}>
              <FormattedMessage defaultMessage="Etherscan" />
            </EtherscanLink>
          </FlexItem>
        </Flex>
      </FinalizedItemContainer>
    )
  }

  const renderConnectToView = () => (
    <Flex style={{ height: '100%' }} justify="center">
      <Flex justify="center">
        <ConnectingIconContainer>
          <ConnectingIcon />
        </ConnectingIconContainer>
        <ConnectText
          onClick={() => {
            startWalletConnect()
            props.setIsOpen(false)
          }}
        >
          <FormattedMessage defaultMessage="Connect to view" />
        </ConnectText>
      </Flex>
    </Flex>
  )

  const renderNoOrders = () =>
    props.connectedWalletAddress ? (
      <Flex style={{ height: '100%' }} justify="center">
        <Flex justify="center">
          <FriendshipIcon />
          <VerticalSpacer units={3} />
          <H4 color="rgba(0, 0, 0, 0.25)">
            <FormattedMessage defaultMessage="No orders" />
          </H4>
        </Flex>
      </Flex>
    ) : (
      renderConnectToView()
    )

  const renderNoTransactions = () =>
    props.connectedWalletAddress ? (
      <Flex style={{ height: '100%' }} justify="center">
        <Flex justify="center">
          <ConnectingIcon />
          <VerticalSpacer units={3} />
          <H4 color="rgba(0, 0, 0, 0.25)">
            <FormattedMessage defaultMessage="No transactions " />
          </H4>
        </Flex>
      </Flex>
    ) : (
      renderConnectToView()
    )

  const MakerOrders = () => (
    <>
      {(props.makerOrders && props.makerOrders.finalizedItems.length) ||
      (props.makerOrders && props.makerOrders.outstandingItems.length) ? (
        <>
          {props.makerOrders.outstandingItems.map(p => (
            <OutstandingItem
              key={p.orderCID}
              setIsOpen={props.setIsOpen}
              hideOutstandingMakerOrder={props.hideOutstandingMakerOrder}
              {...p}
            />
          ))}
          {props.makerOrders.finalizedItems.map(p => (
            <FinalizedItem key={p.nonce} {...p} />
          ))}
        </>
      ) : (
        renderNoOrders()
      )}
    </>
  )

  const Transactions = () => (
    <>
      {props.transactionActivity.length > 0 ? (
        <>
          {props.transactionActivity.map(p => (
            <TransactionActivity key={p.txHash} {...p} />
          ))}
        </>
      ) : (
        renderNoTransactions()
      )}
    </>
  )

  const closeDropdown = () => {
    props.setIsOpen(false)
  }

  const renderTabs = () => (
    <TabContainer justify="center" direction="row" expand>
      <TabCell
        connectedWalletAddress={props.connectedWalletAddress}
        onClick={() => (props.connectedWalletAddress ? setSelectedTab(0) : null)}
        justify="center"
        isSelected={selectedTab === 0}
      >
        <H7
          color={selectedTab === 0 && props.connectedWalletAddress ? 'black' : 'rgba(0, 0, 0, 0.10)'}
          weight={theme.text.fontWeight.medium}
        >
          <FormattedMessage defaultMessage="Orders" />
        </H7>
      </TabCell>
      <TabCell
        connectedWalletAddress={props.connectedWalletAddress}
        onClick={() => (props.connectedWalletAddress ? setSelectedTab(1) : null)}
        justify="center"
        isSelected={selectedTab === 1}
      >
        <H7
          color={selectedTab === 1 && props.connectedWalletAddress ? 'black' : 'rgba(0, 0, 0, 0.10)'}
          weight={theme.text.fontWeight.medium}
        >
          <FormattedMessage defaultMessage="Transactions" />
        </H7>
      </TabCell>
    </TabContainer>
  )

  // Dropdown Positioning
  const setPosition = useDebouncedCallback(() => {
    if (props.toggleRef && props.toggleRef.current && desktopRef && desktopRef.current) {
      desktopRef.current.style.right = `${window.innerWidth - props.toggleRef.current.getBoundingClientRect().right}px`
      desktopRef.current.style.top = `${props.toggleRef.current.getBoundingClientRect().top +
        props.toggleRef.current.getBoundingClientRect().height +
        10}px`
    }
  })

  useEffect(() => {
    setPosition()
    window.addEventListener('resize', setPosition)
    window.addEventListener('scroll', setPosition)

    return () => {
      window.removeEventListener('resize', setPosition)
      window.removeEventListener('scroll', setPosition)
    }
  }, [props.toggleRef, desktopRef])

  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (
        containerRef.current &&
        evt.target instanceof HTMLDivElement &&
        desktopRef.current &&
        !desktopRef.current.contains(evt.target)
      ) {
        props.setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [containerRef, props.isOpen])

  useEffect(() => {
    if (props.isOpen && containerRef.current) {
      containerRef.current.style.display = 'flex'
    } else {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.display = 'none'
        }
      }, theme.animation.defaultTransition * 1000)
    }
  }, [props.isOpen])

  return (
    <OpenDropdown ref={containerRef} isOpen={props.isOpen}>
      <MediaQuery size="sm">
        <MobileDropdown>
          <Close onClick={closeDropdown}>
            <CloseIcon />
          </Close>
          <Flex expand style={{ marginTop: '20px' }}>
            {renderTabs()}
          </Flex>
          <Flex style={{ height: '100%' }} expand>
            {selectedTab === 0 ? MakerOrders() : Transactions()}
          </Flex>
        </MobileDropdown>
      </MediaQuery>
      <MediaQuery size="md-up">
        <DesktopDropdown ref={desktopRef}>
          {renderTabs()}
          {selectedTab === 0 ? MakerOrders() : Transactions()}
        </DesktopDropdown>
      </MediaQuery>
    </OpenDropdown>
  )
}

export default Container(Activity)
