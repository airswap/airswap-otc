import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import DisplayLabel from '../../elements/DisplayLabel'
import Dropdown, { DropdownItem } from '../../elements/Dropdown'
import { InputSize, InputVariant } from '../../elements/Input'
import MediaQuery from '../../elements/MediaQueryWrapper'
import { H7 } from '../../elements/Typography'
import { ReactComponent as ClockIcon } from '../../static/clock-icon.svg'
import theme from '../../theme'
import { ExpirationMultiplier, ExpirationType, formatExpirationFromDate } from '../../utils/numbers'
import useInterval from '../../utils/useInterval'
import { ValidationUIVariant } from '../validationComponents/asValidationUI'
import { ValidatedValue } from '../validationComponents/createValidatedValue'
import ValidatedInput from '../validationComponents/ValidatedInput'
import {
  ExpirationSelectorContainer,
  ExpirationTypeLabel,
  ExpiresInLabel,
  FixedExpirationSelectorContainer,
  IconContainer,
  InputContainer,
} from './styles'

interface ExpirationSelectorProps {
  iconColor?: string
  expirationValue: ValidatedValue<string>
  selectedExpirationType: ExpirationType
  setExpirationValue(expirationValue: string): void
  onSelectExpirationType(expirationType: ExpirationType): void
}

export default function ExpirationSelector(props: ExpirationSelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [expirationString, setExpirationString] = useState<string>('')

  const selectExpirationType = (expirationType: ExpirationType) => () => {
    props.onSelectExpirationType(expirationType)
    setDropdownOpen(false)
  }

  const getExpirationTypeLabel = (expirationType: string) => {
    if (props.expirationValue.value && Number(props.expirationValue.value) > 1) {
      return ExpirationType[expirationType as ExpirationType]
    }
    return ExpirationType[expirationType as ExpirationType].slice(0, -1)
  }

  const isExpirationImminent = () => {
    if (props.expirationValue.value && Number(props.expirationValue.value)) {
      const remaining = Number(props.expirationValue.value) - Date.now() / 1000
      return remaining < ExpirationMultiplier[ExpirationType.MINUTES] * 5
    }
    return false
  }

  useInterval(() => {
    setExpirationString(
      formatExpirationFromDate(
        props.expirationValue.value && Number(props.expirationValue.value)
          ? Number(props.expirationValue.value) || 0
          : 0,
      ),
    )
  }, 1000)

  if (props.expirationValue.locked) {
    const isExpired = expirationString === 'Expired'

    return (
      <FixedExpirationSelectorContainer>
        <DisplayLabel expand colorVariant={isExpired ? ValidationUIVariant.ERROR : ValidationUIVariant.DEFAULT}>
          <H7
            weight={theme.text.fontWeight.medium}
            color={isExpired || isExpirationImminent() ? theme.palette.errorColor : theme.palette.primaryColor}
            opacity={expirationString === 'Expired' ? 0.5 : 1}
          >
            {expirationString}
          </H7>
        </DisplayLabel>
      </FixedExpirationSelectorContainer>
    )
  }

  return (
    <ExpirationSelectorContainer>
      <IconContainer color={props.iconColor}>
        <ClockIcon width="24px" />
      </IconContainer>
      <ExpiresInLabel>
        <FormattedMessage defaultMessage="Expires in" />
      </ExpiresInLabel>
      <InputContainer>
        <ValidatedInput
          expand
          noPadding
          type="number"
          pattern="^\d*[1-9]\d*$"
          textAlign="center"
          size={InputSize.SMALL}
          variant={InputVariant.UNDERLINE}
          value={props.expirationValue}
          onChange={props.setExpirationValue}
        />
      </InputContainer>
      <Dropdown isOpen={dropdownOpen} setIsOpen={setDropdownOpen}>
        {Object.keys(ExpirationType).map(expirationType => (
          <DropdownItem
            key={`dropdown-item-${expirationType}`}
            dropdownOpen={dropdownOpen}
            isSelected={ExpirationType[expirationType] === props.selectedExpirationType}
            onSelect={selectExpirationType(ExpirationType[expirationType])}
          >
            <MediaQuery size="sm">
              <ExpirationTypeLabel isOpen={dropdownOpen} textAlign="center">
                {getExpirationTypeLabel(expirationType)}
              </ExpirationTypeLabel>
            </MediaQuery>
            <MediaQuery size="md-up">
              <ExpirationTypeLabel textAlign="left">{getExpirationTypeLabel(expirationType)}</ExpirationTypeLabel>
            </MediaQuery>
          </DropdownItem>
        ))}
      </Dropdown>
    </ExpirationSelectorContainer>
  )
}
