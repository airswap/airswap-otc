import { selectors as balancesSelectors } from 'airswap.js/src/deltaBalances/redux'
import { selectors as erc20Selectors } from 'airswap.js/src/erc20/redux'
import { unwrapWeth } from 'airswap.js/src/erc20/redux/actions'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { UserOrderRole } from '../..'
import { getCurrentOrder } from '../../../../state/orders/reducers'
import { IntlObject } from '../../../../types/LocaleTypes'
import { SignedSimpleSwapOrderType } from '../../../../types/models/Orders'
import { TokenQuery } from '../../../../types/models/Tokens'
import { makeFindMatchingSwapFill } from '../../Container'

const { getSubmittingUnwrapWeth, getMiningUnwrapWeth, getErrorSubmittingUnwrapWeth } = erc20Selectors

const { getIsWalletUnwrappingWeth, getConnectedWalletAddress } = walletSelectors
const { makeAtomicByToken, getTokensByAddress, makeDisplayByToken } = tokenSelectors
const { getConnectedSwapApprovals, getConnectedBalances } = balancesSelectors

interface PassedProps {
  transactionHash?: string
}

interface ReduxProps extends RouteComponentProps, IntlObject {
  getDisplayByToken(tokenQuery: TokenQuery, tokenAmount: string): string
  getAtomicByToken(tokenQuery: TokenQuery, tokenAmount: string): string
  atomicBalances: Record<string, any>
  tokensByAddress: Record<string, any>[]
  userOrderRole: UserOrderRole
  connectedApprovals: Record<string, any>
  connectedWalletAddress: string
  isWalletUnwrappingWeth: boolean
  isSubmittingUnwrapWeth: boolean
  isMiningUnwrapWeth: boolean
  errorSubmittingUnwrapWeth: string
  currentOrder: SignedSimpleSwapOrderType
  filledOrder: SignedSimpleSwapOrderType | null
}

export interface DispatchProps {
  unwrapWeth(amount: string): void
}

export type Props = PassedProps & ReduxProps & DispatchProps & RouteComponentProps & IntlObject

const mapStateToProps = (state: any, ownProps): ReduxProps => {
  const submittingUnwrapWeth = getSubmittingUnwrapWeth(state)
  const isSubmittingUnwrapWeth = submittingUnwrapWeth
    ? submittingUnwrapWeth[Object.keys(submittingUnwrapWeth)[0]]
    : false
  const miningUnwrapWeth = getMiningUnwrapWeth(state)
  const isMiningUnwrapWeth = miningUnwrapWeth ? miningUnwrapWeth[Object.keys(miningUnwrapWeth)[0]] : false
  const allErrorSubmittingUnwrapWeth = getErrorSubmittingUnwrapWeth(state)
  const errorSubmittingUnwrapWeth = allErrorSubmittingUnwrapWeth
    ? allErrorSubmittingUnwrapWeth[Object.keys(allErrorSubmittingUnwrapWeth)[0]]
    : null
  const currentOrder = getCurrentOrder(state)
  const getFindMatchingSwapFill = makeFindMatchingSwapFill(state)
  const filledOrder = getFindMatchingSwapFill(currentOrder).values

  return {
    getDisplayByToken: makeDisplayByToken(state),
    getAtomicByToken: makeAtomicByToken(state),
    atomicBalances: getConnectedBalances(state),
    tokensByAddress: getTokensByAddress(state),
    connectedWalletAddress: getConnectedWalletAddress(state),
    isWalletUnwrappingWeth: getIsWalletUnwrappingWeth(state),
    connectedApprovals: getConnectedSwapApprovals(state),
    isSubmittingUnwrapWeth,
    isMiningUnwrapWeth,
    errorSubmittingUnwrapWeth,
    currentOrder,
    filledOrder,
    ...ownProps,
  }
}

const mapDispatchToProps: DispatchProps = { unwrapWeth }

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
