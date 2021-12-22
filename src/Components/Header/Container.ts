import { clearWallet } from 'airswap.js/src/wallet/redux/actions'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { selectors as orderSelectors } from '../../state/orders'
import { clearUnreadNotificationCount } from '../../state/orders/actions'

const { getUnreadNotificationCount } = orderSelectors
const { getConnectedWalletAddress } = walletSelectors

interface PassedProps {
  closeWidget?(): void
}

interface ReduxProps {
  connectedWalletAddress: string
  unreadNoticationCount: number
}
interface DispatchProps {
  clearWallet(): void
  clearUnreadNotificationCount(): void
}

export type HeaderProps = PassedProps & ReduxProps & DispatchProps & RouteComponentProps

const mapStateToProps = (state: any, ownProps): PassedProps & ReduxProps => {
  return {
    connectedWalletAddress: getConnectedWalletAddress(state),
    unreadNoticationCount: getUnreadNotificationCount(state),
    ...ownProps,
  }
}

const mapDispatchToProps: DispatchProps = { clearWallet, clearUnreadNotificationCount }

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
