import { getTransactionHistory } from 'airswap.js/src/redux/combinedSelectors'
import { getFormattedSwapCancels, getFormattedSwapFills } from 'airswap.js/src/swap/redux/selectors'
import { flatten, getSwapOrderId, mapFlat22OrderTo20Order } from 'airswap.js/src/swap/utils'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux/'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { createSelector } from 'reselect'

import { FinalizedActivityItemProps } from '../../Components/Header/Activity/Container'
import { TransactionActivity } from '../../types/models/Activity'
import { SignedSimpleSwapOrderType } from '../../types/models/Orders'
import { TokenKind } from '../../types/models/Tokens'

const { getConnectedWalletAddress } = walletSelectors
const { makeDisplayByToken, getTokensByAddress } = tokenSelectors

export const defaultState = {
  outstanding: [],
  completed: [],
  hidden: {},
  order: {},
  unreadNotificationCount: 0,
}

const orders = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_OUTSTANDING_MAKER_ORDER':
      if (!action.signedOrder) break
      const newOutstandingState = [...state.outstanding, flatten(action.signedOrder)]
      return { ...state, outstanding: newOutstandingState, unreadNotificationCount: state.unreadNotificationCount + 1 }
    case 'ADD_COMPLETED_MAKER_ORDER':
      if (!action.order) break
      const newCompletedState = [...state.completed, action.order]
      return { ...state, completed: newCompletedState }
    case 'HIDE_OUTSTANDING_MAKER_ORDER':
      if (!action.order) break
      const id = getSwapOrderId(action.order)
      const newHiddenState = { ...state.hidden, [id]: true }
      return { ...state, hidden: newHiddenState }
    case 'STORE_ORDER_FROM_IPFS':
    case 'SET_CURRENT_ORDER':
      if (!action.order) return state
      return { ...state, order: action.order }
    case 'CLEAR_UNREAD_NOTIFICATION_COUNT':
    case 'CLEAR_WALLET':
      return { ...state, unreadNotificationCount: 0 }
    default:
      return state
  }
}

export default orders

const getOutstandingMakerOrders = state => state.orders.outstanding.map(order => mapFlat22OrderTo20Order(order))
const getHiddenOutstandingMakerOrders = state => state.orders.hidden
const getCompletedMakerOrders = state => state.orders.completed
const getUnreadNotificationCount = state => state.orders.unreadNotificationCount

export const getCurrentOrder = state => state.orders.order

// Get Transactions
const getTransactionActivity = createSelector(
  getConnectedWalletAddress,
  getTransactionHistory,
  getOutstandingMakerOrders,
  getFormattedSwapFills,
  getFormattedSwapCancels,
  getTokensByAddress,
  makeDisplayByToken,
  (
    walletAddress: string,
    txHistory: any[],
    outstandingOrders,
    fills: any[],
    cancels: any[],
    tokensByAddress: Record<string, any>,
    displayByToken: any,
  ) => {
    const transactionActivity: TransactionActivity[] = []
    let description
    txHistory.forEach(tx => {
      let txStatus = tx.textStatus.charAt(0).toUpperCase() + tx.textStatus.substr(1)
      if (tx.description && tx.description.length) {
        description = tx.description
      } else {
        const orderParams = tx.transaction.parameters
        if (!orderParams) return

        let makerTokenData = tokensByAddress[orderParams._makerToken]
        let takerTokenData = tokensByAddress[orderParams._takerToken]
        let makerWallet = orderParams._makerWallet
        let makerParam = orderParams._makerAmount || orderParams._makerId
        let takerParam = orderParams._takerAmount || orderParams._takerId

        if (!makerTokenData || !takerTokenData) {
          if (!tx.transaction) return
          // Backfill transaction details from orders
          const found = outstandingOrders.find(
            (order: SignedSimpleSwapOrderType) =>
              getSwapOrderId(order).toLowerCase() ===
              getSwapOrderId({
                makerWallet: tx.transaction.from,
                nonce: tx.transaction.parameters.nonces,
              }).toLowerCase(),
          )
          if (!found) {
            return
          }
          txStatus = tx.transaction.name.charAt(0).toUpperCase() + tx.transaction.name.substr(1)
          makerWallet = found.makerWallet
          makerParam = found.makerAmount || found.makerId
          takerParam = found.takerAmount || found.takerId
          makerTokenData = tokensByAddress[found.makerToken]
          takerTokenData = tokensByAddress[found.takerToken]
        }

        const makerSymbol = walletAddress === makerWallet ? makerTokenData.symbol : takerTokenData.symbol
        const makerAmount =
          walletAddress === orderParams._makerWallet
            ? displayByToken({ address: orderParams._makerToken }, makerParam)
            : displayByToken({ address: orderParams._takerToken }, takerParam)

        const takerSymbol = walletAddress === makerWallet ? takerTokenData.symbol : makerTokenData.symbol
        const takerAmount =
          walletAddress === makerWallet
            ? displayByToken({ address: takerTokenData.address }, takerParam)
            : displayByToken({ address: makerTokenData.address }, makerParam)

        description = `${makerAmount ? makerAmount.toLocaleString() : 'N/A'} ${makerSymbol}  →  ${
          takerAmount ? takerAmount.toLocaleString() : 'N/A'
        } ${takerSymbol}`
      }

      const activityItem = {
        description,
        txStatus,
        txHash: tx.transactionHash,
        timestamp: tx.timestamp / 1000,
      }

      transactionActivity.push(activityItem)
    })

    return transactionActivity
  },
)

