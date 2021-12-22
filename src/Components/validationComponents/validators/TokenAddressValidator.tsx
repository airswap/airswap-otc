import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { H9 } from '../../../elements/Typography'
import { ValidationMessageVariant } from '../createValidatedValue'
import { formatValidationMessage, Validator } from './index'

const CustomError = styled(H9)`
  opacity: 0.25;
`

const tokenAddressRegex = /^0x[a-fA-F0-9]{40}$/g

const TokenAddressValidator: Validator<string> = (value: string | null) => {
  const successObj = {
    message: '',
    variant: ValidationMessageVariant.SUCCESS,
  }

  if (!value) return null
  // if they are trying to look up an ENS name, it's valid
  if (value.includes('.eth')) return successObj

  if (value.indexOf('0x') !== 0) {
    return formatValidationMessage(
      'Invalid wallet address',
      true,
      <CustomError>
        <FormattedMessage defaultMessage="Token address must start with 0x or end with .eth" />
      </CustomError>,
    )
  }
  if (value.length !== 42) {
    return formatValidationMessage(
      'Invalid wallet address',
      true,
      <CustomError>
        <FormattedMessage defaultMessage="Token address must have 40 characters after 0x" />
      </CustomError>,
    )
  }

  if (!value.match(tokenAddressRegex)) {
    return formatValidationMessage(
      'Invalid wallet address',
      true,
      <CustomError>
        <FormattedMessage defaultMessage="Token address must only contain alphanumeric characters" />
      </CustomError>,
    )
  }

  return successObj
}

export default TokenAddressValidator
