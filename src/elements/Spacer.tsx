import React from 'react'
import styled from 'styled-components'

const spacing = (multiplier = 1) => {
  const unit = 5
  return `${unit * multiplier}px`
}

const VerticalSpace = styled.div<Props>`
  height: ${({ units }) => spacing(units)};
`

const HorizontalSpace = styled.div<Props>`
  width: ${({ units }) => spacing(units)};
`

interface Props {
  units: number
}

export const VerticalSpacer = ({ units }: Props) => <VerticalSpace units={units} />

export const HorizontalSpacer = ({ units }: Props) => <HorizontalSpace units={units} />
