import { selectors as balancesSelectors } from 'airswap.js/src/deltaBalances/redux'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'

import { IntlObject } from '../../../types/LocaleTypes'

const {
  getIsWalletConnecting,
  getWalletAction, // getWalletAction can indicate if we are currently waiting on a signature
  getAvailableWalletState,
  getConnectedWalletAddress,
  getWalletConnectionError,
} = walletSelectors

const { getBalancesFormatted } = balancesSelectors

export interface WalletConnectionStatusProps extends IntlObject {
  isWalletSigning: boolean
  isWalletDoingHandshake: boolean
  isWalletConnecting: boolean
  isWalletWrappingWeth: boolean
  isWalletUnwrappingWeth: boolean
  isWalletApprovingToken: boolean
  isConnectingRouter: boolean
  availableWallets: string[]
  connectedWalletAddress?: string
  walletConnectionError?: string
  balancesFormatted: Record<string, any>
  setIsInitLedger(value: boolean): void
  nextHDWAccounts(): void
  prevHDWAccounts(): void
  setHDWSubPath(): void
  confirmHDWPath(): void
  cancelHDWInitialization(): void
}

const mapStateToProps = (state: any, ownProps) => {
  const walletAction = getWalletAction(state)
  const isWalletSigning = !!walletAction.actionType
  const isWalletDoingHandshake = !!walletAction.actionType && walletAction.actionType === 'signMessage'
  return {
    isWalletSigning,
    isWalletDoingHandshake,
    isWalletConnecting: getIsWalletConnecting(state),
    availableWallets: getAvailableWalletState(state),
    connectedWalletAddress: getConnectedWalletAddress(state),
    walletConnectionError: getWalletConnectionError(state),
    balancesFormatted: getBalancesFormatted(state),
    ...ownProps,
  }
}

const mapDispatchToProps = {}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
