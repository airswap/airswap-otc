import React from 'react'

import theme from '../theme'

interface SpinnerProps {
  color?: string
  size?: number
  strokeWidth?: number
}

export default function Spinner(props: SpinnerProps) {
  const styles = {
    width: `${props.size || 100}px`,
    height: `${props.size || 100}px`,
    borderWidth: `${props.strokeWidth || 5}px`,
    borderColor: `${props.color || theme.palette.primaryColor}1A`,
    borderTopColor: `${props.color || theme.palette.primaryColor}`,
  }

  return <div className="airswap-spinner" style={styles} />
}
