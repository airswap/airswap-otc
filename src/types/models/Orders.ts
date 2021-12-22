export interface Order {
  nonce: string | number
  expiry: number
  maker: Partial<Party>
  taker: Partial<Party>
  affiliate: Partial<Party>
  signature?: Signature
}

export interface Party {
  param?: string
  wallet: string
  token: string
  amount: string
  id: string
  kind: string
}

export interface SwapOrder {
  makerToken: string
  makerAmount?: string
  makerId?: string
  makerWallet: string
  makerKind: string

  takerToken: string
  takerAmount?: string
  takerId?: string
  takerWallet: string
  takerKind: string

  nonce: string | number
  expiry: number
}

export interface SimpleSwapOrderType extends SwapOrder {
  orderCID?: string
}

export interface Signature {
  version: string
  signer: string
  r: string
  s: string
  v: number
}

export type SignedSimpleSwapOrderType = SimpleSwapOrderType & Signature

export interface FlatSignedSwapOrder extends SwapOrder {
  signatureVersion: string
  signatureSignatory: string
  signatureValidator: string
  signatureR: string
  signatureS: string
  signatureV: string
}

export enum GasLevel {
  FAST = 'fast',
  FASTEST = 'fastest',
  AVERAGE = 'average',
  SAFELOW = 'safeLow',
}

export interface EthersOptions {
  gasLimit?: number
}
