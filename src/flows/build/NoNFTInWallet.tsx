import React from 'react'
import { FormattedMessage } from 'react-intl'

import { NFTItemMetadata } from '../../types/models/Tokens'
import { AvailableForTradeContainer, AvailableForTradeText } from './styles'

interface NoNFTInWallet {
  token: NFTItemMetadata
}

export default function NoNFTInWallet(props: NoNFTInWallet) {
  return (
    <AvailableForTradeContainer>
      <AvailableForTradeText>
        <FormattedMessage
          defaultMessage="This wallet does not contain ${token} #${tokenId}"
          values={{ token: props.token.name, tokenid: props.token.id }}
        />
      </AvailableForTradeText>
    </AvailableForTradeContainer>
  )
}
