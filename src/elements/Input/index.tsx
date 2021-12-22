import React, { useEffect, useRef, useState } from 'react'

import { ValidationUIVariant } from '../../Components/validationComponents/asValidationUI'
import theme from '../../theme'
import { isMobile } from '../../utils/helpers'
import { useDebouncedCallback } from '../../utils/useDebounce'
import { BaseInput, BlankInput, Placeholder, UnderlineInput } from './styles'

export enum InputSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'larger',
}

export enum InputVariant {
  DEFAULT = 'default',
  UNDERLINE = 'underline',
  BLANK = 'blank',
}

export interface InputProps {
  value: string | null
  disabled?: boolean
  expand?: boolean
  dynamic?: boolean
  minWidth?: number
  spellCheck?: string
  className?: string
  id?: string
  ref?: React.RefObject<HTMLInputElement>
  dynamicContainerRef?: React.RefObject<HTMLDivElement>
  type?: 'text' | 'number'
  textAlign?: 'left' | 'center' | 'right'
  noPadding?: boolean
  variant?: InputVariant
  size?: InputSize
  white?: boolean
  pattern?: string
  autoFocus?: boolean
  tabIndex?: number
  colorVariant?: ValidationUIVariant
  placeholder?: string
  placeholderOpacity?: number
  opacity?: number
  dataTest?: string
  onChange(value: string): void
  onFocus?(): void
  onBlur?(): void
}

export default function Input(props: InputProps) {
  const [fontSize, setFontSize] = useState<number>(0)
  const [previousValue, setPreviousValue] = useState(props.value)
  const [placeholderFontSize, setPlaceholderFontSize] = useState<number>(0)
  const placeholderRef = useRef<HTMLSpanElement>(null)
  const inputRef = props.ref || useRef<HTMLInputElement>(null)

  let InputEl

  switch (props.variant) {
    case InputVariant.UNDERLINE:
      InputEl = UnderlineInput
      break
    case InputVariant.BLANK:
      InputEl = BlankInput
      break
    case InputVariant.DEFAULT:
    default:
      InputEl = BaseInput
      break
  }

  const getMaxFontSize = () => {
    let maxFontSize
    switch (props.size) {
      case InputSize.SMALL:
        maxFontSize = theme.text.fontSize.h7
        break
      case InputSize.LARGE:
        maxFontSize = theme.text.fontSize.h1
        break
      case InputSize.MEDIUM:
      default:
        maxFontSize = theme.text.fontSize.h6
        break
    }
    return Number(maxFontSize.substring(0, maxFontSize.length - 2))
  }

  // Recursive function to find best font and input size
  const updateInputSize = (value: string) => {
    if (
      props.dynamic &&
      props.dynamicContainerRef &&
      props.dynamicContainerRef.current &&
      placeholderRef.current &&
      inputRef.current
    ) {
      placeholderRef.current.textContent = value
      const placeholderWidth = placeholderRef.current.getBoundingClientRect().width
      const containerMaxWidth = props.dynamicContainerRef.current.getBoundingClientRect().width - 120
      if (!value || value.length === 0 || !previousValue) {
        // Cleared input - reset to max font size
        setPlaceholderFontSize(getMaxFontSize())
        setFontSize(getMaxFontSize())
      } else if (containerMaxWidth < placeholderWidth) {
        // Container too big, downsize font size
        setPlaceholderFontSize(Math.max(placeholderFontSize - 2, 16))
      } else if (previousValue.length > value.length) {
        // Deletion
        setPlaceholderFontSize(getMaxFontSize())
      } else {
        // Found correct font size, set font size and exit recursive updates
        setFontSize(placeholderFontSize)
      }
      // Update input width
      if (isMobile()) {
        inputRef.current.style.width = '100%'
      } else {
        inputRef.current.style.width = `${Math.min(
          containerMaxWidth,
          Math.max(placeholderWidth, props.minWidth || 50),
        )}px`
      }
    }
  }

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    if (evt.target.value === '') {
      props.onChange(evt.target.value)
      return
    }
    if (props.pattern && !new RegExp(props.pattern).test(evt.target.value)) {
      return
    }
    props.onChange(evt.target.value)
  }

  const onResize = useDebouncedCallback(() => {
    updateInputSize(props.value || '')
  })

  useEffect(() => {
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', () => onResize)
    }
  }, [props.value])

  useEffect(() => {
    if (props.autoFocus && inputRef.current && !isMobile()) {
      inputRef.current.focus()
    }
  }, [props.autoFocus, inputRef.current])

  useEffect(() => {
    // Set font size on mount
    setFontSize(getMaxFontSize())
    setPlaceholderFontSize(getMaxFontSize())
  }, [props.size])

  useEffect(() => {
    // Recursively update font and input size
    updateInputSize(props.value || '')
    setPreviousValue(props.value)
  }, [props.value, placeholderFontSize])

  return (
    <>
      <InputEl
        id={props.id}
        step="any" // Required for Firefox
        ref={inputRef}
        className={props.className}
        fontSize={fontSize}
        disabled={props.disabled}
        tabIndex={props.tabIndex}
        colorVariant={props.colorVariant}
        white={props.white}
        spellCheck={props.spellCheck}
        autoFocus={!isMobile() && props.autoFocus}
        size={props.size || InputSize.MEDIUM}
        type={props.type || 'text'}
        textAlign={props.textAlign}
        noPadding={props.noPadding}
        expand={props.dynamic ? false : props.expand}
        placeholderOpacity={props.placeholderOpacity}
        opacity={props.opacity}
        value={props.value || ''}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onChange={onChange}
        placeholder={props.placeholder}
        data-test={props.dataTest}
      />
      {props.dynamic && props.dynamicContainerRef && (
        <Placeholder fontSize={placeholderFontSize} size={props.size || InputSize.MEDIUM} ref={placeholderRef} />
      )}
    </>
  )
}
