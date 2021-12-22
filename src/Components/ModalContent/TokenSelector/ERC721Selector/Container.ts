import { selectors as erc721Selectors } from 'airswap.js/src/erc721/redux'
import { fetchERC721OwnerOf } from 'airswap.js/src/erc721/redux/contractFunctionActions'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { crawlNFTItem } from 'airswap.js/src/tokens/redux/actions'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'

import { ERC721Query, NFTItemMetadata, TokenMetadata } from '../../../../types/models/Tokens'
import { ValidatedValue } from '../../../validationComponents/createValidatedValue'

const { makeGetNFTItemByAddressAndId } = tokenSelectors
const { makeGetIsERC721Owner } = erc721Selectors
const { getConnectedWalletAddress } = walletSelectors

interface PassedProps {
  token: TokenMetadata
  param: ValidatedValue<string>
  showBalance?: boolean
  selectERC721(tokenId: string): void
  dismissERC721Selector(): void
}

interface ReduxProps {
  connectedWalletAddress: string
  getNFTItemByAddressAndId(tokenAddress: string, tokenId?: string): NFTItemMetadata | undefined
  getIsERC721Owner(tokenAddress: string, tokenId: string): boolean
}

interface DispatchProps {
  crawlNFTItem(address: string, id: string): Promise<NFTItemMetadata | null>
  fetchERC721OwnerOf(query: ERC721Query): void
}

export type ERC721SelectorProps = PassedProps & ReduxProps & DispatchProps

const mapStateToProps = (state, ownProps: PassedProps): PassedProps & ReduxProps => {
  return {
    connectedWalletAddress: getConnectedWalletAddress(state),
    getNFTItemByAddressAndId: makeGetNFTItemByAddressAndId(state),
    getIsERC721Owner: makeGetIsERC721Owner(state),
    ...ownProps,
  }
}

const mapDispatchToProps = { crawlNFTItem, fetchERC721OwnerOf }

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
