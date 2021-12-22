import { ConnectedRouter } from 'connected-react-router'
import React from 'react'

import history from '../state/router/history'
import AppContent from './App'
import FormSubmitContextProvider from './context/FormSubmitContext'
import ModalContextProvider from './context/ModalContext'
import WalletContextProvider from './context/WalletContext'
import WidgetContextProvider from './context/WidgetContext'
import IntlProvider from './providers/IntlProvider'
import ReduxProvider from './providers/ReduxProvider'
import ThemeProvider from './providers/ThemeProvider'

function App() {
  return (
    <WidgetContextProvider>
      <FormSubmitContextProvider>
        <ModalContextProvider>
          <WalletContextProvider>
            <ConnectedRouter history={history}>
              <AppContent />
            </ConnectedRouter>
          </WalletContextProvider>
        </ModalContextProvider>
      </FormSubmitContextProvider>
    </WidgetContextProvider>
  )
}

export default ReduxProvider(IntlProvider(ThemeProvider(App)))
