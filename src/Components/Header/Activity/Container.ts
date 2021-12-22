import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux/'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'

import { selectors as makerOrdersSelectors } from '../../../state/orders'
import { hideOutstandingMakerOrder } from '../../../state/orders/actions'
import { TransactionActivity } from '../../../types/models/Activity'
import { SignedSimpleSwapOrderType } from '../../../types/models/Orders'
import { TokenKind } from '../../../types/models/Tokens'

const { getTokensByAddress, areTokensReady } = tokenSelectors
const { getConnectedWalletAddress } = walletSelectors
const { getMakerOrders, getFormattedOutstandingMakerOrders, getTransactionActivity } = makerOrdersSelectors

export interface ActivityItemProps {
  makerSymbol: string
  makerAmount: number
  makerId: number
  makerKind: string
  takerSymbol: string
  takerAmount: number
  takerId: number
  takerKind: string
}

export interface FinalizedActivityItemProps extends ActivityItemProps {
  txStatus: 'Confirmed' | 'Cancelled' | 'Failed' | 'Pending'
  txHash: string
  timestamp: number
  makerWallet?: string
  nonce: string | number
}

interface DispatchProps {
  hideOutstandingMakerOrder(order: SignedSimpleSwapOrderType): void
}

export interface OutstandingActivityItem extends ActivityItemProps {
  makerTokenKind: TokenKind
  takerTokenKind: TokenKind
  expiry: number
  orderCID: string
  signedOrder: SignedSimpleSwapOrderType
}

interface PassedProps {
  toggleRef: React.RefObject<HTMLDivElement>
  isOpen: boolean
  setIsOpen(isOpen: boolean): void
}

interface ReduxProps {
  makerOrders: {
    outstandingItems: OutstandingActivityItem[]
    finalizedItems: FinalizedActivityItemProps[]
  }
  transactionActivity: TransactionActivity[]
  connectedWalletAddress: string
  tokensByAddress: Record<string, Record<string, any>>[]
}

export type Props = PassedProps & ReduxProps & DispatchProps

const mapStateToProps = (state, ownProps) => {
  const walletAddress = getConnectedWalletAddress(state)
  const [, makerFills] = getMakerOrders(state)
  if (!areTokensReady(state)) return { outstandingItems: [], transactionActivity: [], ...ownProps }

  const finalizedItems: FinalizedActivityItemProps[] = []

  // orders that we created but our counterparty hasn't been submitted to be filled yet
  let outstandingItems: OutstandingActivityItem[] = getFormattedOutstandingMakerOrders(state)
  const expiredOutstandingItems: OutstandingActivityItem[] = []
  const nonExpiredOutstandingItems: OutstandingActivityItem[] = []
  outstandingItems.forEach(item => {
    if (Date.now() > item.signedOrder.expiry * 1000) {
      expiredOutstandingItems.push(item)
    } else {
      nonExpiredOutstandingItems.push(item)
    }
  })
  outstandingItems = nonExpiredOutstandingItems.reverse().concat(expiredOutstandingItems.reverse())

  // orders that we created and our counterparty filled them
  if (makerFills.length) {
    finalizedItems.push(...makerFills)
  }

  return {
    makerOrders: { outstandingItems, finalizedItems: finalizedItems.reverse() },
    transactionActivity: getTransactionActivity(state),
    connectedWalletAddress: walletAddress,
    tokensByAddress: getTokensByAddress(state),
    ...ownProps,
  }
}

const mapDispatchToProps = { hideOutstandingMakerOrder }

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
