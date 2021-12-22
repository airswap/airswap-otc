import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { TooltipPortal } from '../Components/portals/Popover'
import { useDebouncedCallback } from '../utils/useDebounce'
import { Flex } from './Flex'

interface TooltipProps {
  expand?: boolean
  children: React.ReactNode
  render: Function
  position: 'bottom' | 'bottom-left' | 'bottom-right' | 'top' | 'top-left' | 'top-right'
}

interface TooltipState {
  tooltipVisible: boolean
  coordinates: number[]
}

const TooltipContent = styled(Flex)`
  flex-shrink: 0;
`

const TooltipWrapper = styled(Flex)`
  font-size: 11px;
  color: white;
  padding: ${({ theme }) => theme.spacing(2)};
  max-width: 350px;
`

export default function Tooltip(props: TooltipProps) {
  const tooltipToggleRef = useRef<HTMLDivElement>(null)
  const tooltipPortalRef = useRef<HTMLDivElement>(null)
  const showTooltipTimeout = useRef<number>()
  const hideTooltipTimeout = useRef<number>()
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false)
  const [coordinates, setCoordinates] = useState<number[]>([])

  const forceHideTooltip = useDebouncedCallback(() => {
    setTooltipVisible(false)
  })

  useEffect(() => {
    if (tooltipVisible) {
      document.addEventListener('scroll', forceHideTooltip, true)
    }

    return () => {
      document.removeEventListener('scroll', forceHideTooltip, true)
    }
  }, [])

  const hideTooltip = () => {
    clearTimeout(showTooltipTimeout.current)
    if (!tooltipVisible) return
    hideTooltipTimeout.current = setTimeout(() => {
      setTooltipVisible(false)
    }, 300)
  }

  const showTooltip = (e: { currentTarget: { getBoundingClientRect: Function } }) => {
    clearTimeout(hideTooltipTimeout.current)
    if (tooltipVisible) return

    const target = e.currentTarget

    showTooltipTimeout.current = setTimeout(() => {
      const { top, right, bottom, left } = target.getBoundingClientRect()
      const clientX = Math.floor((left + right) / 2)
      let clientY

      switch (props.position) {
        case 'bottom':
        case 'bottom-left':
        case 'bottom-right':
          clientY = bottom
          break
        case 'top':
        case 'top-left':
        case 'top-right':
          clientY = top
          break
        default:
          clientY = (top + bottom) / 2
          break
      }

      setTooltipVisible(true)
      setCoordinates([clientX, clientY])
    }, 300)
  }

  return (
    <>
      <TooltipContent
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        expand={props.expand}
        ref={tooltipToggleRef}
      >
        {props.children}
      </TooltipContent>
      {tooltipVisible && (
        <TooltipPortal x={coordinates[0]} y={coordinates[1]} position={props.position}>
          <TooltipWrapper ref={tooltipPortalRef} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
            {props.render()}
          </TooltipWrapper>
        </TooltipPortal>
      )}
    </>
  )
}
