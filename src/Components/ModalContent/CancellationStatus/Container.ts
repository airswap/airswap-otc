import { cancelSwap } from 'airswap.js/src/swap/redux/actions'
import { selectors as swapSelectors } from 'airswap.js/src/swap/redux/reducers'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { IntlObject } from '../../../types/LocaleTypes'
import { EthersOptions, SignedSimpleSwapOrderType } from '../../../types/models/Orders'

const {
  getSubmittingCancelSwap,
  getErrorSubmittingCancelSwap,
  getMiningCancelSwap,
  getTransactionsCancelSwap,
  getMinedCancelSwap,
  getTransactionReceiptsCancelSwap,
  getErrorMiningCancelSwap,
} = swapSelectors

const { getWalletAction } = walletSelectors

export interface PassedProps {
  signedOrder: SignedSimpleSwapOrderType
  orderCID: string
}

export interface CancellationStatusProps extends PassedProps, IntlObject, RouteComponentProps {
  isWalletSigningTx: boolean
  submittingCancelSwap: Record<string, any>
  errorSubmittingCancelSwap: Record<string, any>
  miningCancelSwap: Record<string, any>
  minedCancelSwap: Record<string, any>
  errorMiningCancelSwap: Record<string, any>
  transactionsCancelSwap: Record<string, any>
  transactionReceiptsCancelSwap: Record<string, any>
  cancelSwap(signedOrder: SignedSimpleSwapOrderType, options?: EthersOptions): void
}

const mapStateToProps = (state: any, ownProps): CancellationStatusProps => {
  const walletAction = getWalletAction(state)
  const isWalletSigningTx = walletAction && walletAction.actionType === 'sendTransaction'

  return {
    isWalletSigningTx,
    submittingCancelSwap: getSubmittingCancelSwap(state),
    errorSubmittingCancelSwap: getErrorSubmittingCancelSwap(state),
    miningCancelSwap: getMiningCancelSwap(state),
    minedCancelSwap: getMinedCancelSwap(state),
    errorMiningCancelSwap: getErrorMiningCancelSwap(state),
    transactionsCancelSwap: getTransactionsCancelSwap(state),
    transactionReceiptsCancelSwap: getTransactionReceiptsCancelSwap(state),
    ...ownProps,
  }
}

const mapDispatchToProps = { cancelSwap }

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
