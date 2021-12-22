import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { addOutstandingMakerOrder } from '../../../state/orders/actions'
import { getCurrentOrder } from '../../../state/orders/reducers'
import { IntlObject } from '../../../types/LocaleTypes'
import { SignedSimpleSwapOrderType } from '../../../types/models/Orders'
import { TokenMetadata, TokenQuery } from '../../../types/models/Tokens'

const { getConnectedWalletAddress } = walletSelectors
const { getTokensByAddress, makeDisplayByToken } = tokenSelectors

interface OrderRouteProps {
  orderCID: string
}

export interface OrderSummaryProps extends RouteComponentProps<OrderRouteProps>, IntlObject {
  getDisplayByToken(tokenQuery: TokenQuery, tokenAmount: string): string
  tokensByAddress: Record<string, TokenMetadata>[]
  connectedWalletAddress: string
  order: SignedSimpleSwapOrderType
}

export interface OrderSummaryDispatchProps {
  addOutstandingMakerOrder(signedOrder: SignedSimpleSwapOrderType): void
}

const mapStateToProps = (state: any, ownProps): OrderSummaryProps => {
  return {
    getDisplayByToken: makeDisplayByToken(state),
    tokensByAddress: getTokensByAddress(state),
    connectedWalletAddress: getConnectedWalletAddress(state),
    order: getCurrentOrder(state),
    ...ownProps,
  }
}

const mapDispatchToProps: OrderSummaryDispatchProps = { addOutstandingMakerOrder }

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
