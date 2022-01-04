import { ETH_ADDRESS } from 'airswap.js/src/constants'
import { addTrackedAddress } from 'airswap.js/src/deltaBalances/redux/actions'
import {
  fetchHistoricalSwapCancelsByMakerAddress,
  fetchHistoricalSwapFillsByMakerAddress,
} from 'airswap.js/src/events/redux/actions'
import { ipfsFetchJSONFromCID } from 'airswap.js/src/ipfs'
import { flatten, mapNested22OrderTo20Order } from 'airswap.js/src/swap/utils'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { crawlToken } from 'airswap.js/src/tokens/redux/actions'
import { waitForState } from 'airswap.js/src/utils/redux/waitForState'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import queryString from 'querystring'

import { storeOrderFromIpfs } from './actions'

const { getConnectedWalletAddress } = walletSelectors
const { areTokensReady, getTokensByAddress } = tokenSelectors

async function dispatchHistoricalSwapsForOrder(action, store) {
  const queryParams = queryString.parse(window.location.hash.slice(1))
  if (!queryParams.cid) {
    return
  }
  try {
    const signedOrder = flatten(mapNested22OrderTo20Order(await ipfsFetchJSONFromCID(queryParams.cid)))

    store
      .dispatch(
        waitForState({
          selector: areTokensReady,
          result: true,
        }),
      )
      .then(() => {
        const tokens = getTokensByAddress(store.getState())
        if (!tokens[signedOrder.makerToken]) {
          store.dispatch(crawlToken(signedOrder.makerToken))
        }
        if (!tokens[signedOrder.takerToken]) {
          store.dispatch(crawlToken(signedOrder.takerToken))
        }
      })

    store.dispatch(addTrackedAddress({ address: signedOrder.makerWallet, tokenAddress: signedOrder.makerToken }))
    if (signedOrder.takerWallet !== ETH_ADDRESS) {
      store.dispatch(addTrackedAddress({ address: signedOrder.takerWallet, tokenAddress: signedOrder.takerToken }))
    }

    store.dispatch(storeOrderFromIpfs(signedOrder))
    store.dispatch(fetchHistoricalSwapFillsByMakerAddress(signedOrder.makerWallet))
    store.dispatch(fetchHistoricalSwapCancelsByMakerAddress(signedOrder.makerWallet))
  } catch (err) {
    window.location.href = `${window.location.origin}${window.location.hash}`
  }
}

async function dispatchSetCurrentOrderFromIpfs(action, store) {
  if (!action.hash) return

  const signedOrder = flatten(mapNested22OrderTo20Order(await ipfsFetchJSONFromCID(action.hash)))
  store.dispatch(addTrackedAddress({ address: signedOrder.makerWallet, tokenAddress: signedOrder.makerToken }))
  if (signedOrder.takerWallet !== ETH_ADDRESS) {
    store.dispatch(addTrackedAddress({ address: signedOrder.takerWallet, tokenAddress: signedOrder.takerToken }))
  }
  store.dispatch(fetchHistoricalSwapFillsByMakerAddress(signedOrder.makerWallet))
  store.dispatch(fetchHistoricalSwapCancelsByMakerAddress(signedOrder.makerWallet))
  store.dispatch(storeOrderFromIpfs(signedOrder))
}

async function trackTokenForUserWallet(store) {
  const queryParams = queryString.parse(window.location.hash.slice(1))
  if (!queryParams.cid || !store) {
    return
  }
  const signedOrder = flatten(mapNested22OrderTo20Order(await ipfsFetchJSONFromCID(queryParams.cid)))
  const connectedWalletAddress = getConnectedWalletAddress(store.getState())
  store.dispatch(addTrackedAddress({ address: connectedWalletAddress, tokenAddress: signedOrder.takerToken }))
}

export default function makerOrdersMiddleware(store) {
  return next => action => {
    switch (action.type) {
      case 'CONNECTED_WALLET':
        const { address } = action
        trackTokenForUserWallet(store)
        store.dispatch(fetchHistoricalSwapFillsByMakerAddress(address))
        store.dispatch(fetchHistoricalSwapCancelsByMakerAddress(address))
        next(action)
        break
      case '@@router/LOCATION_CHANGE':
        dispatchHistoricalSwapsForOrder(action, store)
        next(action)
        break
      case 'SET_CURRENT_ORDER':
        store.dispatch(addTrackedAddress({ address: action.order.makerWallet, tokenAddress: action.order.makerToken }))
        next(action)
        break
      case 'SET_CURRENT_ORDER_FROM_IPFS':
        dispatchSetCurrentOrderFromIpfs(action, store)
        next(action)
        break
      default:
        next(action)
    }
  }
}
