import React from 'react'

import DisplayLabel, { DisplayLabelProps } from '../../elements/DisplayLabel'
import { Merge } from '../../utils/typeUtil'
import asValidationUI from './asValidationUI'
import { ValidatedValue } from './createValidatedValue'

interface ValidatedDisplayLabelOverrides {
  value: ValidatedValue<string>
}

type ValidatedDisplayLabelProps = Merge<DisplayLabelProps, ValidatedDisplayLabelOverrides>

function ValidatedDisplayLabel(props: ValidatedDisplayLabelProps) {
  const { value, ...rest } = props

  return <DisplayLabel value={value.value || ''} {...rest} />
}

export default asValidationUI(ValidatedDisplayLabel)
