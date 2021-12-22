import React, { useEffect, useRef } from 'react'

import ChevronDown from '../../static/chevron-down-icon.svg'
import ChevronUp from '../../static/chevron-up-icon.svg'
import theme from '../../theme'
import { useDebouncedCallback } from '../../utils/useDebounce'
import { Flex } from '../Flex'
import MediaQuery from '../MediaQueryWrapper'
import {
  ChevronIconContainer,
  DesktopDropdown,
  DropdownItemContainer,
  MobileDropdown,
  MobileSelectedItemContainer,
  OpenDropdown,
  SelectedItemContainer,
} from './styles'

interface DropdownItemProps {
  isSelected: boolean
  dropdownOpen: boolean
  onSelect(): void
  children: React.ReactNode
}

export function DropdownItem(props: DropdownItemProps) {
  return (
    <DropdownItemContainer dropdownOpen={props.dropdownOpen} onClick={props.onSelect}>
      {props.children}
    </DropdownItemContainer>
  )
}

interface DropdownProps {
  isOpen: boolean
  setIsOpen(isOpen: boolean): void
  children: React.ReactElement<React.ComponentProps<typeof DropdownItem>>[]
}

export default function Dropdown(props: DropdownProps) {
  const selectedItemRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)
  const desktopRef = useRef<HTMLDivElement>(null)

  const SelectedItem = props.children.find(dropdownItem => dropdownItem.props.isSelected)
  const OtherItems = props.children.filter(dropdownItem => !dropdownItem.props.isSelected)
  const openDropdown = () => {
    props.setIsOpen(true)
  }

  const closeDropdown = () => {
    props.setIsOpen(false)
  }

  const setPosition = useDebouncedCallback(() => {
    if (selectedItemRef.current && desktopRef.current) {
      desktopRef.current.style.left = `${selectedItemRef.current.getBoundingClientRect().left}px`
      desktopRef.current.style.top = `${selectedItemRef.current.getBoundingClientRect().top - 5}px`
    }
  })

  useEffect(() => {
    setPosition()
    window.addEventListener('resize', setPosition)
    window.addEventListener('scroll', setPosition)

    return () => {
      window.removeEventListener('resize', setPosition)
      window.removeEventListener('scroll', setPosition)
    }
  }, [dropdownRef, desktopRef, selectedItemRef])

  useEffect(() => {
    if (props.isOpen && dropdownRef.current) {
      dropdownRef.current.style.display = 'flex'
      setPosition()
    } else {
      setTimeout(() => {
        if (dropdownRef.current) {
          dropdownRef.current.style.display = 'none'
        }
      }, theme.animation.defaultTransition * 1000)
    }
  }, [props.isOpen])

  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (evt.target instanceof HTMLDivElement) {
        if (
          (desktopRef.current && !desktopRef.current.contains(evt.target)) ||
          (mobileRef.current && !mobileRef.current.contains(evt.target))
        ) {
          props.setIsOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [props.setIsOpen, mobileRef, desktopRef])

  return (
    <Flex>
      <SelectedItemContainer onClick={openDropdown} ref={selectedItemRef} isOpen={props.isOpen}>
        <MediaQuery size="sm">
          <MobileSelectedItemContainer>{SelectedItem}</MobileSelectedItemContainer>
        </MediaQuery>
        <MediaQuery size="md-up">{SelectedItem}</MediaQuery>
        <ChevronIconContainer src={ChevronDown} />
      </SelectedItemContainer>
      <OpenDropdown ref={dropdownRef} isOpen={props.isOpen}>
        <MediaQuery size="sm">
          <MobileDropdown ref={mobileRef}>{props.children}</MobileDropdown>
        </MediaQuery>
        <MediaQuery size="md-up">
          <DesktopDropdown ref={desktopRef}>
            <SelectedItemContainer onClick={closeDropdown} isOpen={props.isOpen}>
              {SelectedItem}
              <ChevronIconContainer src={ChevronUp} />
            </SelectedItemContainer>
            {OtherItems}
          </DesktopDropdown>
        </MediaQuery>
      </OpenDropdown>
    </Flex>
  )
}
