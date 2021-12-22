import React from 'react'

import { ValidatedValue, ValidationMessageVariant } from './createValidatedValue'
import { ValidationElementContainer, ValidationErrors, ValidationUICustomError, ValidationUIError } from './styles'

export enum ValidationUIVariant {
  DEFAULT = 'default',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

interface ValidationUIRequires {
  value: ValidatedValue<any>
  expand?: boolean
  errorAlign?: 'left' | 'center' | 'right'
  errorOffset?: number
}

interface ValidationUIProvides {
  colorVariant?: ValidationUIVariant
}

function asValidationUI<T extends ValidationUIRequires>(
  Component: React.ComponentType<T & ValidationUIProvides>,
): React.ComponentType<T & ValidationUIRequires> {
  return (props: T) => {
    let colorVariant = ValidationUIVariant.DEFAULT

    if (props.value.message) {
      switch (props.value.message.variant) {
        case ValidationMessageVariant.ERROR:
          colorVariant = ValidationUIVariant.ERROR
          break
        case ValidationMessageVariant.WARNING:
          colorVariant = ValidationUIVariant.WARNING
          break
        case ValidationMessageVariant.SUCCESS:
          colorVariant = ValidationUIVariant.SUCCESS
          break
        default:
          break
      }
    }

    return (
      <ValidationElementContainer expand={props.expand}>
        <Component colorVariant={colorVariant} {...props} />
        <ValidationErrors errorOffset={props.errorOffset} errorAlign={props.errorAlign}>
          {props.value.message && props.value.message.message && (
            <ValidationUIError variant={colorVariant}>{props.value.message.message}</ValidationUIError>
          )}
          {props.value.message && props.value.message.customMessage && (
            <ValidationUICustomError>{props.value.message.customMessage}</ValidationUICustomError>
          )}
        </ValidationErrors>
      </ValidationElementContainer>
    )
  }
}

export default asValidationUI
