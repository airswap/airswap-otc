import { ETH_ADDRESS } from 'airswap.js/src/constants'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'
import Slider from '../../../elements/Slider'
import { H4, H7 } from '../../../elements/Typography'
import { TokenQuery } from '../../../types/models/Tokens'

const WethSliderHeader = styled(H4)`
  color: ${({ theme }) => theme.palette.primaryColor};
  margin-bottom: 30px;
`

const WethSliderContainer = styled(Flex)`
  position: relative;
  width: 100%;
`

const WethSliderLabelLeft = styled(Flex)`
  position: absolute;
  left: -20px;
  top: calc(100% + 10px);
  color: rgba(0, 0, 0, 0.25);
`

const WethSliderLabelRight = styled(Flex)`
  position: absolute;
  right: -20px;
  top: calc(100% + 10px);
  color: rgba(0, 0, 0, 0.25);
`

interface WethSliderProps {
  minimumWrapAmount: number
  userEthBalance: number
  value: number
  getDisplayByToken(tokenQuery: TokenQuery, tokenAmount: string): string
  onChange(value: number): void
}

export default function WethSlider(props: WethSliderProps) {
  return (
    <>
      <WethSliderHeader>
        <FormattedMessage
          defaultMessage="{amount} ETH"
          values={{ amount: props.getDisplayByToken({ address: ETH_ADDRESS }, `${props.value}`) }}
        />
      </WethSliderHeader>
      <WethSliderContainer>
        <Slider
          minValue={props.minimumWrapAmount}
          maxValue={props.userEthBalance}
          value={props.value}
          onChange={props.onChange}
        />
        <WethSliderLabelLeft>
          <H7 color="rgba(0, 0, 0, 0.25)">
            <FormattedMessage
              defaultMessage="{amount} ETH"
              values={{ amount: props.getDisplayByToken({ address: ETH_ADDRESS }, `${props.minimumWrapAmount}`) }}
            />
          </H7>
        </WethSliderLabelLeft>
        <WethSliderLabelRight>
          <H7 color="rgba(0, 0, 0, 0.25)">
            <FormattedMessage
              defaultMessage="{amount} ETH"
              values={{ amount: props.getDisplayByToken({ address: ETH_ADDRESS }, `${props.userEthBalance}`) }}
            />
          </H7>
        </WethSliderLabelRight>
      </WethSliderContainer>
    </>
  )
}
