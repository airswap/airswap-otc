import React from 'react'
import { FormattedMessage } from 'react-intl'

import Tooltip from '../../elements/Tooltip'
import { H7 } from '../../elements/Typography'
import { getFormattedNumber, willFormatNumber } from '../../utils/transformations'
import { AvailableAmount, AvailableForTradeContainer, AvailableForTradeText } from './styles'

interface AvailableForTradeProps {
  value: string
  locked: boolean
  symbol: string
  onClick(): void
}

export default function AvailableForTrade(props: AvailableForTradeProps) {
  const symbol = props.symbol === 'WETH' || props.symbol === 'ETH' ? 'ETH/WETH' : props.symbol

  const onClick = () => {
    if (props.locked) return
    props.onClick()
  }

  return (
    <AvailableForTradeContainer>
      {willFormatNumber(Number(props.value), 10, 4) ? (
        <Tooltip position="top" render={() => <H7 color="white">{`${props.value} ${symbol}`}</H7>}>
          <AvailableAmount onClick={onClick} locked={props.locked}>
            {`${getFormattedNumber(Number(props.value), 10, 4)} ${symbol}`}
          </AvailableAmount>
        </Tooltip>
      ) : (
        <AvailableAmount onClick={onClick} locked={props.locked}>{`${props.value} ${symbol}`}</AvailableAmount>
      )}
      <AvailableForTradeText>
        <FormattedMessage defaultMessage="available for trade" />
      </AvailableForTradeText>
    </AvailableForTradeContainer>
  )
}
