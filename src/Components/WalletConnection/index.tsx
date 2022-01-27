import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { FormSubmitContext } from '../../app/context/FormSubmitContext'
import { ModalContext, ModalPosition } from '../../app/context/ModalContext'
import { WalletContext } from '../../app/context/WalletContext'
import { WidgetContext } from '../../app/context/WidgetContext'
import { WALLET_LEARN_MORE_LINKS } from '../../constants'
import Carousel from '../../elements/Carousel'
import { HorizontalSpacer } from '../../elements/Spacer'
import { H7 } from '../../elements/Typography'
import { ReactComponent as ArrowLeftIcon } from '../../static/arrow-left-icon.svg'
import { ReactComponent as CoinbaseLogo } from '../../static/coinbase-logo.svg'
import { ReactComponent as EqualLogo } from '../../static/equal-logo.svg'
import { ReactComponent as LedgerMetamaskLogo } from '../../static/ledger-metamask-logo.svg'
import { ReactComponent as MetaMaskLogo } from '../../static/metamask-logo.svg'
import { ReactComponent as PortisLogo } from '../../static/portis-logo.svg'
import { ReactComponent as TrezorMetamaskLogo } from '../../static/trezor-metamask-logo.svg'
import { isMobile } from '../../utils/helpers'
import ConnectHDW, { HDWType } from '../ModalContent/ConnectHDW'
import WalletConnectionStatus from '../ModalContent/WalletConnectionStatus'
import Container, { WalletContainerProps } from './Container'
import { Back, CarouselContainer, ModalHeader, WalletConnectionContainer, WalletRow } from './styles'
import WalletItem from './WalletItem'

function WalletConnection(props: WalletContainerProps) {
  const { setModalOpen, setModalContent, setModalSettings } = useContext(ModalContext)
  const { isWidget, widgetParams } = useContext(WidgetContext)
  const { setIsFormSubmitting } = useContext(FormSubmitContext)
  const { setShowWalletConnect } = useContext(WalletContext)
  const [scrollIndex, setScrollIndex] = useState<number>(0)

  const showWalletConnectionModal = () => {
    setModalContent(<WalletConnectionStatus />)
    setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
    setModalOpen(true)
  }

  const initMetamask = () => {
    props.initMetamask()
    showWalletConnectionModal()
  }

  const initWalletLink = () => {
    if (isWidget && widgetParams.metadataConfig) {
      props.initWalletLink({
        walletAppLogo: widgetParams.metadataConfig.faviconUrl,
        walletAppName: widgetParams.metadataConfig.title,
      })
    } else {
      props.initWalletLink({})
    }
    showWalletConnectionModal()
  }

  const initEqual = () => {
    props.initEqual()
    showWalletConnectionModal()
  }

  const initPortis = () => {
    props.initPortis()
    showWalletConnectionModal()
  }

  const initLedger = () => {
    setModalContent(<ConnectHDW hdwType={HDWType.Ledger} />)
    setModalSettings({ mobilePosition: ModalPosition.FULL_SCREEN })
    setModalOpen(true)
  }

  const initTrezor = () => {
    setModalContent(<ConnectHDW hdwType={HDWType.Trezor} />)
    setModalSettings({ mobilePosition: ModalPosition.FULL_SCREEN })
    setModalOpen(true)
  }

  const close = () => {
    setShowWalletConnect(false)
    setIsFormSubmitting(false)
  }

  useEffect(() => {
    if (isMobile() && props.initMobileWallet) {
      props.initMobileWallet()
      showWalletConnectionModal()
    }
  }, [props.initMobileWallet])

  if (isMobile()) return null

  const carouselSettings = {
    className: 'wallet-carousel',
    dots: false,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 1,
  }

  const widgetPrimaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.primaryColor
    : undefined

  return (
    <WalletConnectionContainer backgroundColor={widgetPrimaryColor}>
      <Back onClick={close}>
        <ArrowLeftIcon width="20" />
        <HorizontalSpacer units={2} />
        <H7 color="white" fit>
          <FormattedMessage defaultMessage="Back" />
        </H7>
      </Back>

      <ModalHeader>
        <FormattedMessage defaultMessage="Select Your Wallet" />
      </ModalHeader>

      <WalletRow expand direction="row" justify="space-around">
        <CarouselContainer>
          <Carousel settings={carouselSettings} beforeChange={setScrollIndex}>
            <WalletItem
              textColor={widgetPrimaryColor}
              name="MetaMask"
              description="MetaMask is a bridge that allows you to visit the distributed web of tomorrow in your browser today."
              dataTest="connect-metamask-btn"
              icon={MetaMaskLogo}
              faqUrl={WALLET_LEARN_MORE_LINKS.METAMASK}
              onConnect={initMetamask}
            />
            <WalletItem
              textColor={widgetPrimaryColor}
              name="Coinbase Wallet"
              description="WalletLink by Coinbase establishes a secure bridge between your Coinbase Wallet and desktop browser. To connect, all you need to do is scan the QR code with your Coinbase Wallet app."
              icon={CoinbaseLogo}
              faqUrl={WALLET_LEARN_MORE_LINKS.WALLETLINK}
              onConnect={initWalletLink}
            />
            <WalletItem
              textColor={widgetPrimaryColor}
              isHDW
              name="Ledger"
              description="Connect your Ledger device through Metamask. Ledger hardware wallets are a series of multi-currency wallets that are used to store private keys for cryptocurrencies offline."
              icon={LedgerMetamaskLogo}
              faqUrl={WALLET_LEARN_MORE_LINKS.LEDGER}
              onConnect={initLedger}
            />
            <WalletItem
              textColor={widgetPrimaryColor}
              noBorder={scrollIndex === 0}
              isHDW
              name="Trezor"
              description="Connect your Trezor device through Metamask. A Trezor device is a single purpose computer which allows you to secure your cryptocurrencies, sign transactions, and manage your digital identity."
              icon={TrezorMetamaskLogo}
              faqUrl={WALLET_LEARN_MORE_LINKS.LEDGER}
              onConnect={initTrezor}
            />
            <WalletItem
              textColor={widgetPrimaryColor}
              noBorder={scrollIndex === 2}
              name="Portis"
              description="Portis is a web-based, Ethereum and ERC20 token wallet that makes it possible to access your wallet from anywhere without any additional installations."
              icon={PortisLogo}
              faqUrl={WALLET_LEARN_MORE_LINKS.PORTIS}
              onConnect={initPortis}
            />
            <WalletItem
              textColor={widgetPrimaryColor}
              noBorder
              name="Equal"
              description="EQL is a simple cryptocurrency wallet enabling you to send, store and receive any ERC20 token."
              icon={EqualLogo}
              faqUrl={WALLET_LEARN_MORE_LINKS.EQUAL}
              onConnect={initEqual}
            />
          </Carousel>
        </CarouselContainer>
      </WalletRow>
    </WalletConnectionContainer>
  )
}

export default Container(WalletConnection)