const getMakerOrders = createSelector(
  getConnectedWalletAddress,
  getTokensByAddress,
  getOutstandingMakerOrders,
  getHiddenOutstandingMakerOrders,
  getFormattedSwapFills,
  getFormattedSwapCancels,
  makeDisplayByToken,
  (
    connectedWalletAddress,
    tokens: Record<string, any>,
    outstandingOrders,
    hiddenOutstandingOrders,
    fills: any[],
    cancels: any[],
    displayByToken: any,
  ) => {
    const filteredOutstandingOrders = outstandingOrders.filter((order: SignedSimpleSwapOrderType) => {
      // filter out orders we didn't make on this account
      if (connectedWalletAddress !== order.makerWallet) return false

      // filter out expired outstanding orders that the user elected to hide
      const id = getSwapOrderId(order)
      if (hiddenOutstandingOrders[id]) return false

      // filter out outstanding orders that got filled
      const allFillsCancelsFailures = [...fills, ...cancels]
      const outstandingId = getSwapOrderId(order)
      for (let i = 0; i < allFillsCancelsFailures.length; i++) {
        const fillId = getSwapOrderId(allFillsCancelsFailures[i])
        if (outstandingId === fillId) {
          return false
        }
      }
      return true
    })

    const formatFill = (fill, txStatus): FinalizedActivityItemProps => {
      const makerToken = tokens[fill.makerToken]
      const takerToken = tokens[fill.takerToken]
      const makerKind =
        (makerToken && makerToken.kind) || fill.makerKind || (Number(fill.makerId) ? TokenKind.ERC721 : TokenKind.ERC20)
      const takerKind =
        (takerToken && takerToken.kind) || fill.takerKind || (Number(fill.takerId) ? TokenKind.ERC721 : TokenKind.ERC20)

      return {
        makerWallet: fill.makerWallet,
        makerSymbol: fill.makerSymbol,
        makerAmount: fill.makerAmountFormatted,
        makerKind,
        makerId: fill.makerId,
        takerSymbol: fill.takerSymbol,
        takerAmount: fill.takerAmountFormatted,
        takerKind,
        takerId: fill.takerId,
        timestamp: fill.timestamp,
        txHash: fill.transactionHash,
        nonce: fill.nonce,
        txStatus,
      }
    }

    const formatCancel = fill => {
      const found = outstandingOrders.find(
        (order: SignedSimpleSwapOrderType) =>
          getSwapOrderId(order).toLowerCase() === getSwapOrderId(fill).toLowerCase(),
      )
      let formatted: FinalizedActivityItemProps

      if (found) {
        const makerToken = tokens[found.makerToken]
        const makerAmountFormatted = displayByToken({ address: found.makerToken }, found.makerAmount)
        const takerToken = tokens[found.takerToken]
        const takerAmountFormatted = displayByToken({ address: found.takerToken }, found.takerAmount)
        const makerKind = found.makerKind || (Number(found.makerId) ? TokenKind.ERC721 : TokenKind.ERC20)
        const takerKind = found.takerKind || (Number(found.takerId) ? TokenKind.ERC721 : TokenKind.ERC20)

        formatted = {
          makerWallet: found.makerWallet,
          makerSymbol: makerToken ? makerToken.symbol : '',
          makerAmount: makerAmountFormatted,
          makerKind,
          makerId: fill.makerId || found.makerId,
          takerSymbol: takerToken ? takerToken.symbol : '',
          takerAmount: takerAmountFormatted,
          takerKind,
          takerId: fill.takerId || found.takerId,
          timestamp: fill.timestamp,
          txHash: fill.transactionHash,
          nonce: found.nonce,
          txStatus: 'Cancelled',
        }
      } else {
        formatted = formatFill(fill, 'Cancelled')
      }
      return formatted
    }

    // format, sort, and filter all fills, cancels, and failures
    const formattedFills = fills
      .map(fill => formatFill(fill, 'Confirmed'))
      .concat(cancels.map(fill => formatCancel(fill)))
      .filter(fill => fill.makerWallet === connectedWalletAddress)
      .sort((a, b) => {
        if (a.timestamp < b.timestamp) return -1
        if (b.timestamp < a.timestamp) return 1
        return 0
      })

    return [filteredOutstandingOrders, formattedFills]
  },
)

const getFormattedOutstandingMakerOrders = createSelector(
  getMakerOrders,
  getTokensByAddress,
  makeDisplayByToken,
  ([filteredOutstandingOrders], tokensByAddress: any, displayByToken: any) => {
    return filteredOutstandingOrders.map(signedOrder => {
      const { makerAmount, takerAmount, makerKind, takerKind, takerId, makerId, expiration, orderCID } = signedOrder

      const makerToken = tokensByAddress[signedOrder.makerToken]
      const takerToken = tokensByAddress[signedOrder.takerToken]

      const makerSymbol = (makerToken && makerToken.symbol) || 'N/A'
      const takerSymbol = (takerToken && takerToken.symbol) || 'N/A'
      const formattedMakerAmount = displayByToken({ address: signedOrder.makerToken }, makerAmount)
      const formattedTakerAmount = displayByToken({ address: signedOrder.takerToken }, takerAmount)

      return {
        makerSymbol,
        takerSymbol,
        makerAmount: formattedMakerAmount,
        takerAmount: formattedTakerAmount,
        makerId,
        takerId,
        makerKind,
        takerKind,
        makerTokenKind: (makerToken && makerToken.kind) || TokenKind.ERC20,
        takerTokenKind: (takerToken && takerToken.kind) || TokenKind.ERC20,
        expiration,
        orderCID,
        signedOrder,
      }
    })
  },
)

export const selectors = {
  getTransactionActivity,
  getOutstandingMakerOrders,
  getCompletedMakerOrders,
  getMakerOrders,
  getFormattedOutstandingMakerOrders,
  getUnreadNotificationCount,
}
