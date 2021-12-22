import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { WalletContext } from '../../app/context/WalletContext'
import { Flex } from '../../elements/Flex'
import { HorizontalSpacer } from '../../elements/Spacer'
import { H8 } from '../../elements/Typography'
import theme from '../../theme'
import { condenseAddress } from '../../utils/transformations'
import { PrimaryNavItem, WhitePrimaryNavItem } from './styles'

export const ConnectedDot = styled(Flex)`
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  content: '';
  background-color: ${theme.palette.successColor};
`

interface WalletConnectButtonProps {
  white?: boolean
  connectedWalletAddress: string
  clearWallet(): void
}

export default function WalletConnectButton(props: WalletConnectButtonProps) {
  const [showDisconnect, setShowDisconnect] = useState<boolean>(false)

  const { startWalletConnect } = useContext(WalletContext)

  useEffect(() => {
    setShowDisconnect(false)
  }, [props.connectedWalletAddress])

  const NavItemEl = props.white ? WhitePrimaryNavItem : PrimaryNavItem

  if (props.connectedWalletAddress) {
    return (
      <NavItemEl
        data-test="disconnect-wallet-btn"
        onClick={props.clearWallet}
        isConnected
        isDisconnect={showDisconnect}
        onMouseEnter={() => setShowDisconnect(true)}
        onMouseLeave={() => setShowDisconnect(false)}
      >
        {showDisconnect ? (
          <H8 weight={theme.text.fontWeight.medium}>
            <FormattedMessage defaultMessage="Disconnect" />
          </H8>
        ) : (
          <Flex justify="space-between" align="center" direction="row">
            <ConnectedDot />
            <HorizontalSpacer units={2} />
            <H8>{condenseAddress(props.connectedWalletAddress)}</H8>
          </Flex>
        )}
      </NavItemEl>
    )
  }

  return (
    <NavItemEl onClick={startWalletConnect} data-test="show-connect-wallet-btn">
      <H8 weight={theme.text.fontWeight.medium}>
        <FormattedMessage defaultMessage="Connect" />
      </H8>
    </NavItemEl>
  )
}
