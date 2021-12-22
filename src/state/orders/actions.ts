import { SignedSimpleSwapOrderType } from '../../types/models/Orders'

export const addOutstandingMakerOrder = (signedOrder: SignedSimpleSwapOrderType) => ({
  type: 'ADD_OUTSTANDING_MAKER_ORDER',
  signedOrder,
})

export const addCompletedMakerOrder = order => ({
  type: 'ADD_COMPLETED_MAKER_ORDER',
  order,
})

export const hideOutstandingMakerOrder = order => ({
  type: 'HIDE_OUTSTANDING_MAKER_ORDER',
  order,
})

export const storeOrderFromIpfs = order => ({
  type: 'STORE_ORDER_FROM_IPFS',
  order,
})

export const clearUnreadNotificationCount = () => ({
  type: 'CLEAR_UNREAD_NOTIFICATION_COUNT',
})

export const setCurrentOrderFromIpfs = hash => ({
  type: 'SET_CURRENT_ORDER_FROM_IPFS',
  hash,
})

export const setCurrentOrder = order => ({
  type: 'SET_CURRENT_ORDER',
  order,
})
