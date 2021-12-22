import React, { useEffect, useState } from 'react'

import { ReactComponent as SwapIcon } from '../../static/swap-icon.svg'
import { ArrowContainer } from './styles'

export enum ArrowDirection {
  LEFT = 'left',
  RIGHT = 'right',
  DOWN = 'down',
  UP = 'up',
}

interface ArrowIconProps {
  direction: ArrowDirection
  color?: string
  isReverse?: boolean
  onClick?(): void
}

export default function ArrowIcon(props: ArrowIconProps) {
  const [rotate, setRotate] = useState<number>()

  useEffect(() => {
    if (rotate !== undefined) {
      setRotate(rotate + 180)
    }
  }, [props.isReverse])

  useEffect(() => {
    switch (props.direction) {
      case ArrowDirection.LEFT:
        return setRotate(180)
      case ArrowDirection.DOWN:
        return setRotate(90)
      case ArrowDirection.UP:
        return setRotate(270)
      case ArrowDirection.RIGHT:
      default:
        return setRotate(0)
    }
  }, [props.direction])

  return (
    <ArrowContainer
      color={props.color}
      rotate={rotate || 0}
      active={!!props.onClick}
      arrowDirection={props.direction}
      align="center"
      justify="center"
      onClick={props.onClick}
    >
      <SwapIcon />
    </ArrowContainer>
  )
}
