import { STABLECOIN_TOKEN_ADDRESSES, TRUSTED_PROJECT_TOKEN_ADDRESSES } from 'airswap.js/src/constants'
import { selectors as balancesSelectors } from 'airswap.js/src/deltaBalances/redux'
import { addTrackedAddress } from 'airswap.js/src/deltaBalances/redux/actions'
import { fetchERC721GetApprovedOverride } from 'airswap.js/src/erc721/redux/actions'
import { fetchERC721OwnerOf } from 'airswap.js/src/erc721/redux/contractFunctionActions'
import {
  fetchERC1155BalanceOf,
  fetchERC1155IsApprovedForAll,
} from 'airswap.js/src/erc1155/redux/contractFunctionActions'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { crawlToken } from 'airswap.js/src/tokens/redux/actions'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import _ from 'lodash'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { POPULAR_NFT_SYMBOLS } from '../../../constants'
import { ERC721Query, ERC1155Query, TokenKind, TokenMetadata } from '../../../types/models/Tokens'
import { ValidatedValue } from '../../validationComponents/createValidatedValue'

const { getTokensByAddress, getAirSwapApprovedTokensByAddress, makeGetNFTItemByAddressAndId } = tokenSelectors
const { getConnectedWalletAddress } = walletSelectors
const { getConnectedBalancesFormatted } = balancesSelectors

export const makeGetTokenFromAllTokens = createSelector(getTokensByAddress, (tokens: TokenMetadata[]) => tokenToMatch =>
  _.find(tokens, token => {
    return token.address === tokenToMatch
  }),
)

export interface TokenSection {
  label: string
  tokens: TokenMetadata[]
}

interface ReduxProps {
  tokenSections: TokenSection[]
  connectedWalletAddress: string
  tokensByAddress: Record<string, Record<string, any>>[]
  getTokenFromAllTokens(tokenAddress: string): TokenMetadata | undefined
  getNFTItemByAddressAndId(tokenAddress: string, id: string): TokenMetadata | undefined
}

interface PassedProps {
  showBalance?: boolean
  param: ValidatedValue<string>
  setParam(param: string): void
  tokenId: string
  setTokenId(tokenId: string): void
  tokenAddress: ValidatedValue<string>
  setTokenAddress(token: string): void
  tokenKind: TokenKind
  setTokenKind(tokenKind: TokenKind): void
}

interface DispatchProps {
  crawlToken(address: string): void
  addTrackedAddress(value): void
  fetchERC721OwnerOf(query: ERC721Query): void
  fetchERC721GetApproved(query: ERC721Query): void
  fetchERC1155BalanceOf(query: ERC1155Query): void
  fetchERC1155IsApprovedForAll(query: ERC1155Query): void
}

export type TokenSelectorProps = ReduxProps & PassedProps & DispatchProps

const mapStateToProps = (state: any, ownProps: PassedProps): ReduxProps => {
  const connectedWalletAddress = getConnectedWalletAddress(state)

  function sortTokensBySymbol(a: TokenMetadata, b: TokenMetadata) {
    if (a.symbol < b.symbol) return -1
    return 1
  }

  function sortTokensByBalancesDesc(a: TokenMetadata, b: TokenMetadata) {
    const formattedBalances = getConnectedBalancesFormatted(state)

    const aAmount = formattedBalances[a.address]
    const bAmount = formattedBalances[b.address]

    if (!connectedWalletAddress) return 0
    if (aAmount > bAmount) return -1
    if (bAmount > aAmount) return 1
    return 0
  }

  const airswapApprovedTokensByAddress = getAirSwapApprovedTokensByAddress(state)

  const allTokens: TokenMetadata[] = Object.values(getTokensByAddress(state))

  const airswapApprovedTokens: TokenMetadata[] = Object.values(airswapApprovedTokensByAddress)

  const trustedTokens = allTokens
    .filter(token => TRUSTED_PROJECT_TOKEN_ADDRESSES.includes(token.address))
    .sort(sortTokensBySymbol)
    .sort(sortTokensByBalancesDesc)

  const stablecoinTokens = allTokens
    .filter(token => STABLECOIN_TOKEN_ADDRESSES.includes(token.address))
    .sort(sortTokensBySymbol)
    .sort(sortTokensByBalancesDesc)

  const airswapAllOtherTokens = airswapApprovedTokens
    .filter(
      token =>
        !TRUSTED_PROJECT_TOKEN_ADDRESSES.includes(token.address) &&
        !STABLECOIN_TOKEN_ADDRESSES.includes(token.address) &&
        !(POPULAR_NFT_SYMBOLS.includes(token.symbol) && token.kind === 'ERC721'),
    )
    .sort(sortTokensBySymbol)
    .sort(sortTokensByBalancesDesc)
  const allOtherTokens = allTokens
    .filter(
      token =>
        !airswapApprovedTokensByAddress[token.address] &&
        !TRUSTED_PROJECT_TOKEN_ADDRESSES.includes(token.address) &&
        !STABLECOIN_TOKEN_ADDRESSES.includes(token.address) &&
        !(POPULAR_NFT_SYMBOLS.includes(token.symbol) && token.kind === 'ERC721'),
    )
    .sort(sortTokensBySymbol)
    .sort(sortTokensByBalancesDesc)
  const combinedAllOtherTokens = airswapAllOtherTokens.concat(allOtherTokens)
  const popularNFTs = allTokens.filter(token => POPULAR_NFT_SYMBOLS.includes(token.symbol) && token.kind === 'ERC721')
  const tokenSections = [
    {
      label: 'Trusted By',
      tokens: trustedTokens,
    },
    {
      label: 'Popular Stablecoins',
      tokens: stablecoinTokens,
    },
    {
      label: 'Popular NFTs',
      tokens: popularNFTs,
    },
    {
      label: 'More Tokens',
      tokens: combinedAllOtherTokens,
    },
  ]

  return {
    tokenSections,
    tokensByAddress: getTokensByAddress(state),
    connectedWalletAddress: getConnectedWalletAddress(state),
    getTokenFromAllTokens: makeGetTokenFromAllTokens(state),
    getNFTItemByAddressAndId: makeGetNFTItemByAddressAndId(state),
    ...ownProps,
  }
}

const mapDispatchToProps = {
  crawlToken,
  addTrackedAddress,
  fetchERC721OwnerOf,
  fetchERC721GetApproved: fetchERC721GetApprovedOverride,
  fetchERC1155BalanceOf,
  fetchERC1155IsApprovedForAll,
}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
