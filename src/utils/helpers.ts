import ismobilejs from 'ismobilejs/src/isMobile'
import queryString from 'querystring'

import { SignedSimpleSwapOrderType } from '../types/models/Orders'
import { ExpirationMultiplier, ExpirationType } from './numbers'

export const getExpirationFromMinutes = (minutes: number | string, expirationType: ExpirationType) => {
  return Math.floor(Date.now() / 1000) + Number(minutes) * ExpirationMultiplier[expirationType]
}

// does the address start with 0x and have 42 characters?
export const isEthereumAddress = (address: string) => address && address.indexOf('0x') === 0 && address.length === 42

export const getIsValidSignedOrder = ({
  makerWallet,
  makerAmount,
  makerId,
  makerToken,
  takerWallet,
  takerAmount,
  takerId,
  takerToken,
  expiry,
  nonce,
  r,
  s,
  v,
}: SignedSimpleSwapOrderType) => {
  // valid address types?
  if (!isEthereumAddress(makerWallet)) return false
  if (!isEthereumAddress(makerToken)) return false
  if (!isEthereumAddress(takerWallet)) return false
  if (!isEthereumAddress(takerToken)) return false

  // valid amounts?
  if (!makerAmount && !makerId) return false
  if (!takerAmount && !takerId) return false

  // order is signed?
  if (!r || !s || !v) return false
  if (!nonce) return false

  // order expires in the future?
  if (expiry && Date.now() / 1000 > expiry) return false

  return true
}

export const isMobile = () => ismobilejs.isMobile(navigator.userAgent).any || window.innerWidth < 800

export const redirectWithCID = cid => {
  const queryParams = queryString.parse(window.location.hash.slice(1))
  if (!cid) {
    delete queryParams.cid
  } else {
    queryParams.cid = cid
  }
  window.location.hash = `#${queryString.stringify(queryParams)}`
}

export const getShareUrl = (cid, widgetParams?) => {
  const query = queryString.parse(window.location.hash.slice(1))
  const queryParams: any = {}
  if (query.network) {
    queryParams.network = query.network
  } else if (widgetParams && widgetParams.chainId) {
    queryParams.network = widgetParams.chainId
  }
  queryParams.cid = cid
  return encodeURI(`${window.location.href.split('#')[0]}#${queryString.stringify(queryParams)}`)
}
