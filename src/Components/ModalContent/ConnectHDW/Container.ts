import { connectWallet, initLedger, initMobileWallet } from 'airswap.js/src/wallet/redux/actions'
import { connect } from 'react-redux'

import { HDWType } from '.'

interface PassedProps {
  hdwType: HDWType
}

interface DispatchProps {
  initLedger(): void
  initTrezor(): void
  initMobileWallet(): void
}

export type ConnectHDWProps = PassedProps & DispatchProps

const mapStateToProps = (state: any, ownProps: PassedProps): PassedProps => ({
  ...ownProps,
})

const initTrezor = () => connectWallet({ walletType: 'metamask', walletSubtype: 'trezor' })

const mapDispatchToProps: DispatchProps = {
  initLedger,
  initTrezor,
  initMobileWallet,
}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
