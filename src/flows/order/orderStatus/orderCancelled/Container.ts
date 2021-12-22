import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { UserOrderRole } from '../..'
import { getCurrentOrder } from '../../../../state/orders/reducers'
import { IntlObject } from '../../../../types/LocaleTypes'
import { SignedSimpleSwapOrderType } from '../../../../types/models/Orders'
import { TokenQuery } from '../../../../types/models/Tokens'

const { getConnectedWalletAddress } = walletSelectors
const { getTokensByAddress, makeDisplayByToken, areTokensReady } = tokenSelectors

interface PassedProps {
  userOrderRole: UserOrderRole
  transactionHash?: string
}

interface ReduxProps {
  getDisplayByToken(tokenQuery: TokenQuery, tokenAmount: string): string
  tokensByAddress: Record<string, any>[]
  connectedWalletAddress: string
  order: SignedSimpleSwapOrderType
}

export type Props = PassedProps & ReduxProps & RouteComponentProps & IntlObject

const mapStateToProps = (state: any, ownProps): Props => {
  const isTokensReady = areTokensReady(state)
  return {
    getDisplayByToken: isTokensReady ? makeDisplayByToken(state) : {},
    tokensByAddress: isTokensReady ? getTokensByAddress(state) : {},
    connectedWalletAddress: getConnectedWalletAddress(state),
    order: getCurrentOrder(state),
    ...ownProps,
  }
}

const mapDispatchToProps = {}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
