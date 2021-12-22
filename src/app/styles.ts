import styled from 'styled-components'

import { Flex } from '../elements/Flex'

interface AppContainerProps {
  isWidget: boolean
}

export const AppContainer = styled(Flex).attrs({
  expand: true,
})<AppContainerProps>`
  background-color: ${({ isWidget }) => (isWidget ? 'rgba(255, 255, 255, 0.85)' : 'white')};
  z-index: 2147483646; /* max z-index so that app shows on top of everything as a widget */
`

export const AppContentContainer = styled(Flex)`
  width: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px 60px 100px 60px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    padding: 0 10px 10px 10px;
    height: auto;
  }
`

interface AppContentProps {
  isWidget?: boolean
}

export const AppContent = styled(Flex)<AppContentProps>`
  max-width: ${({ theme }) => theme.fixed.maxWidth};
  width: 100%;
  height: 620px;
  position: relative;
  border-radius: 20px;
  z-index: 0;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    height: ${({ isWidget }) => (isWidget ? '100%' : 'auto')};
    box-shadow: 0px 50px 20px 0px rgba(0, 0, 0, 0.1);
  }
`

export const WidgetContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
})`
  height: 100vh;
  width: 100%;
  min-height: 600px;
  padding: 10px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    height: auto;
    min-height: 100vh;
  }
`

interface WalletVisibleProps {
  walletVisible: boolean
  isWidget?: boolean
}

export const FlowContent = styled(Flex)<WalletVisibleProps>`
  position: absolute;
  height: ${({ isWidget }) => (isWidget ? 'auto' : '100%')};
  width: 100%;
  left: ${({ walletVisible }) => (walletVisible ? '-100vw' : '0')};
  will-change: left;
  transition: 0.5s ease;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    left: auto;
    position: relative;
  }
`

export const WalletCardContainer = styled(Flex)<WalletVisibleProps>`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
  left: ${({ walletVisible }) => (walletVisible ? '0' : '100vw')};
  will-change: left;
  transition: 0.5s ease;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    left: auto;
  }
`
