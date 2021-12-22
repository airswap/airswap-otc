import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { connect } from 'react-redux'

import { IntlObject } from '../../types/LocaleTypes'
import { TokenKind } from '../../types/models/Tokens'
import { ExpirationType } from '../../utils/numbers'
import { ValidatedValue } from '../validationComponents/createValidatedValue'

const { getTokensByAddress } = tokenSelectors

interface ReduxProps {
  tokensByAddress: Record<string, Record<string, any>>[]
}

interface PassedProps extends IntlObject {
  reverse(): void
  isWalletConnected: boolean
  // Maker
  makerTokenAddress: ValidatedValue<string>
  setMakerTokenAddress(address: string): void
  makerTokenId: string
  setMakerTokenId(tokenId: string): void
  makerParam: ValidatedValue<string>
  setMakerParam(value: string): void
  makerTokenKind: TokenKind
  setMakerTokenKind(tokenKind: TokenKind): void
  // Taker
  takerTokenAddress: ValidatedValue<string>
  setTakerTokenAddress(address: string): void
  takerTokenId: string
  setTakerTokenId(tokenId: string): void
  takerParam: ValidatedValue<string>
  setTakerParam(value: string): void
  takerTokenKind: TokenKind
  setTakerTokenKind(tokenKind: TokenKind): void
  takerWallet: ValidatedValue<string>
  setTakerWallet(address: string): void
  // Form
  orderExpiry: ValidatedValue<string>
  setOrderExpiry(expiration: string): void
  expirationType: ExpirationType
  setExpirationType(expirationType: ExpirationType): void
  onSubmit(): void
  onCancel?(): void
  isDoingENSLookup: boolean
  ensError?: string | null
}

export type BuildOrderFormProps = PassedProps & ReduxProps

const mapStateToProps = (state: any, ownProps): BuildOrderFormProps => ({
  tokensByAddress: getTokensByAddress(state),
  ...ownProps,
})

const mapDispatchToProps = {}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
