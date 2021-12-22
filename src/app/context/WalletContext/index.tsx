import React, { useContext, useState } from 'react'

import WalletConnectionStatus from '../../../Components/ModalContent/WalletConnectionStatus'
import { isMobile } from '../../../utils/helpers'
import { ModalContext, ModalPosition } from '../ModalContext'
import Container, { WalletContextProviderProps } from './Container'

interface WalletContextType {
  showWalletConnect: boolean
  startWalletConnect(): void
  setShowWalletConnect(value: boolean): void
}

export const WalletContext = React.createContext<WalletContextType>({
  showWalletConnect: false,
  startWalletConnect: () => {},
  setShowWalletConnect: () => {},
})

function WalletContextProvider(props: WalletContextProviderProps) {
  const [showWalletConnect, setShowWalletConnect] = useState<boolean>(false)
  const { setModalContent, setModalOpen, setModalSettings } = useContext(ModalContext)

  const startWalletConnect = () => {
    if (isMobile()) {
      // do Mobile connect
      props.initMobileWallet()
      setModalContent(<WalletConnectionStatus />)
      setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
      setModalOpen(true)
    } else {
      setShowWalletConnect(true)
    }
  }

  const contextValue = {
    showWalletConnect,
    setShowWalletConnect,
    startWalletConnect,
  }

  return <WalletContext.Provider value={contextValue}>{props.children}</WalletContext.Provider>
}

export default Container(WalletContextProvider)
