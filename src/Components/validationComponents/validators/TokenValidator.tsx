import React from 'react'
import { FormattedMessage } from 'react-intl'

import Button, { ButtonVariant } from '../../../elements/Button'
import { H6 } from '../../../elements/Typography'
import { formatValidationMessage, Validator } from './index'

// Placeholder validator for token validator
const TokenValidator = (isEnabled: boolean): Validator<string> => () => {
  if (isEnabled) return null

  const customMessage = (
    <H6 textAlign="left">
      <FormattedMessage defaultMessage="You must " />
      <Button variant={ButtonVariant.LINK}>
        <FormattedMessage defaultMessage="enable ast" />
      </Button>
      <FormattedMessage defaultMessage=" to create this order" />
    </H6>
  )
  return formatValidationMessage(undefined, false, customMessage)
}

export default TokenValidator
