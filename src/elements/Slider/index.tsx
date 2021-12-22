import React, { FormEvent } from 'react'

import { SliderContainer, SliderInput } from './styles'

interface SliderProps {
  minValue: number
  maxValue: number
  value: number
  onChange(value: number): void
}

export default function Slider(props: SliderProps) {
  const onInput = (evt: FormEvent<HTMLInputElement>) => {
    props.onChange(Number(evt.currentTarget.value))
  }

  return (
    <SliderContainer>
      <SliderInput type="range" min={props.minValue} max={props.maxValue} value={props.value} onInput={onInput} />
    </SliderContainer>
  )
}
