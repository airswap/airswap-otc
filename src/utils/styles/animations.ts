import { keyframes } from 'styled-components'

export const FadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

export const Pulse = keyframes`
  0% {
    opacity: 1;
  }

  40% {
    opacity: 1;
  }

  70% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`

export const RippleAnimation = keyframes`
  0% {
    opacity: 0;
  }

  20% {
   opacity: 1;
  }

  60% {
    width: 200%;
    padding-bottom: 200%;
    opacity: 1;
  }

  100% {
    width: 200%;
    padding-bottom: 200%;
    opacity: 0;
  }
`
