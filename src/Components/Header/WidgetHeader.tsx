import React, { useContext } from 'react'
import styled from 'styled-components'

import { WidgetContext } from '../../app/context/WidgetContext'
import { Flex } from '../../elements/Flex'
import MediaQuery from '../../elements/MediaQueryWrapper'
import { HorizontalSpacer } from '../../elements/Spacer'
import { ReactComponent as AirswapCondensedLogo } from '../../static/airswap-condensed-logo.svg'
import { ReactComponent as AirswapLogo } from '../../static/airswap-logo.svg'
import { ReactComponent as CloseIcon } from '../../static/close-icon.svg'
import Container, { HeaderProps } from './Container'
import WalletConnectButton from './WalletConnectButton'

const AirswapLogoContainer = styled(Flex)`
  opacity: 0.75;

  svg {
    path {
      fill: white;
      stroke: none;
    }
  }
`

const WidgetHeaderContainer = styled(Flex).attrs({
  direction: 'row',
  justify: 'space-between',
  align: 'center',
})`
  padding: 25px 25px 0 25px;
  z-index: 1;
  position: absolute;
  width: 100%;
`

interface WidgetCloseProps {
  color?: string
}

const WidgetClose = styled(Flex)<WidgetCloseProps>`
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px;
  transition: ${({ theme }) => theme.animation.defaultTransition}s;

  svg {
    path {
      transition: ${({ theme }) => theme.animation.defaultTransition}s;
      stroke: white;
    }
  }

  &:hover {
    background-color: white;
    cursor: pointer;

    svg {
      path {
        stroke: ${({ color, theme }) => color || theme.palette.primaryColor};
      }
    }
  }
`

const WidgetLogo = styled.img`
  width: 120px;
  height: 35px;
  object-fit: contain;
`

function WidgetHeader(props: HeaderProps) {
  const { isWidget, widgetParams } = useContext(WidgetContext)

  const widgetSecondaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.secondaryColor
    : undefined

  return (
    <WidgetHeaderContainer>
      <AirswapLogoContainer>
        <MediaQuery size="sm">
          {isWidget &&
          widgetParams &&
          widgetParams.widgetConfig &&
          (widgetParams.widgetConfig.condensedLogoUrl || widgetParams.widgetConfig.logoUrl) ? (
            <WidgetLogo src={widgetParams.widgetConfig.condensedLogoUrl || widgetParams.widgetConfig.logoUrl} />
          ) : (
            <AirswapCondensedLogo width="24px" />
          )}
        </MediaQuery>
        <MediaQuery size="md-up">
          {isWidget && widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.logoUrl ? (
            <WidgetLogo src={widgetParams.widgetConfig.logoUrl} />
          ) : (
            <AirswapLogo width="120px" />
          )}
        </MediaQuery>
      </AirswapLogoContainer>
      <Flex direction="row">
        <MediaQuery size="md-up">
          <WalletConnectButton
            white
            connectedWalletAddress={props.connectedWalletAddress}
            clearWallet={props.clearWallet}
          />
          {widgetParams.canDismiss && <HorizontalSpacer units={5} />}
        </MediaQuery>
        {widgetParams.canDismiss && (
          <WidgetClose onClick={props.closeWidget} color={widgetSecondaryColor}>
            <CloseIcon />
          </WidgetClose>
        )}
      </Flex>
    </WidgetHeaderContainer>
  )
}

export default Container(WidgetHeader)
