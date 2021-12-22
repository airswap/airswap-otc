import React from 'react'
import Slider, { Settings } from 'react-slick'
import styled from 'styled-components'

import { ReactComponent as ChevronRightIcon } from '../static/chevron-right-icon.svg'
import { Flex } from './Flex'

interface ArrowContainerProps {
  isReverse?: boolean
}

const ArrowContainer = styled(Flex)<ArrowContainerProps>`
  &.slick-disabled {
    opacity: 0;
    pointer-events: none;
  }

  svg {
    transform: ${({ isReverse }) => (isReverse ? 'rotate(180deg)' : 'none')};
    width: 25px;
    height: 25px;

    path {
      stroke: white;
    }
  }
`

interface CarouselProps {
  ref?: React.RefObject<Slider>
  settings?: Partial<Settings>
  children: React.ReactNode
  setCarouselObject?(ref: any): void
  beforeChange?(index: number): void
  afterChange?(index: number): void
}

export default function Carousel(props: CarouselProps) {
  const defaultSettings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: 'index-dot',
    prevArrow: (
      <ArrowContainer isReverse>
        <ChevronRightIcon />
      </ArrowContainer>
    ),
    nextArrow: (
      <ArrowContainer>
        <ChevronRightIcon />
      </ArrowContainer>
    ),
    beforeChange: (current, next) => props.beforeChange && props.beforeChange(next),
    afterChange: current => props.afterChange && props.afterChange(current),
  }

  const settings = Object.assign({}, defaultSettings, props.settings)

  return (
    <Slider
      ref={ref => {
        if (props.setCarouselObject) {
          props.setCarouselObject(ref)
        }
      }}
      {...settings}
    >
      {props.children}
    </Slider>
  )
}
