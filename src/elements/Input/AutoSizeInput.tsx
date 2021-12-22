import React from 'react'

import { ValidationUIVariant } from '../../Components/validationComponents/asValidationUI'
import { InputSize, InputVariant } from './index'
import { BaseInput, BlankInput, UnderlineInput } from './styles'

interface AutoSizeInputProps {
  value: string | null
  initialWidth?: string
  type?: 'text' | 'number'
  textAlign?: 'left' | 'center' | 'right'
  noPadding?: boolean
  variant?: InputVariant
  size?: InputSize
  white?: boolean
  autoFocus?: boolean
  colorVariant?: ValidationUIVariant
  placeholder?: string
  onChange(value: string): void
  onFocus?(): void
  onBlur?(): void
}

export default function AutoSizeInput(props: AutoSizeInputProps) {
  let InputEl

  switch (props.variant) {
    case InputVariant.UNDERLINE:
      InputEl = UnderlineInput
      break
    case InputVariant.BLANK:
      InputEl = BlankInput
      break
    case InputVariant.DEFAULT:
    default:
      InputEl = BaseInput
      break
  }

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    props.onChange(evt.target.value)
  }

  return (
    <>
      <InputEl
        white={props.white}
        autoFocus={props.autoFocus}
        size={props.size || InputSize.MEDIUM}
        type={props.type || 'text'}
        textAlign={props.textAlign}
        noPadding={props.noPadding}
        value={props.value || ''}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onChange={onChange}
        placeholder={props.placeholder}
      />
    </>
  )
}
