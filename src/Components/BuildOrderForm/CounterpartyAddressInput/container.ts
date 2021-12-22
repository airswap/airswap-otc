import { selectors as ensSelectors } from 'airswap.js/src/ens/redux/reducers'
import { connect } from 'react-redux'

import { ValidationUIVariant } from '../../validationComponents/asValidationUI'
import { ValidatedValue } from '../../validationComponents/createValidatedValue'

const { getIsENSReady, getIsDoingENSLookup, getENSError } = ensSelectors

interface ReduxProps {
  tokensByAddress: Record<string, Record<string, any>>[]
  isENSReady: boolean
  isDoingENSLookup: boolean
  ensError?: string | null
}

interface PassedProps {
  iconColor?: string
  expand: boolean
  errorAlign: string
  value: ValidatedValue<string>
  onChange(value: string): void
  placeholder?: string
  colorVariant?: ValidationUIVariant
}

export type CounterpartyAddressInputProps = PassedProps & ReduxProps

const mapStateToProps = (state: any, ownProps): CounterpartyAddressInputProps => ({
  isENSReady: getIsENSReady(state),
  isDoingENSLookup: getIsDoingENSLookup(state),
  ensError: getENSError(state),
  ...ownProps,
})

const mapDispatchToProps = {}

export default Component => connect(mapStateToProps, mapDispatchToProps)(Component)
