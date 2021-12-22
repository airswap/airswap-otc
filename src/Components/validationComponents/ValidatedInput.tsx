import React from 'react'

import Input, { InputProps } from '../../elements/Input'
import { Merge } from '../../utils/typeUtil'
import asValidationUI from './asValidationUI'
import { ValidatedValue, ValidationMessageVariant } from './createValidatedValue'
import withValidationAnimation from './withValidationAnimation'

interface ValidatedInputOverrides {
  value: ValidatedValue<string>
  disabledValue?: string
  liveValidation?: boolean
  onChange(value: string): void
}

type ValidatedInputProps = Merge<InputProps, ValidatedInputOverrides>

function ValidatedInput(props: ValidatedInputProps) {
  const { value, disabledValue, onChange, ...rest } = props

  const onValidatedInputChange = (changedValue: string) => {
    if (props.value.locked || props.disabled) return

    if (props.liveValidation && changedValue.length !== 0) {
      value.validate(changedValue)
    } else if (value.message && value.message.variant === ValidationMessageVariant.ERROR) {
      value.setMessage(null)
    }
    onChange(changedValue)
  }

  return (
    <Input
      disabled={props.disabled || value.locked}
      value={disabledValue || value.value}
      onChange={onValidatedInputChange}
      {...rest}
    />
  )
}

export default asValidationUI(withValidationAnimation(ValidatedInput))
