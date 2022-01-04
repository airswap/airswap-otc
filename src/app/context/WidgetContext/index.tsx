import { NETWORK } from 'airswap.js/src/constants'
import queryString from 'querystring'
import React, { useEffect, useState } from 'react'

import { Order, SignedSimpleSwapOrderType } from '../../../types/models/Orders'
import { TokenKind, TokenMetadata } from '../../../types/models/Tokens'
import Container, { WidgetContextProps } from './Container'

export function getOrderFromWidgetOrder(widgetOrder: Partial<Order>): SignedSimpleSwapOrderType | null {
  if (
    widgetOrder.maker &&
    widgetOrder.maker.wallet &&
    widgetOrder.maker.token &&
    widgetOrder.maker.kind &&
    widgetOrder.taker &&
    widgetOrder.taker.wallet &&
    widgetOrder.taker.token &&
    widgetOrder.taker.kind &&
    widgetOrder.nonce &&
    widgetOrder.expiry &&
    widgetOrder.signature
  ) {
    const order = {
      makerAmount: widgetOrder.maker.amount || widgetOrder.maker.param,
      makerId: widgetOrder.maker.id,
      makerToken: widgetOrder.maker.token,
      makerWallet: widgetOrder.maker.wallet,
      makerKind: widgetOrder.maker.kind,
      takerAmount: widgetOrder.taker.amount || widgetOrder.taker.param,
      takerId: widgetOrder.taker.id,
      takerToken: widgetOrder.taker.token,
      takerWallet: widgetOrder.taker.wallet,
      takerKind: widgetOrder.taker.kind,
      nonce: widgetOrder.nonce,
      expiry: widgetOrder.expiry,
      ...widgetOrder.signature,
    }
    return order
  }

  return null
}

interface WidgetConfig {
  primaryColor?: string
  secondaryColor?: string
  logoUrl?: string
  condensedLogoUrl?: string
}

interface MetadataConfig {
  faviconUrl?: string
  title?: string
  description?: string
}

interface WidgetCustomTokenSection {
  label: string
  tokens: string[]
}

interface PreTransferCheckError {
  maker: {
    message: string
    buttonText?: string
    redirectURL?: string
  }
  taker: {
    message: string
    buttonText?: string
    redirectURL?: string
  }
}

enum WidgetTokenProperties {
  DS_PROTOCOL = 'ds_protocol',
}

function getTokenMetadataFromWidgetToken(token: WidgetTokenMetadata, chainId?: number): TokenMetadata {
  const isSecurity = !!(
    token.properties &&
    token.properties.length &&
    token.properties.indexOf(WidgetTokenProperties.DS_PROTOCOL) !== -1
  )

  return {
    address: token.address,
    decimals: token.decimals,
    name: token.name,
    symbol: token.symbol,
    airswap_img_url: token.img_url,
    kind: token.kind,
    security: isSecurity,
    airswapUI: 'no',
    banned: false,
    network: chainId || NETWORK,
  }
}

interface WidgetTokenMetadata {
  address: string
  symbol: string
  name: string
  decimals: string
  kind: TokenKind
  img_url?: string
  properties?: WidgetTokenProperties[]
}

export interface WidgetParams {
  chainId?: number
  widgetConfig?: WidgetConfig
  metadataConfig?: MetadataConfig
  tokenMetadata?: WidgetTokenMetadata[]
  customTokenSections?: WidgetCustomTokenSection[]
  preTransferCheckErrors?: Map<string, PreTransferCheckError>
  customShareURL?: string
  canDismiss?: boolean
  orderGasLimit?: string
  order?: Partial<Order>
  cid?: string
  defaultMakerToken?: string
  defaultTakerToken?: string
  onCreate?(order: Partial<Order>, cid: string): void
  onSubmit?(): void
  onError?(error: string): void
  onSwap?(transactionId: string): void
  onCancel?(transactionId: string): void
  onClose?(): void
}

interface WidgetContextType {
  isWidget: boolean
  widgetParams: WidgetParams
}

export const WidgetContext = React.createContext<WidgetContextType>({
  isWidget: false,
  widgetParams: {},
})

declare let window: any

function WidgetContextProvider(props: WidgetContextProps) {
  const defaultWidgetParams: WidgetParams = {
    canDismiss: true,
  }

  const [isWidget, setIsWidget] = useState<boolean>(false)
  const [widgetParams, setWidgetParams] = useState<WidgetParams>(defaultWidgetParams)

  const contextValue = { isWidget, widgetParams }

  const xprops = window.xprops
  useEffect(() => {
    setIsWidget(!!xprops)
    setWidgetParams(Object.assign({}, defaultWidgetParams, xprops))

    // Set network
    const query = queryString.parse(window.location.hash.slice(1))
    if (xprops && xprops.chainId && !query.network) {
      query.network = `${xprops.chainId}`
      window.location.hash = `#${queryString.stringify(query)}`
    }

    // Set order from widget
    if (xprops && xprops.cid) {
      props.setCurrentOrderFromIpfs(xprops.cid)
    } else if (xprops && xprops.order && xprops.order.signature) {
      const parsedOrder = getOrderFromWidgetOrder(xprops.order)
      if (parsedOrder) {
        props.setCurrentOrder(parsedOrder)
      }
    }

    // Add custom token metadata
    if (xprops && xprops.tokenMetadata) {
      props.addTokenMetadata(
        xprops.tokenMetadata.map(token => getTokenMetadataFromWidgetToken(token, xprops.chainId || query.network)),
      )
    }
  }, [JSON.stringify(xprops), isWidget])

  return <WidgetContext.Provider value={contextValue}>{props.children}</WidgetContext.Provider>
}

export default Container(WidgetContextProvider)
