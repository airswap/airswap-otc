import React from 'react'
import { FormattedMessage } from 'react-intl'

import asValidationUI from '../../../../Components/validationComponents/asValidationUI'
import { ValidatedValue } from '../../../../Components/validationComponents/createValidatedValue'
import Button, { ButtonVariant } from '../../../../elements/Button'
import Spinner from '../../../../elements/Spinner'
import { H5 } from '../../../../elements/Typography'
import { ReactComponent as CheckIcon } from '../../../../static/check-icon.svg'
import theme from '../../../../theme'
import { DisplayLabelContainer } from './styles'

export enum UnwrapState {
  DEFAULT,
  UNWRAPPING,
  UNWRAPPED,
}

export interface UnwrapDisplayLabelProps {
  value: ValidatedValue<string>
  unwrapState: UnwrapState
  unwrap(): void
}

function UnwrapDisplayLabel(props: UnwrapDisplayLabelProps) {
  const unwrapAction = () => {
    switch (props.unwrapState) {
      case UnwrapState.UNWRAPPING:
        return <Spinner size={20} strokeWidth={3} color="#ffffff" />
      case UnwrapState.UNWRAPPED:
        return <CheckIcon />
      case UnwrapState.DEFAULT:
      default:
        return (
          <Button variant={ButtonVariant.LINK} onClick={props.unwrap}>
            <FormattedMessage defaultMessage="Unwrap" />
          </Button>
        )
    }
  }
  return (
    <DisplayLabelContainer>
      <H5 textAlign="left" display="inline-flex" weight={theme.text.fontWeight.medium}>
        {props.value.value}
      </H5>
      {unwrapAction()}
    </DisplayLabelContainer>
  )
}

export default asValidationUI<UnwrapDisplayLabelProps>(UnwrapDisplayLabel)
