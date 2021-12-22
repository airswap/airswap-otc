import { useState } from 'react'

import { Validator } from './validators'

export enum ValidationMessageVariant {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface ValidationMessage {
  message?: string
  customMessage?: React.ReactNode
  variant: ValidationMessageVariant
}

export interface ValidatedValue<T> {
  value: T | null
  locked: boolean
  message: ValidationMessage | null
  setLocked(locked: boolean): void
  setMessage(message: ValidationMessage | null): void
  validate(newValue?: T): ValidationMessage | null
}

export default function createValidatedValue<T>(
  validators?: Validator<T>[],
  defaultValue?: T | null,
): [ValidatedValue<T>, (value: T) => void] {
  const [value, setValue] = useState<T | null>(defaultValue || null)
  const [message, setMessage] = useState<ValidationMessage | null>(null)
  const [locked, setLocked] = useState<boolean>(false)

  const validate = (newValue?: T) => {
    if (validators) {
      const failingValidator = validators.find(validator => !!validator(newValue || value))
      const validatorMessage = failingValidator ? failingValidator(newValue || value) : null
      setMessage(validatorMessage)
      return validatorMessage
    }
    return null
  }

  const setValidatedValue = (newValue: T) => {
    setValue(newValue)
  }

  const validatedValue: ValidatedValue<T> = {
    value,
    locked,
    message,
    setLocked,
    setMessage,
    validate,
  }

  return [validatedValue, setValidatedValue]
}
