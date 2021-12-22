import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'

import { TokenMetadata } from '../../../types/models/Tokens'

const { getConnectedWalletAddress } = walletSelectors
const { getTokensByAddress } = tokenSelectors

export interface PreTransferCheckOrderDetails {
  expiry: number
  makerToken: string
  makerAmount: string
  makerWallet: string
  takerToken: string
  takerAmount: string
  takerWallet: string
}

interface OrderRouteProps {
  orderCID: string
}

interface PassedProps {
  order: PreTransferCheckOrderDetails
  code: string
  reason: string
}

interface ReduxProps {
  tokensByAddress: Record<string, TokenMetadata>
  connectedWalletAddress: string
}

export type PreTransferCheckProps = PassedProps & ReduxProps

const mapStateToProps = (state: any, ownProps): PreTransferCheckProps => {
  return {
    tokensByAddress: getTokensByAddress(state),
    connectedWalletAddress: getConnectedWalletAddress(state),
    ...ownProps,
  }
}

const mapDispatchToProps = {}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
