import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'
import Input, { InputSize, InputVariant } from '../../../elements/Input'
import { ReactComponent as CheckIcon } from '../../../static/check-icon.svg'
import { ReactComponent as UserIcon } from '../../../static/user-icon.svg'
import asValidationUI, { ValidationUIVariant } from '../../validationComponents/asValidationUI'
import { ValidationMessageVariant } from '../../validationComponents/createValidatedValue'
import { formatValidationMessage } from '../../validationComponents/validators'
import Container, { CounterpartyAddressInputProps } from './container'

interface ContainerProps {
  colorVariant?: ValidationUIVariant
}

const ContainerDiv = styled(Flex).attrs({
  expand: true,
  direction: 'row',
  align: 'center',
})<ContainerProps>`
  position: relative;
  margin-right: 60px;
  padding: 10px;
  padding-right: 15px;
  max-width: 450px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-color: ${({ colorVariant, theme }) => {
    switch (colorVariant) {
      case ValidationUIVariant.ERROR:
        return theme.palette.errorColor
      case ValidationUIVariant.WARNING:
        return theme.palette.warningColor
      case ValidationUIVariant.SUCCESS:
        return theme.palette.successColor
      case ValidationUIVariant.DEFAULT:
      default:
        return 'rgba(0, 0, 0, 0.10)'
    }
  }};
  transition: ${({ theme }) => theme.animation.defaultTransition}s;

  input {
    height: 22px;
  }
  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    max-width: 100%;
  }
`

interface IconContainerProps {
  color?: string
}

const IconContainer = styled(Flex)<IconContainerProps>`
  margin-right: 20px;

  svg {
    height: 20px;

    path {
      fill: ${({ color, theme }) => color || theme.palette.primaryColor};
      /* This is weird, ignore */
      stroke-width: 0px;
    }
  }
`

interface VisibleProps {
  isVisible: boolean
}

const CheckIconContainer = styled(Flex)<VisibleProps>`
  position: absolute;
  right: 0;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: ${({ theme }) => theme.animation.defaultTransition}s;

  svg {
    width: 15px;
    height: 15px;

    path {
      stroke: ${({ theme }) => theme.palette.successColor};
    }
  }
`

function CounterpartyAddressInput(props: CounterpartyAddressInputProps) {
  const onChange = (newValue: string) => {
    if (props.value.locked) return

    if (newValue.length !== 0) {
      props.value.validate(newValue)
    } else {
      props.value.setMessage(null)
    }
    props.onChange(newValue)
  }

  useEffect(() => {
    if (props.ensError) {
      // props.value.validate(props.value.value || '', { forceFail: true, forceFailMessage: props.ensError || '' })
      props.value.setMessage(formatValidationMessage(props.ensError, true))
    } else if (props.ensError === null) {
      props.value.validate(props.value.value || '')
    }
  }, [props.ensError, props.isDoingENSLookup])

  const isMessageValid = !!(props.value.message && props.value.message.variant === ValidationMessageVariant.SUCCESS)

  return (
    <ContainerDiv colorVariant={props.colorVariant}>
      <IconContainer color={props.iconColor}>
        <UserIcon />
      </IconContainer>
      <Input
        noPadding
        expand
        disabled={props.value.locked}
        spellCheck="false"
        size={InputSize.SMALL}
        variant={InputVariant.BLANK}
        placeholder={props.placeholder}
        value={props.value.value}
        dataTest="build-order-form-counterparty-input"
        onChange={onChange}
      />
      <CheckIconContainer isVisible={isMessageValid && !props.ensError && !props.isDoingENSLookup}>
        <CheckIcon />
      </CheckIconContainer>
    </ContainerDiv>
  )
}

export default asValidationUI(Container(CounterpartyAddressInput))
