import React from 'react'

import { H6 } from '../../../elements/Typography'
import { IconContainer, MenuItemContainer } from './styles'

interface MenuItemProps {
  title: string
  stroke?: number
  onClick(): void
  icon: React.ComponentType
}

export default function MenuItem(props: MenuItemProps) {
  return (
    <MenuItemContainer onClick={props.onClick}>
      <IconContainer stroke={props.stroke}>
        <props.icon />
      </IconContainer>
      <H6 textAlign="left">{props.title}</H6>
    </MenuItemContainer>
  )
}
