import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'
import { H6 } from '../../../elements/Typography'

const PriceLabelContainer = styled(Flex)`
  color: white;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0 10px;
  border-radius: 10px;
  height: 35px;
`

const PriceLabelContent = styled(H6)`
  opacity: 0.25;
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
  margin-right: 5px;
`

const PriceLabelItem = styled(H6)`
  width: auto;
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
  opacity: 0.25;

  &:not(:last-child) {
    margin-right: 10px;
  }
`

interface PriceLabelProps {
  baseTokenSymbol: string | null
  tokenSymbol: string | null
  value: number
}

export default function PriceLabel(props: PriceLabelProps) {
  return (
    <PriceLabelContainer direction="row">
      <PriceLabelItem>
        <FormattedMessage defaultMessage="1" />
      </PriceLabelItem>
      <PriceLabelItem>{props.baseTokenSymbol}</PriceLabelItem>
      <PriceLabelItem>
        <FormattedMessage defaultMessage="=" />
      </PriceLabelItem>
      <PriceLabelContent>{props.value}</PriceLabelContent>
      <PriceLabelItem>{props.tokenSymbol}</PriceLabelItem>
    </PriceLabelContainer>
  )
}
