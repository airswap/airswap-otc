import { addTokenMetadata } from 'airswap.js/src/tokens/redux/actions'
import { connect } from 'react-redux'

import { setCurrentOrder, setCurrentOrderFromIpfs } from '../../../state/orders/actions'
import { SignedSimpleSwapOrderType } from '../../../types/models/Orders'
import { TokenMetadata } from '../../../types/models/Tokens'

interface PassedProps {
  children: React.ReactNode
}

interface DispatchProps {
  setCurrentOrder(order: SignedSimpleSwapOrderType): void
  setCurrentOrderFromIpfs(orderCID: string): void
  addTokenMetadata(tokens: TokenMetadata[]): void
}

export type WidgetContextProps = PassedProps & DispatchProps

const mapStateToProps = (state, ownProps): WidgetContextProps => ownProps

const mapDispatchToProps = { setCurrentOrder, setCurrentOrderFromIpfs, addTokenMetadata }

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
