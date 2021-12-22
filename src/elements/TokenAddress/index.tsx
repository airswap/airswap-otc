import { openEtherscanLink } from 'airswap.js/src/utils/etherscan'
import React from 'react'

import { ReactComponent as ExternalLinkIcon } from '../../static/external-link-icon.svg'
import { condenseAddress } from '../../utils/transformations'
import { AddressText, Container, IconContainer } from './styles'

interface Props {
  address: string
  variant: 'good' | 'bad' | 'unknown'
  white?: boolean
  large?: boolean
}

export default function TokenAddress(props: Props) {
  const onClick = () => {
    openEtherscanLink(props.address, 'token')
  }

  return (
    <Container onClick={onClick} white={props.white}>
      <AddressText large={props.large} white={props.white}>
        {condenseAddress(props.address, false)}
      </AddressText>
      <IconContainer variant={props.variant} white={props.white}>
        <ExternalLinkIcon />
      </IconContainer>
    </Container>
  )
}
