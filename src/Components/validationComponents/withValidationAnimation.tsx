import React, { useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'

import { Flex } from '../../elements/Flex'
import { ValidatedValue, ValidationMessageVariant } from './createValidatedValue'

const Container = styled(Flex).attrs({
  expand: true,
  align: 'center',
  justify: 'center',
})`
  height: 100%;
  position: relative;
  transition: ${({ theme }) => theme.animation.defaultTransition}s;
`

const WiggleAnimation = keyframes`
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-10px);
  }

  50% {
    transform: translateX(10px);
  }

  75% {
    transform: translateX(-10px);
  }

  100% {
    transform: translateX(0);
  }
`

const Content = styled(Flex)`
  &.show-animation {
    animation: ${WiggleAnimation} 0.25s;
  }
`

interface ValidationAnimationRequires {
  value: ValidatedValue<any>
  expand?: boolean
}

export default function withValidationAnimation<T extends ValidationAnimationRequires>(
  Component: React.ComponentType<T>,
): React.ComponentType<T & ValidationAnimationRequires> {
  return (props: T) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (props.value.message && props.value.message.variant === ValidationMessageVariant.ERROR) {
        if (contentRef.current) {
          contentRef.current.classList.add('show-animation')
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.classList.remove('show-animation')
            }
          }, 250)
        }
      }
    }, [props.value.message])

    return (
      <Container expand={props.expand} ref={containerRef}>
        <Content ref={contentRef} expand={props.expand}>
          <Component {...props} />
        </Content>
      </Container>
    )
  }
}
