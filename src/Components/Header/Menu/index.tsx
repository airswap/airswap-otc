import React, { useEffect, useRef } from 'react'
import { FormattedMessage } from 'react-intl'

import { SMART_CONTRACT_AUDIT_URL } from '../../../constants'
import Button, { ButtonVariant } from '../../../elements/Button'
import { Flex } from '../../../elements/Flex'
import MediaQuery from '../../../elements/MediaQueryWrapper'
import { HorizontalSpacer, VerticalSpacer } from '../../../elements/Spacer'
import { H7 } from '../../../elements/Typography'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { ReactComponent as InstantIcon } from '../../../static/instant-icon.svg'
import { ReactComponent as TrustIcon } from '../../../static/trust-icon.svg'
import theme from '../../../theme'
import { condenseAddress } from '../../../utils/transformations'
import { useDebouncedCallback } from '../../../utils/useDebounce'
import Container, { MenuProps } from './Container'
import MenuItem from './MenuItem'
import {
  Close,
  DesktopMenu,
  GreenCircle,
  IconContainer,
  MenuContainer,
  MobileMenu,
  WalletDetailsContainer,
} from './styles'

declare let window: any

function Menu(props: MenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const desktopRef = useRef<HTMLDivElement>(null)

  const closeDropdown = () => {
    props.setIsOpen(false)
  }
  const openUrl = (url: string) => {
    closeDropdown()
    window.open(url)
  }

  // Menu Positioning
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

  // Dismiss on click outside
  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (
        containerRef.current &&
        evt.target instanceof HTMLDivElement &&
        desktopRef.current &&
        !desktopRef.current.contains(evt.target)
      ) {
        closeDropdown()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [containerRef, props.isOpen])

  // Toggle Menu display
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

  const disconnectWallet = () => {
    props.clearWallet()
    props.setIsOpen(false)
  }

  return (
    <MenuContainer ref={containerRef} isOpen={props.isOpen}>
      <MediaQuery size="sm">
        <MobileMenu>
          <Close onClick={closeDropdown}>
            <CloseIcon />
          </Close>
          <Flex expand>
            <MenuItem
              stroke={0.7}
              icon={InstantIcon}
              title="Instantly Buy/Sell Tokens"
              onClick={() => openUrl('https://www.airswap.io/')}
            />
          </Flex>
        </MobileMenu>
      </MediaQuery>
      <MediaQuery size="md-up">
        <DesktopMenu ref={desktopRef}>
          {props.connectedWalletAddress && (
            <WalletDetailsContainer>
              <Flex direction="row">
                <IconContainer>
                  <GreenCircle />
                </IconContainer>
                {condenseAddress(props.connectedWalletAddress, true, false, 'bottom-right', true)}
              </Flex>
              <VerticalSpacer units={2} />
              <Flex direction="row">
                <HorizontalSpacer units={8} />
                <Button variant={ButtonVariant.LINK} onClick={disconnectWallet}>
                  <H7 color={theme.palette.errorColor} decoration="underline">
                    <FormattedMessage defaultMessage="Disconnect" />
                  </H7>
                </Button>
              </Flex>
            </WalletDetailsContainer>
          )}
          <MenuItem
            stroke={0.7}
            icon={InstantIcon}
            title="Instantly Buy/Sell Tokens"
            onClick={() => openUrl('https://www.airswap.io/')}
          />
          <MenuItem
            stroke={1}
            icon={TrustIcon}
            title="Smart Contract Audit"
            onClick={() => openUrl(SMART_CONTRACT_AUDIT_URL)}
          />
        </DesktopMenu>
      </MediaQuery>
    </MenuContainer>
  )
}

export default Container(Menu)
