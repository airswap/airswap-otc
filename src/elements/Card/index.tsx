import React from 'react'

import MediaQuery from '../MediaQueryWrapper'
import { CardContainer, CardContent, CardShadow } from './styles'

interface CardProps {
  children?: React.ReactNode
}

function Card({ children }: CardProps) {
  return (
    <CardContainer>
      <CardContent>{children}</CardContent>
      <MediaQuery size="md-up">
        <CardShadow />
      </MediaQuery>
    </CardContainer>
  )
}

export default Card
