import { clearWallet } from 'airswap.js/src/wallet/redux/actions'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'

const { getConnectedWalletAddress } = walletSelectors

interface PassedProps {
  toggleRef?: React.RefObject<HTMLDivElement>
  isOpen: boolean
  setIsOpen(isOpen: boolean): void
}

interface ReduxProps {
  connectedWalletAddress: string
}

interface DispatchProps {
  clearWallet(): void
}

export type MenuProps = PassedProps & ReduxProps & DispatchProps

const mapStateToProps = (state: any, ownProps): MenuProps => {
  return {
    connectedWalletAddress: getConnectedWalletAddress(state),
    ...ownProps,
  }
}

const mapDispatchToProps: DispatchProps = { clearWallet }

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
