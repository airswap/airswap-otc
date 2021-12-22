import React from 'react'

import { TokenMetadata } from '../../types/models/Tokens'
import { TokenIconContainer, TokenImage, UnknownTokenIcon, UnknownTokenIconText } from './styles'

interface TokenIconProps {
  token: TokenMetadata
  size: number
  withShadow?: boolean
}

export default function TokenIcon(props: TokenIconProps) {
  const tokenImage = props.token.airswap_img_url

  return (
    <TokenIconContainer
      size={props.size}
      withShadow={props.withShadow}
      backgroundColor={tokenImage && props.token.colors && props.token.colors[0]}
    >
      {tokenImage ? (
        <TokenImage src={tokenImage} />
      ) : (
        <UnknownTokenIcon>
          <UnknownTokenIconText size={props.size}>
            {props.token.symbol ? props.token.symbol.charAt(0) : 'T'}
          </UnknownTokenIconText>
        </UnknownTokenIcon>
      )}
    </TokenIconContainer>
  )
}
