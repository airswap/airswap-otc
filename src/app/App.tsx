import queryString from 'querystring'
import React, { useContext, useRef } from 'react'

import Header from '../Components/Header'
import WidgetHeader from '../Components/Header/WidgetHeader'
import WalletConnection from '../Components/WalletConnection'
import Card from '../elements/Card'
import MediaQuery from '../elements/MediaQueryWrapper'
import Modal from '../elements/Modal'
import Build from '../flows/build'
import Order from '../flows/order'
import { ModalContext } from './context/ModalContext'
import { WalletContext } from './context/WalletContext'
import { WidgetContext } from './context/WidgetContext'
import {
  AppContainer,
  AppContent,
  AppContentContainer,
  FlowContent,
  WalletCardContainer,
  WidgetContainer,
} from './styles'

declare let window: any

export default function App() {
  const flowContentRef = useRef<HTMLDivElement>(null)
  const widgetContentRef = useRef<HTMLDivElement>(null)
  const { isWidget, widgetParams } = useContext(WidgetContext)
  const { showWalletConnect } = useContext(WalletContext)
  const { modalOpen, modalContent, setModalOpen, modalSettings } = useContext(ModalContext)

  const closeWidget = () => {
    if (widgetParams.onClose) {
      widgetParams.onClose()
    }
    if (window.xprops && window.xprops.close) {
      window.xprops.close()
    }
  }

  const clickOutsideWidget = evt => {
    if (widgetParams.canDismiss && widgetContentRef.current && !widgetContentRef.current.contains(evt.target)) {
      closeWidget()
    }
  }

  const query = queryString.parse(window.location.hash.slice(1))

  // ////////// //
  //   Render   //
  // ////////// //
  const renderWidgetContent = () => {
    if (widgetParams.cid || (widgetParams.order && widgetParams.order.signature)) {
      return <Order kind="widget" />
    }
    if (query.cid) {
      return <Order />
    }
    return <Build />
  }

  return (
    <AppContainer isWidget={isWidget}>
      {isWidget ? (
        <WidgetContainer onClick={clickOutsideWidget}>
          <AppContent ref={widgetContentRef} isWidget>
            <FlowContent walletVisible={showWalletConnect} ref={flowContentRef} isWidget>
              <WidgetHeader closeWidget={closeWidget} />
              {renderWidgetContent()}
            </FlowContent>
            <MediaQuery size="md-up">
              <WalletCardContainer walletVisible={showWalletConnect}>
                <Card>
                  <WalletConnection />
                </Card>
              </WalletCardContainer>
            </MediaQuery>
          </AppContent>
        </WidgetContainer>
      ) : (
        <>
          <Header />
          <AppContentContainer>
            <AppContent>
              <FlowContent walletVisible={showWalletConnect} ref={flowContentRef}>
                {query.cid ? <Order /> : <Build />}
              </FlowContent>
              <MediaQuery size="md-up">
                <WalletCardContainer walletVisible={showWalletConnect}>
                  <Card>
                    <WalletConnection />
                  </Card>
                </WalletCardContainer>
              </MediaQuery>
            </AppContent>
          </AppContentContainer>
        </>
      )}
      <Modal setModalOpen={setModalOpen} settings={modalSettings} modalOpen={modalOpen}>
        {modalContent}
      </Modal>
    </AppContainer>
  )
}
