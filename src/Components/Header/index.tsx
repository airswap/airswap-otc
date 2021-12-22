import React, { useContext, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'

import { FormSubmitContext } from '../../app/context/FormSubmitContext'
import { WalletContext } from '../../app/context/WalletContext'
import { WidgetContext } from '../../app/context/WidgetContext'
import { AIRSWAP_EXPLORER_URL } from '../../constants'
import { Flex } from '../../elements/Flex'
import MediaQuery from '../../elements/MediaQueryWrapper'
import { HorizontalSpacer } from '../../elements/Spacer'
import { H8 } from '../../elements/Typography'
import { ReactComponent as AirswapCondensedLogo } from '../../static/airswap-condensed-logo.svg'
import { ReactComponent as AirswapLogo } from '../../static/airswap-logo.svg'
import { ReactComponent as ExplorerIcon } from '../../static/explorer-icon.svg'
import { ReactComponent as InboxIcon } from '../../static/inbox-icon.svg'
import { ReactComponent as MoreHorizontalIcon } from '../../static/more-horizontal-icon.svg'
import { redirectWithParam } from '../../utils/helpers'
import Activity from './Activity'
import Container, { HeaderProps } from './Container'
import Menu from './Menu'
import NetworkSwitch from './NetworkSwitch'
import {
  DesktopHeaderContainer,
  DesktopHeaderContent,
  LogoContainer,
  MobileHeaderContainer,
  MobileNavIconContainer,
  NotificationCircle,
  SecondaryNavItem,
} from './styles'
import WalletConnectButton from './WalletConnectButton'

function Header(props: HeaderProps) {
  const [activityOpen, setActivityOpen] = useState<boolean>(false)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const ordersRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { isWidget } = useContext(WidgetContext)
  const { setShowWalletConnect } = useContext(WalletContext)
  const { setIsFormSubmitting, setShouldProgress } = useContext(FormSubmitContext)

  const toggleActivityDropdown = evt => {
    evt.preventDefault()

    setMenuOpen(false)
    setActivityOpen(!activityOpen)
    props.clearUnreadNotificationCount()
  }

  const toggleMenuDropdown = () => {
    setActivityOpen(false)
    setMenuOpen(!menuOpen)
  }

  const redirectToExplorer = () => {
    window.open(AIRSWAP_EXPLORER_URL)
  }

  const resetFlow = () => {
    // Reset Form Submit Context First
    setShouldProgress(false)
    setIsFormSubmitting(false)

    setShowWalletConnect(false)
    redirectWithParam(null, props.history)
  }

  return (
    <>
      <MediaQuery size="sm">
        <MobileHeaderContainer>
          <LogoContainer onClick={resetFlow}>
            <AirswapCondensedLogo width="24px" />
          </LogoContainer>
          <Flex direction="row" justify="flex-end">
            {!isWidget && (
              <>
                <MobileNavIconContainer onClick={toggleActivityDropdown}>
                  <InboxIcon />
                </MobileNavIconContainer>
                <MobileNavIconContainer onClick={redirectToExplorer}>
                  <ExplorerIcon />
                </MobileNavIconContainer>
                <MobileNavIconContainer onClick={toggleMenuDropdown}>
                  <MoreHorizontalIcon />
                </MobileNavIconContainer>
              </>
            )}
          </Flex>
          <Activity isOpen={activityOpen} setIsOpen={setActivityOpen} />
          <Menu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        </MobileHeaderContainer>
      </MediaQuery>
      <MediaQuery size="md-up">
        <DesktopHeaderContainer>
          <DesktopHeaderContent>
            <LogoContainer onClick={resetFlow}>
              <AirswapLogo width="120px" />
            </LogoContainer>

            <Flex direction="row" justify="flex-end">
              <WalletConnectButton
                connectedWalletAddress={props.connectedWalletAddress}
                clearWallet={props.clearWallet}
              />
              {!isWidget && (
                <>
                  <HorizontalSpacer units={6} />
                  <SecondaryNavItem onClick={toggleActivityDropdown}>
                    {props.unreadNoticationCount > 0 && (
                      <NotificationCircle>{props.unreadNoticationCount}</NotificationCircle>
                    )}
                    <H8 ref={ordersRef}>
                      <FormattedMessage defaultMessage="Activity" />
                    </H8>
                  </SecondaryNavItem>
                  <HorizontalSpacer units={6} />
                  <SecondaryNavItem onClick={redirectToExplorer}>
                    <H8 ref={ordersRef}>
                      <FormattedMessage defaultMessage="Explorer" />
                    </H8>
                  </SecondaryNavItem>
                  <HorizontalSpacer units={6} />
                  <SecondaryNavItem onClick={toggleMenuDropdown}>
                    <H8 ref={menuRef}>
                      <FormattedMessage defaultMessage="More" />
                    </H8>
                  </SecondaryNavItem>
                  <HorizontalSpacer units={6} />
                  <NetworkSwitch />
                  <Activity isOpen={activityOpen} setIsOpen={setActivityOpen} toggleRef={ordersRef} />
                  <Menu isOpen={menuOpen} setIsOpen={setMenuOpen} toggleRef={menuRef} />
                </>
              )}
            </Flex>
          </DesktopHeaderContent>
        </DesktopHeaderContainer>
      </MediaQuery>
    </>
  )
}

export default Container(withRouter(Header))
