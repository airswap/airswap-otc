import { selectors as balancesSelectors } from 'airswap.js/src/deltaBalances/redux'
import { selectors as erc20Selectors } from 'airswap.js/src/erc20/redux'
import { unwrapWeth, wrapWeth } from 'airswap.js/src/erc20/redux/actions'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'

import { TokenQuery } from '../../../types/models/Tokens'

const {
  getSubmittingUnwrapWeth,
  getMiningUnwrapWeth,
  getErrorSubmittingUnwrapWeth,
  getSubmittingWrapWeth,
  getMiningWrapWeth,
  getErrorSubmittingWrapWeth,
} = erc20Selectors

const { getConnectedBalances } = balancesSelectors

const {
  getIsWalletWrappingWeth,
  getIsWalletUnwrappingWeth,
  getWalletAction, // getWalletAction can indicate if we are currently waiting on a signature
} = walletSelectors

const { makeDisplayByToken } = tokenSelectors

export interface PassedProps {
  orderId: string
  minimumWrapAmount: string
  amount: number
  isWrap: boolean
}

export interface ReduxProps {
  isWalletSigningTx: boolean

  isWalletWrappingWeth: boolean
  isWalletUnwrappingWeth: boolean

  isSubmittingWrapWeth: boolean
  isSubmittingUnwrapWeth: boolean

  isMiningWrapWeth: boolean
  isMiningUnwrapWeth: boolean

  errorSubmittingWrapWeth: string
  errorSubmittingUnwrapWeth: string

  atomicBalances: Record<string, any>
  getDisplayByToken(tokenQuery: TokenQuery, tokenAmount: string): string
}

interface DispatchProps {
  wrapWeth(amount: string): void
  unwrapWeth(amount: string): void
}

export type WethModalProps = PassedProps & ReduxProps & DispatchProps

const mapStateToProps = (state: any, ownProps): WethModalProps => {
  const walletAction = getWalletAction(state)
  const isWalletSigningTx = walletAction && walletAction.actionType === 'sendTransaction'

  const getLatestStatus = statusObject => {
    if (statusObject) {
      const keys = Object.keys(statusObject)
      return statusObject[keys[keys.length - 1]]
    }
    return false
  }

  const submittingWrapWeth = getSubmittingWrapWeth(state)
  const isSubmittingWrapWeth = getLatestStatus(submittingWrapWeth)
  const submittingUnwrapWeth = getSubmittingUnwrapWeth(state)
  const isSubmittingUnwrapWeth = getLatestStatus(submittingUnwrapWeth)
  const miningWrapWeth = getMiningWrapWeth(state)
  const isMiningWrapWeth = getLatestStatus(miningWrapWeth)
  const miningUnwrapWeth = getMiningUnwrapWeth(state)
  const isMiningUnwrapWeth = getLatestStatus(miningUnwrapWeth)
  const allErrorSubmittingWrapWeth = getErrorSubmittingWrapWeth(state)
  const errorSubmittingWrapWeth = getLatestStatus(allErrorSubmittingWrapWeth)
  const allErrorSubmittingUnwrapWeth = getErrorSubmittingUnwrapWeth(state)
  const errorSubmittingUnwrapWeth = getLatestStatus(allErrorSubmittingUnwrapWeth)

  return {
    isWalletSigningTx,
    isWalletWrappingWeth: getIsWalletWrappingWeth(state),
    isWalletUnwrappingEth: getIsWalletUnwrappingWeth(state),
    isSubmittingWrapWeth,
    isSubmittingUnwrapWeth,
    isMiningWrapWeth,
    isMiningUnwrapWeth,
    errorSubmittingWrapWeth,
    errorSubmittingUnwrapWeth,
    atomicBalances: getConnectedBalances(state),
    getDisplayByToken: makeDisplayByToken(state),
    ...ownProps,
  }
}

const mapDispatchToProps = { wrapWeth, unwrapWeth }

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
