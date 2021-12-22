import { getSwapTransactions } from 'airswap.js/src/swap/redux/contractTransactionSelectors'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'

import { IntlObject } from '../../../types/LocaleTypes'

const { getWalletAction } = walletSelectors

interface PassedProps {
  orderId: string
  isTransaction?: boolean
  onTransactionComplete?(): void
}
interface ReduxProps {
  isWalletSigning: boolean
  isSubmittingFillOrder: boolean
  errorSubmittingFillOrder: string
  errorMiningFillOrder: string
  isMiningFillOrder: boolean
  transactionHash: string
}

export type TransactionStatusProps = ReduxProps & IntlObject & PassedProps

const mapStateToProps = (state: any, ownProps) => {
  const walletAction = getWalletAction(state)
  const isWalletSigning = !!walletAction.actionType
  const swapTransactions = getSwapTransactions(state)
  const swapTransaction = swapTransactions[0]

  const isSubmittingFillOrder = swapTransaction ? swapTransaction.submitting : false
  const errorSubmittingFillOrder = swapTransaction ? swapTransaction.errorSubmitting : null
  const errorMiningFillOrder = swapTransaction ? swapTransaction.errorMining : null
  const isMiningFillOrder = swapTransaction ? swapTransaction.mining : false

  return {
    isWalletSigning,
    isSubmittingFillOrder,
    errorSubmittingFillOrder,
    errorMiningFillOrder,
    isMiningFillOrder,
    transactionHash: swapTransaction && swapTransaction.transaction ? swapTransaction.transaction.hash : null,
    ...ownProps,
  }
}

const mapDispatchToProps = {}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
