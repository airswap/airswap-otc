import { initMobileWallet } from 'airswap.js/src/wallet/redux/actions'
import { connect } from 'react-redux'

interface PassedProps {
  children: React.ReactNode
}

interface DispatchProps {
  initMobileWallet(): void
}

export type WalletContextProviderProps = PassedProps & DispatchProps

const mapStateToProps = (state, ownProps): WalletContextProviderProps => ownProps

const mapDispatchToProps = { initMobileWallet }

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
