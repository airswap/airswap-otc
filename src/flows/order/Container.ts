import {
  getSwapCancelEvents,
  getSwapCancelHistoricalFetchStatus,
  getSwapSwapEvents,
  getSwapSwapHistoricalFetchStatus,
} from 'airswap.js/src/swap/redux/eventTrackingSelectors'
import { getSwapOrderId } from 'airswap.js/src/swap/utils'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import _ from 'lodash'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { getCurrentOrder } from '../../state/orders/reducers'
import { FetchStatus } from '../../types/models/Fetch'
import { SignedSimpleSwapOrderType } from '../../types/models/Orders'
import { UserOrderRole } from './index'

const { getConnectedWalletAddress } = walletSelectors

export const makeFindMatchingSwapFill = createSelector(getSwapSwapEvents, (fills: any) => orderToMatch =>
  _.find(fills, fill => {
    return getSwapOrderId(fill.values) === getSwapOrderId(orderToMatch)
  }),
)

export const makeFindMatchingSwapCancel = createSelector(getSwapCancelEvents, (fills: any) => orderToMatch =>
  _.find(fills, fill => {
    try {
      return getSwapOrderId(fill.values) === getSwapOrderId(orderToMatch)
    } catch (e) {
      return false
    }
  }),
)

export enum OrderStatus {
  PENDING = 'Pending',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
  CONFIRMED = 'Confirmed',
  LOADING = 'Loading',
}

interface ReduxProps {
  connectedWalletAddress: string
  signedOrder: SignedSimpleSwapOrderType | null
  orderStatus: OrderStatus
  userOrderRole: UserOrderRole
  transactionHash?: string
  swapSwapHistoricalFetchStatus: FetchStatus
  swapCancelHistoricalFetchStatus: FetchStatus
}

interface WidgetProps {
  kind?: 'widget'
}

export type OrderProps = WidgetProps & ReduxProps

const mapStateToProps = (state: any, ownProps: WidgetProps): OrderProps => {
  const currentOrder = getCurrentOrder(state)
  const getFindMatchingSwapFill = makeFindMatchingSwapFill(state)
  const getFindMatchingSwapCancel = makeFindMatchingSwapCancel(state)
  const connectedWalletAddress = getConnectedWalletAddress(state)

  let userOrderRole
  let orderStatus
  let transactionHash

  // Necessary checks for getSwapOrderId to pass
  if (currentOrder && currentOrder.makerWallet && currentOrder.takerWallet && currentOrder.nonce) {
    const fillOrder = getFindMatchingSwapFill(currentOrder)
    const cancelOrder = getFindMatchingSwapCancel(currentOrder)

    // Order Role
    userOrderRole = UserOrderRole.OTHER
    if (currentOrder.makerWallet === connectedWalletAddress) {
      userOrderRole = UserOrderRole.MAKER
    } else if (currentOrder.takerWallet === connectedWalletAddress) {
      userOrderRole = UserOrderRole.TAKER
    } else if (fillOrder && fillOrder.values.takerWallet === connectedWalletAddress) {
      userOrderRole = UserOrderRole.TAKER
    } else if (cancelOrder && cancelOrder.values.takerWallet === connectedWalletAddress) {
      userOrderRole = UserOrderRole.TAKER
    }

    // Order Status
    orderStatus = OrderStatus.PENDING
    if (fillOrder) {
      orderStatus = OrderStatus.CONFIRMED
      transactionHash = fillOrder.transactionHash
    } else if (cancelOrder) {
      orderStatus = OrderStatus.CANCELLED
      transactionHash = cancelOrder.transactionHash
    }
  } else {
    orderStatus = OrderStatus.LOADING
  }

  return {
    connectedWalletAddress,
    signedOrder: currentOrder,
    userOrderRole,
    orderStatus,
    transactionHash,
    swapSwapHistoricalFetchStatus: getSwapSwapHistoricalFetchStatus(state),
    swapCancelHistoricalFetchStatus: getSwapCancelHistoricalFetchStatus(state),
    ...ownProps,
  }
}

const mapDispatchToProps = {}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
