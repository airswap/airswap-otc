import React from 'react'
import MediaQuery from 'react-responsive'

const breakpoints = {
  sm: [0, 767],
  md: [768, 991],
  lg: [992, 1199],
  xl: [1200],
}

interface Props {
  children: React.ReactNode
  size: 'sm' | 'md' | 'lg' | 'xl' | 'md-down' | 'lg-down' | 'xl-down' | 'sm-up' | 'md-up' | 'lg-up'
}

const MediaQueryWrapper = ({ children, size }: Props) => {
  const baseSize = size.substring(0, 2)
  const modifier = size.length > 3 ? size.substring(3) : undefined
  const minWidth = modifier === 'down' ? breakpoints.sm[0] : breakpoints[baseSize][0]
  const maxWidth = modifier === 'up' ? breakpoints.xl[1] : breakpoints[baseSize][1]

  return (
    <MediaQuery minWidth={minWidth} maxWidth={maxWidth}>
      {children}
    </MediaQuery>
  )
}

export default MediaQueryWrapper
