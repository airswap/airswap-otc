import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import { Flex } from '../../elements/Flex'

interface PopoverProps {
  children: React.ReactNode
  x: number
  y: number
  position: 'bottom' | 'bottom-left' | 'bottom-right' | 'top' | 'top-left' | 'top-right' // left/right don't work yet
  offsetX?: number
  offsetY?: number
  absoluteX?: number
  absoluteY?: number
}

interface TooltipArrowProps {
  children?: React.ReactNode
  position: 'bottom' | 'bottom-left' | 'bottom-right' | 'top' | 'top-left' | 'top-right' | 'left' | 'right'
}

const popoverRoot: any = window.document.body

const PopoverWrapper = styled(Flex)<PopoverProps>`
  position: absolute;
  z-index: 2147483638;
  ${({ absoluteX, absoluteY, offsetX, offsetY, position, x, y }) => {
    const { clientWidth, clientHeight } = popoverRoot
    if (position || absoluteX || absoluteY) {
      let positionString = ''
      if (position) {
        const positions = position.split('-')
        let xCoord = 0
        let yCoord = 0
        positions.forEach(p => {
          switch (p) {
            case 'right':
              xCoord = clientWidth - x
              if (offsetX) {
                xCoord += offsetX
              }
              positionString = positionString.concat(`right: ${xCoord}px;`)
              break
            case 'top':
              yCoord = clientHeight - y
              if (offsetY) {
                yCoord += offsetY
              }
              positionString = positionString.concat(`bottom: ${yCoord + 5}px;`)
              break
            case 'left':
              xCoord = x
              if (offsetX) {
                xCoord += offsetX
              }
              positionString = positionString.concat(`left: ${xCoord}px;`)
              break
            case 'bottom':
            default:
              yCoord = y
              if (offsetY) {
                yCoord += offsetY
              }
              positionString = positionString.concat(`top: ${yCoord}px;`)
              break
          }
        })

        switch (position) {
          case 'top':
          case 'bottom':
            positionString = positionString.concat(`left: ${x}px; transform: translateX(-50%)`)
            break
          default:
            break
        }
      }
      // overrides X position
      if (absoluteX) {
        positionString = positionString.concat(`left: ${absoluteX}px;`)
      }
      // overrides Y position
      if (absoluteY) {
        positionString = positionString.concat(`top: ${absoluteY}px;`)
      }

      return positionString
    }

    return `
      top: ${y}px;
      left: ${Math.floor(x / 2)}px;
    `
    // eslint-disable-next-line
  }};
`

const PopoverContent = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.foregroundColor};
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.1);
`

const getDirectionForPosition = position => {
  switch (position) {
    case 'left':
      return 'row'
    case 'right':
      return 'row-reverse'
    case 'top':
    case 'top-left':
    case 'top-right':
      return 'column'
    case 'bottom':
    case 'bottom-left':
    case 'bottom-right':
    default:
      return 'column-reverse'
  }
}

const getAlignForPosition = position => {
  switch (position) {
    case 'top-left':
    case 'bottom-left':
      return 'flex-start'
    case 'top-right':
    case 'bottom-right':
      return 'flex-end'
    case 'left':
    case 'right':
    case 'top':
    case 'bottom':
    default:
      return 'center'
  }
}

const TooltipContent = styled(PopoverContent)`
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: ${({ theme }) => theme.spacing(2)};
`

const Popover = ({ children, position, ...props }: PopoverProps) => (
  <PopoverWrapper
    {...props}
    position={position}
    direction={getDirectionForPosition(position)}
    align={getAlignForPosition(position)}
  >
    <PopoverContent>{children}</PopoverContent>
  </PopoverWrapper>
)

const Tooltip = ({ children, ...props }: PopoverProps) => (
  <PopoverWrapper
    {...props}
    direction={getDirectionForPosition(props.position)}
    align={getAlignForPosition(props.position)}
  >
    <TooltipContent>{children}</TooltipContent>
    {/* <TooltipArrow position={props.position} /> */}
  </PopoverWrapper>
)

class PopoverPortal extends Component<PopoverProps> {
  public constructor(props: any) {
    super(props)
    this.el = document.createElement('div')
  }

  public el: any

  public componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    popoverRoot.appendChild(this.el)
  }

  public componentWillUnmount() {
    popoverRoot.removeChild(this.el)
  }

  public render() {
    const { children, ...props } = this.props
    return ReactDOM.createPortal(<Popover {...props}>{children}</Popover>, this.el)
  }
}

class TooltipPortal extends PopoverPortal {
  private calculateNotchOffset = () => {
    const { offsetX, offsetY } = this.props

    return { offsetX: offsetX ? offsetX - 23 : 0, offsetY: offsetY ? offsetY + 2 : 0 }
  }

  public render() {
    const { children, ...props } = this.props
    const { offsetX, offsetY } = this.calculateNotchOffset()
    return ReactDOM.createPortal(
      <Tooltip {...props} offsetX={offsetX} offsetY={offsetY}>
        {children}
      </Tooltip>,
      this.el,
    )
  }
}

export { PopoverPortal, TooltipPortal }
