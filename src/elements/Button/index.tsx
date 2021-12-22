import React, { useRef } from 'react'

import { BlankButton, LinkButton, PrimaryButton, Ripple, RippleContainer, SecondaryButton } from './styles'

export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum ButtonVariant {
  SOLID = 'solid',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  LINK = 'link',
  BLANK = 'blank',
}

interface ButtonProps {
  variant?: ButtonVariant
  submit?: boolean
  size?: ButtonSize
  children?: React.ReactNode
  disabled?: boolean
  expand?: boolean
  color?: string
  backgroundColor?: string
  dataTest?: string
  hoverColor?: string
  tabIndex?: number
  onClick?(): void
}

export default function Button(props: ButtonProps) {
  const rippleRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  let ButtonEl

  switch (props.variant) {
    case ButtonVariant.LINK:
      ButtonEl = LinkButton
      break
    case ButtonVariant.SECONDARY:
      ButtonEl = SecondaryButton
      break
    case ButtonVariant.BLANK:
      ButtonEl = BlankButton
      break
    case ButtonVariant.PRIMARY:
    default:
      ButtonEl = PrimaryButton
  }

  const onClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger Ripple Animation
    if (rippleRef.current && buttonRef.current) {
      rippleRef.current.style.left = `${evt.pageX - buttonRef.current.getBoundingClientRect().left}px`
      rippleRef.current.style.top = `${evt.pageY - buttonRef.current.getBoundingClientRect().top}px`

      rippleRef.current.classList.add('show-ripple')
      setTimeout(() => {
        if (rippleRef.current) {
          rippleRef.current.classList.remove('show-ripple')
        }
      }, 300)
    }

    if (!props.submit) {
      evt.preventDefault()
    }
    if (props.onClick) {
      props.onClick()
    }
  }

  return (
    <ButtonEl
      expand={props.expand}
      disabled={props.disabled}
      onClick={onClick}
      size={props.size}
      color={props.color}
      backgroundColor={props.backgroundColor}
      data-test={props.dataTest}
      hoverColor={props.hoverColor}
      tabIndex={props.tabIndex}
      ref={buttonRef}
    >
      <RippleContainer>
        <Ripple ref={rippleRef} />
      </RippleContainer>
      {props.children}
    </ButtonEl>
  )
}
