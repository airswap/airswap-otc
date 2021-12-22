import React from 'react'
import styled from 'styled-components'

import { ValidatedValue, ValidationMessageVariant } from './createValidatedValue'

const Form = styled.form`
  width: 100%;
  /* height: 100%; */
`

interface ValidationFormProps {
  children: React.ReactNode
  validatedValues: ValidatedValue<any>[]
  onSubmit(): any
}

export default function ValidationForm(props: ValidationFormProps) {
  const onSubmit = (evt: React.FormEvent) => {
    evt.preventDefault()
    let formHasError
    props.validatedValues.forEach(validatedValue => {
      const message = validatedValue.validate()
      if (message && message.message && message.variant === ValidationMessageVariant.ERROR) {
        formHasError = true
      }
    })

    if (!formHasError) {
      props.onSubmit()
    }
  }

  return <Form onSubmit={onSubmit}>{props.children}</Form>
}
