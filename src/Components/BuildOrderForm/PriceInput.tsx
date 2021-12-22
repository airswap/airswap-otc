import React, { useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Flex } from '../../elements/Flex'
import Input, { InputSize, InputVariant } from '../../elements/Input'
import { H6 } from '../../elements/Typography'

interface InputContainerProps {
  isFilled: boolean
}

const PriceInputContainer = styled(Flex).attrs({
  justify: 'center',
})<InputContainerProps>`
  color: white;
`

const InputContainer = styled(Flex).attrs({
  direction: 'row',
})<InputContainerProps>`
  width: auto;
  background-color: rgba(255, 255, 255, 0.05);
  min-width: 110px;
  padding: 0 20px;
  border-radius: 10px;
  height: 35px;
  transition: ${({ theme }) => theme.animation.defaultTransition}s;

  input {
    font-weight: ${({ theme }) => theme.text.fontWeight.medium};
    margin-right: 5px;
    color: ${({ isFilled }) => (isFilled ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.25)')};
  }
`

const PriceInputLabel = styled(H6)`
  width: auto;
  opacity: 0.5;
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};

  &:not(:last-child) {
    margin-right: 5px;
  }
`

const TokenLabel = styled.label<InputContainerProps>`
  width: auto;
  font-size: ${({ theme }) => theme.text.fontSize.h6};
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
  cursor: text;
  opacity: ${({ isFilled }) => (isFilled ? 0.5 : 0.25)};

  &:not(:last-child) {
    margin-right: 5px;
  }
`

interface PriceInputProps {
  baseTokenSymbol: string | null
  tokenSymbol: string | null
  value: string | null
  locked: boolean
  align?: 'flex-end' | 'flex-start' | 'center'
  onChange(value: string): void
}

export default function PriceInput(props: PriceInputProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputId = `price-input-${props.baseTokenSymbol}-${props.tokenSymbol}`

  const onChange = (value: string) => {
    if (props.locked) return
    props.onChange(value)
  }

  return (
    <Flex expand ref={containerRef} align={props.align}>
      <PriceInputContainer direction="row" isFilled={!!props.value}>
        <PriceInputLabel>{1}</PriceInputLabel>
        <PriceInputLabel>{props.baseTokenSymbol}</PriceInputLabel>
        <PriceInputLabel>
          <FormattedMessage defaultMessage="=" />
        </PriceInputLabel>
        <InputContainer isFilled={!!props.value}>
          <Input
            id={inputId}
            white
            expand
            disabled={props.locked}
            tabIndex={-1}
            noPadding
            dynamic
            minWidth={35}
            dynamicContainerRef={containerRef}
            textAlign="center"
            type="number"
            value={props.value}
            placeholder="0.00"
            onChange={onChange}
            variant={InputVariant.BLANK}
            size={InputSize.MEDIUM}
          />
          <TokenLabel isFilled={!!props.value} htmlFor={inputId}>
            {props.tokenSymbol}
          </TokenLabel>
        </InputContainer>
      </PriceInputContainer>
    </Flex>
  )
}
