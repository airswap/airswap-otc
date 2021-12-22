import React from 'react'

import { ValidationMessage, ValidationMessageVariant } from '../createValidatedValue'
import LengthValidator from './LengthValidator'
import RequiredValidator from './RequiredValidator'
import TokenAddressValidator from './TokenAddressValidator'
import TokenValidator from './TokenValidator'

export { LengthValidator, RequiredValidator, TokenAddressValidator, TokenValidator }

export type Validator<T> = (value: T | null) => ValidationMessage | null

export const formatValidationMessage = (
  message?: string,
  isRequired?: boolean,
  customMessage?: React.ReactNode,
): ValidationMessage => ({
  message,
  variant: isRequired ? ValidationMessageVariant.ERROR : ValidationMessageVariant.WARNING,
  customMessage,
})
