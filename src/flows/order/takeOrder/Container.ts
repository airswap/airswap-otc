import { selectors as balancesSelectors } from 'airswap.js/src/deltaBalances/redux'
import { fetchDsProtocolPreTransferCheck } from 'airswap.js/src/dsProtocol/redux/contractFunctionActions'
import { fetchERC721GetApprovedOverride } from 'airswap.js/src/erc721/redux/actions'
import { fetchERC721OwnerOf } from 'airswap.js/src/erc721/redux/contractFunctionActions'
import { checkComplianceServiceWhitelist } from 'airswap.js/src/erc1155/redux/actions'
import {
  fetchERC1155BalanceOf,
  fetchERC1155IsApprovedForAll,
} from 'airswap.js/src/erc1155/redux/contractFunctionActions'
import { setGasLevel } from 'airswap.js/src/gas/redux/actions'
import { fillSwap } from 'airswap.js/src/swap/redux/actions'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { UserOrderRole } from '..'
import { getCurrentOrder } from '../../../state/orders/reducers'
import { makeGetBalanceForToken } from '../../../state/selectors'
import { ComplianceServiceWhitelistQuery } from '../../../types/models/ERC1155'
import { EthersOptions, FlatSignedSwapOrder, GasLevel } from '../../../types/models/Orders'
import { PreTransferCheckPayload } from '../../../types/models/Security'
import { ERC721Query, ERC1155Query, TokenMetadata, TokenQuery } from '../../../types/models/Tokens'

const {
  makeAtomicByToken,
  getTokensByAddress,
  getAirSwapApprovedTokensByAddress,
  getAirSwapApprovedTokensBySymbol,
  makeDisplayByToken,
  areTokensReady,
} = tokenSelectors
const { getConnectedSwapApprovals, getBalances } = balancesSelectors
const { getConnectedWalletAddress } = walletSelectors

interface TakerOrderRouteProps {
  orderCID: string
}

export interface TakerOrderCardProps extends RouteComponentProps<TakerOrderRouteProps> {
  connectedApprovals: Record<string, any>
  airswapApprovedTokensByAddress: Record<string, any>
  airswapApprovedTokensBySymbol: Record<string, any>
  tokensByAddress: Record<string, TokenMetadata>
  trackedBalances: Record<string, any>
  userOrderRole: UserOrderRole
  connectedWalletAddress: string
  areTokensReady: boolean
  order: FlatSignedSwapOrder
  getAtomicByToken(tokenQuery: TokenQuery, tokenAmount: string): string
  getDisplayByToken(tokenQuery: TokenQuery, tokenAmount: string): string
  getBalanceForToken(walletAddress: string, tokenAddress: string, combine?: boolean): string
}

export interface TakerOrderCardDispatchProps {
  fillSwap(SignedSimpleSwapOrderType, options?: EthersOptions): any
  setGasLevel(level: GasLevel): void
  fetchDsProtocolPreTransferCheck(payload: PreTransferCheckPayload): void
  fetchERC721OwnerOf(query: ERC721Query): void
  fetchERC721GetApproved(query: ERC721Query): void
  fetchERC1155BalanceOf(query: ERC1155Query): void
  fetchERC1155IsApprovedForAll(query: ERC1155Query): void
  checkComplianceServiceWhitelist(query: ComplianceServiceWhitelistQuery): void
}

const mapStateToProps = (state: any, ownProps): TakerOrderCardProps => {
  return {
    airswapApprovedTokensByAddress: getAirSwapApprovedTokensByAddress(state),
    airswapApprovedTokensBySymbol: getAirSwapApprovedTokensBySymbol(state),
    tokensByAddress: getTokensByAddress(state),
    getAtomicByToken: makeAtomicByToken(state),
    getDisplayByToken: makeDisplayByToken(state),
    trackedBalances: getBalances(state),
    connectedApprovals: getConnectedSwapApprovals(state),
    connectedWalletAddress: getConnectedWalletAddress(state),
    areTokensReady: areTokensReady(state),
    order: getCurrentOrder(state),
    getBalanceForToken: makeGetBalanceForToken(state),
    ...ownProps,
  }
}

const mapDispatchToProps: TakerOrderCardDispatchProps = {
  fetchDsProtocolPreTransferCheck,
  fillSwap,
  setGasLevel,
  fetchERC721OwnerOf,
  fetchERC721GetApproved: fetchERC721GetApprovedOverride,
  fetchERC1155BalanceOf,
  fetchERC1155IsApprovedForAll,
  checkComplianceServiceWhitelist,
}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
