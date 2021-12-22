import React from 'react'
import styled from 'styled-components'

const LinkEl = styled.a`
  text-decoration-color: ${({ theme }) => theme.palette.primaryColor};
  color: ${({ theme }) => theme.palette.primaryColor};
  font-size: 14px;
`

interface Link {
  to: string
  children: React.ReactNode
}

export default function Link(props: Link) {
  return (
    <LinkEl href={props.to} target="_blank">
      {props.children}
    </LinkEl>
  )
}
