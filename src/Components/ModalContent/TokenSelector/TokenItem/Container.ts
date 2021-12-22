import { selectors as balancesSelectors } from 'airswap.js/src/deltaBalances/redux'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'

import { TokenMetadata, TokenQuery } from '../../../../types/models/Tokens'

const { getConnectedWalletAddress } = walletSelectors
const { getAirSwapApprovedTokensBySymbol, getAirSwapApprovedTokensByAddress, makeDisplayByToken } = tokenSelectors
const { getConnectedBalances } = balancesSelectors

interface PassedProps {
  token: TokenMetadata
  id?: string
  showBalance?: boolean
  dataTest?: string
  isFocused: boolean
  onSelect(): void
}

interface ReduxProps {
  connectedWalletAddress: string
  atomicBalances: Record<string, any>
  tokenVariant: 'good' | 'bad' | 'unknown'
  getDisplayByToken: (tokenQuery: TokenQuery, tokenAmount: string) => string
}

export type TokenItemProps = PassedProps & ReduxProps

const mapStateToProps = (state, ownProps: PassedProps) => {
  const airswapApprovedTokensByAddress = getAirSwapApprovedTokensByAddress(state)
  const airswapApprovedTokensBySymbol = getAirSwapApprovedTokensBySymbol(state)

  let tokenVariant
  if (airswapApprovedTokensByAddress[ownProps.token.address]) {
    tokenVariant = 'good'
  } else if (airswapApprovedTokensBySymbol[ownProps.token.symbol]) {
    tokenVariant = 'bad'
  } else {
    tokenVariant = 'unknown'
  }

  return {
    tokenVariant,
    connectedWalletAddress: getConnectedWalletAddress(state),
    atomicBalances: getConnectedBalances(state),
    getDisplayByToken: makeDisplayByToken(state),
    ...ownProps,
  }
}

const mapDispatchToProps = {}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
