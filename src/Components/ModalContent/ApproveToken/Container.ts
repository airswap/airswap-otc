import { SWAP_CONTRACT_ADDRESS } from 'airswap.js/src/constants'
import { selectors as balancesSelectors } from 'airswap.js/src/deltaBalances/redux'
import { selectors as erc20Selectors } from 'airswap.js/src/erc20/redux'
import { approveAirswapTokenSwap } from 'airswap.js/src/erc20/redux/actions'
import { selectors as erc721Selectors } from 'airswap.js/src/erc721/redux'
import { approveERC721, fetchERC721GetApprovedOverride } from 'airswap.js/src/erc721/redux/actions'
import { getERC1155IsApprovedForAll } from 'airswap.js/src/erc1155/redux/callDataSelectors'
import { submitERC1155SetApprovalForAll } from 'airswap.js/src/erc1155/redux/contractFunctionActions'
import { getERC1155SetApprovalForAllTransactions } from 'airswap.js/src/erc1155/redux/contractTransactionSelectors'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import _ from 'lodash'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { ERC721Query, ERC1155Query, TokenKind } from '../../../types/models/Tokens'
import { TransactionStatus } from '../../../types/models/Transaction'

const { getConnectedWalletAddress } = walletSelectors
const { getTokensByAddress } = tokenSelectors
const { getConnectedSwapApprovals } = balancesSelectors
const {
  getErrorMiningApproveToken,
  getErrorSubmittingApproveToken,
  getSubmittingApproveToken,
  getMiningApproveToken,
} = erc20Selectors

const { makeGetIsERC721Approved, makeGetERC721ApproveTransaction } = erc721Selectors

interface PassedProps {
  tokenAddress: string
  tokenId?: string
  tokenKind: TokenKind
}

interface ReduxProps {
  submittingApproveTokenMap: Record<string, any>
  miningApproveTokenMap: Record<string, any>
  errorSubmittingApproveTokenMap: Record<string, any>
  errorMiningApproveTokenMap: Record<string, any>

  erc1155ApproveTransaction: TransactionStatus
  erc721ApproveTransaction: TransactionStatus
  isERC721Approved: boolean
  isERC1155Approved: boolean

  connectedApprovals: Record<string, any>
  tokensByAddress: Record<string, any>
}

interface DispatchProps {
  approveAirswapToken(tokenAddress: string): void
  approveERC721(tokenAddress: string, tokenId: string): void
  fetchERC721GetApproved(query: ERC721Query): void
  submitERC1155SetApprovalForAll(query: ERC1155Query): void
}

export type ApproveTokenProps = PassedProps & ReduxProps & DispatchProps & RouteComponentProps

const mapStateToProps = (state: any, ownProps: PassedProps): ReduxProps & PassedProps => {
  const connectedWalletAddress = getConnectedWalletAddress(state)
  const getERC721ApproveTransaction = makeGetERC721ApproveTransaction(state)
  const getIsERC721Approved = makeGetIsERC721Approved(state)
  const isERC721Approved = getIsERC721Approved(ownProps.tokenAddress, ownProps.tokenId || '')
  const erc1155SetApprovalForAllTransactions = getERC1155SetApprovalForAllTransactions(state)
  const erc1155ApproveTransaction = _.find(erc1155SetApprovalForAllTransactions, {
    parameters: { contractAddress: ownProps.tokenAddress, operator: SWAP_CONTRACT_ADDRESS },
  })

  const erc1155Approval = _.find(getERC1155IsApprovedForAll(state), {
    parameters: {
      contractAddress: ownProps.tokenAddress,
      operator: SWAP_CONTRACT_ADDRESS,
      owner: connectedWalletAddress,
    },
  })

  return {
    submittingApproveTokenMap: getSubmittingApproveToken(state),
    miningApproveTokenMap: getMiningApproveToken(state),
    errorMiningApproveTokenMap: getErrorMiningApproveToken(state),
    errorSubmittingApproveTokenMap: getErrorSubmittingApproveToken(state),

    isERC1155Approved: erc1155Approval && erc1155Approval.response,
    isERC721Approved,
    erc1155ApproveTransaction,
    erc721ApproveTransaction: getERC721ApproveTransaction(ownProps.tokenAddress, ownProps.tokenId || ''),

    connectedApprovals: getConnectedSwapApprovals(state),
    tokensByAddress: getTokensByAddress(state),
    ...ownProps,
  }
}

const mapDispatchToProps: DispatchProps = {
  approveAirswapToken: approveAirswapTokenSwap,
  approveERC721,
  fetchERC721GetApproved: fetchERC721GetApprovedOverride,
  submitERC1155SetApprovalForAll,
}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
