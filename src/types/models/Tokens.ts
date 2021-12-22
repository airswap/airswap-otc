import { constants } from '@airswap/order-utils'

const { ERC20_INTERFACE_ID, ERC721_INTERFACE_ID, ERC1155_INTERFACE_ID } = constants

export interface TokenQuery {
  symbol?: string
  address?: string
}

export interface ERC721Query {
  contractAddress?: string
  tokenId?: string
  to?: string
}

export interface ERC1155Query {
  contractAddress?: string
  owner?: string
  id?: string
  operator?: string
  approved?: boolean
}

export interface TokenMetadata {
  address: string
  symbol: string
  name: string
  airswapUI: 'yes' | 'no'
  banned: boolean
  airswap_img_url?: string
  cmc_id?: string
  cmc_img_url?: string
  cmc_url?: string
  colors?: string[]
  decimals: string
  kind?: TokenKind
  security?: boolean
  network: number
}

export interface NFTItemMetadata {
  address: string
  name: string
  symbol: string
  id: string
  img_url: string
}

export enum TokenKind {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

export const TokenKindInterfaceMap = {
  [TokenKind.ERC20]: ERC20_INTERFACE_ID,
  [TokenKind.ERC721]: ERC721_INTERFACE_ID,
  [TokenKind.ERC1155]: ERC1155_INTERFACE_ID,
  [ERC20_INTERFACE_ID]: TokenKind.ERC20,
  [ERC721_INTERFACE_ID]: TokenKind.ERC721,
  [ERC1155_INTERFACE_ID]: TokenKind.ERC1155,
}
