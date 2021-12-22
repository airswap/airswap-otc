import React, { useRef } from 'react'
import styled from 'styled-components'

import { Flex } from '../../elements/Flex'
import { InputSize, InputVariant } from '../../elements/Input'
import { HorizontalSpacer } from '../../elements/Spacer'
import { TokenKind } from '../../types/models/Tokens'
import { ValidatedValue } from '../validationComponents/createValidatedValue'
import ValidatedInput from '../validationComponents/ValidatedInput'
import SelectToken from './SelectToken'

interface ReversableProps {
  isReverse?: boolean
}

const SendReceiveInputContainer = styled(Flex).attrs({
  expand: true,
  align: 'center',
})<ReversableProps>`
  margin-bottom: 5px;
  flex-direction: ${({ isReverse }) => (isReverse ? 'row-reverse' : 'row')};

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    justify-content: center;
    flex-direction: row-reverse;
  }
`

const InputContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
})`
  width: auto;
  min-width: 100px;
  height: 65px;
`

interface SendReceiveInputProps {
  justify?: 'flex-start' | 'flex-end' | 'center'
  isReverse?: boolean
  showBalance?: boolean
  errorAlign: 'left' | 'right'
  showPriceInput: boolean
  value: ValidatedValue<string>
  onChange(value: string): void
  tokenAddress: ValidatedValue<string>
  onTokenAddressChange(value: string): void
  tokenId: string
  setTokenId(tokenId: string): void
  tokenKind: TokenKind
  setTokenKind(tokenKind: TokenKind): void
  tokensByAddress: Record<string, Record<string, any>>[]
  dataTest?: string
}

function SendReceiveInput(props: SendReceiveInputProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <SendReceiveInputContainer justify={props.justify} isReverse={props.isReverse} ref={containerRef}>
      <InputContainer>
        <ValidatedInput
          white
          expand
          dynamic
          noPadding
          disabled={props.tokenKind === TokenKind.ERC721}
          tabIndex={0}
          minWidth={100}
          type={props.tokenKind === TokenKind.ERC721 ? 'text' : 'number'}
          dynamicContainerRef={containerRef}
          errorOffset={props.showPriceInput ? 45 : 0}
          errorAlign={props.errorAlign}
          textAlign="center"
          size={InputSize.LARGE}
          variant={InputVariant.BLANK}
          placeholder="0.00"
          placeholderOpacity={0.25}
          opacity={props.tokenKind === TokenKind.ERC721 ? 0.5 : 1}
          dataTest={`${props.dataTest}-input`}
          value={props.value}
          disabledValue={props.tokenKind === TokenKind.ERC721 ? `#${props.value.value}` : undefined}
          onChange={props.onChange}
        />
      </InputContainer>
      <HorizontalSpacer units={4} />
      <SelectToken
        param={props.value}
        setParam={props.onChange}
        tokenAddress={props.tokenAddress}
        setTokenAddress={props.onTokenAddressChange}
        tokenId={props.tokenId}
        setTokenId={props.setTokenId}
        tokenKind={props.tokenKind}
        setTokenKind={props.setTokenKind}
        tokensByAddress={props.tokensByAddress}
        showBalance={props.showBalance}
        dataTest={`${props.dataTest}-token`}
      />
    </SendReceiveInputContainer>
  )
}

export default SendReceiveInput
