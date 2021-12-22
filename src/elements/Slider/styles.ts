import styled from 'styled-components'

import { Flex } from '../Flex'

export const SliderContainer = styled(Flex)`
  width: 100%;
`

const sliderDotSize = 12
const sliderRailSize = 1

export const SliderInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: ${sliderRailSize}px;
  margin: ${(sliderDotSize - sliderRailSize) / 2}px 0;
  background: rgba(0, 0, 0, 0.1);
  outline: none;

  &::-moz-range-thumb {
    width: ${sliderDotSize}px;
    height: ${sliderDotSize}px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.palette.primaryColor};
    cursor: pointer;
  }

  &::-webkit-slider-thumb {
    width: ${sliderDotSize}px;
    height: ${sliderDotSize}px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.palette.primaryColor};
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }
`
