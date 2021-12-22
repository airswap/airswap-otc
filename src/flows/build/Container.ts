import { selectors as balancesSelectors } from 'airswap.js/src/deltaBalances/redux'
import { addTrackedAddress } from 'airswap.js/src/deltaBalances/redux/actions'
import { fetchDsProtocolPreTransferCheck } from 'airswap.js/src/dsProtocol/redux/contractFunctionActions'
import { findAddressByENSName } from 'airswap.js/src/ens/redux/actions'
import { selectors as ensSelectors } from 'airswap.js/src/ens/redux/reducers'
import { checkComplianceServiceWhitelist } from 'airswap.js/src/erc1155/redux/actions'
import {
  fetchERC1155BalanceOf,
  fetchERC1155IsApprovedForAll,
} from 'airswap.js/src/erc1155/redux/contractFunctionActions'
import { signSwap } from 'airswap.js/src/swap/redux/actions'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { addOutstandingMakerOrder } from '../../state/orders/actions'
import { makeGetBalanceForToken } from '../../state/selectors'
import { IntlObject } from '../../types/LocaleTypes'
import { ComplianceServiceWhitelistQuery } from '../../types/models/ERC1155'
import { Order, SignedSimpleSwapOrderType } from '../../types/models/Orders'
import { PreTransferCheckPayload } from '../../types/models/Security'
import { ERC1155Query, TokenQuery } from '../../types/models/Tokens'

const { makeAtomicByToken, getTokensBySymbol, getTokensByAddress, makeDisplayByToken } = tokenSelectors
const { getTrackedTokensByAddress, getConnectedSwapApprovals, getConnectedBalances } = balancesSelectors
const { getConnectedWalletAddress, getWalletConnectionError } = walletSelectors
const { getIsENSReady, getIsDoingENSLookup, getENSError, getENSAddressesByName } = ensSelectors

interface ReduxProps {
  tokensBySymbol: Record<string, Record<string, any>>[]
  tokensByAddress: Record<string, Record<string, any>>[]
  atomicBalances: Record<string, any>
  trackedTokensByAddress: Record<string, any>
  connectedApprovals: Record<string, any>
  connectedWalletAddress: string
  walletConnectionError?: string
  isENSReady: boolean
  isDoingENSLookup: boolean
  ensError?: string | null
  ensAddressesByName: Record<string, any>
  getBalanceForToken(walletAddress: string, tokenAddress: string, combine?: boolean): string
  getAtomicByToken(tokenQuery: TokenQuery, tokenAmount: string): string
  getDisplayByToken(tokenQuery: TokenQuery, tokenAmount: string): string
}

export interface DispatchProps {
  addTrackedAddress(value): void
  signOrder(order: Order): Promise<SignedSimpleSwapOrderType>
  addOutstandingMakerOrder(signedOrder: SignedSimpleSwapOrderType): void
  findAddressByENSName(string): void
  fetchDsProtocolPreTransferCheck(payload: PreTransferCheckPayload): void
  fetchERC1155BalanceOf(query: ERC1155Query): void
  fetchERC1155IsApprovedForAll(query: ERC1155Query): void
  checkComplianceServiceWhitelist(query: ComplianceServiceWhitelistQuery): void
}

type PassedProps = RouteComponentProps

const mapStateToProps = (state: any, ownProps): ReduxProps & PassedProps => {
  return {
    getBalanceForToken: makeGetBalanceForToken(state),
    tokensBySymbol: getTokensBySymbol(state),
    tokensByAddress: getTokensByAddress(state),
    atomicBalances: getConnectedBalances(state),
    trackedTokensByAddress: getTrackedTokensByAddress(state),
    walletConnectionError: getWalletConnectionError(state),
    connectedWalletAddress: getConnectedWalletAddress(state),
    connectedApprovals: getConnectedSwapApprovals(state),
    getAtomicByToken: makeAtomicByToken(state),
    getDisplayByToken: makeDisplayByToken(state),
    isENSReady: getIsENSReady(state),
    isDoingENSLookup: getIsDoingENSLookup(state),
    ensError: getENSError(state),
    ensAddressesByName: getENSAddressesByName(state),
    ...ownProps,
  }
}

const mapDispatchToProps: DispatchProps = {
  addTrackedAddress,
  signOrder: signSwap,
  addOutstandingMakerOrder,
  findAddressByENSName,
  fetchDsProtocolPreTransferCheck,
  fetchERC1155BalanceOf,
  fetchERC1155IsApprovedForAll,
  checkComplianceServiceWhitelist,
}

export type MakerOrderCardProps = ReduxProps & PassedProps & IntlObject & DispatchProps

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
