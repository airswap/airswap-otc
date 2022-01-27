import { selectors as balancesSelectors } from 'airswap.js/src/deltaBalances/redux'
import {
  initEqual,
  initLedger,
  initMetamask,
  initMobileWallet,
  initPortis,
  initWalletLink,
} from 'airswap.js/src/wallet/redux/actions'
import { connect } from 'react-redux'

const { getBalancesFormatted } = balancesSelectors

export interface WalletContainerProps {
  balancesFormatted: Record<string, any>
  initMetamask(): void
  initWalletLink(query: { walletAppLogo?: string; walletAppName?: string }): void
  initEqual(): void
  initLedger(): void
  initPortis(): void
  initMobileWallet(): void
}

const mapStateToProps = (state: any, ownProps: any): WalletContainerProps => ({
  balancesFormatted: getBalancesFormatted(state),
  ...ownProps,
})

const mapDispatchToProps = {
  initMetamask,
  initWalletLink,
  initEqual,
  initLedger,
  initPortis,
  initMobileWallet,
}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
