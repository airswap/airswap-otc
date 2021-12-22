import React, { useEffect, useRef } from 'react'

import { ModalSettings } from '../../app/context/ModalContext'
import theme from '../../theme'
import { ModalContainer, ModalContent } from './styles'

interface ModalProps {
  children: React.ReactNode
  settings: ModalSettings
  modalOpen: boolean
  setModalOpen(modalOpen: boolean): void
}

export default function Modal(props: ModalProps) {
  const modalContainerRef = useRef<HTMLDivElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const modalCloseTimeoutRef = useRef<number>(0)

  const handleKeyboard = event => {
    // Dismiss Modal on Escape Key
    if (event.key && event.key === 'Escape' && props.settings.canDismiss) {
      props.setModalOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard)
    return () => document.removeEventListener('keydown', handleKeyboard)
  }, [])

  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (
        props.settings.canDismiss &&
        modalContentRef.current &&
        evt.target instanceof HTMLDivElement &&
        !modalContentRef.current.contains(evt.target)
      ) {
        props.setModalOpen(false)
      }
    }

    if (props.modalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [JSON.stringify(props.settings), modalContentRef.current, props.modalOpen, props.setModalOpen])

  useEffect(() => {
    if (props.modalOpen) {
      if (modalContainerRef.current) {
        modalContainerRef.current.style.display = 'flex'
        clearTimeout(modalCloseTimeoutRef.current)
      }
    } else {
      modalCloseTimeoutRef.current = setTimeout(() => {
        if (modalContainerRef.current) {
          modalContainerRef.current.style.display = 'none'
        }
      }, theme.animation.defaultTransition * 1000)
    }
  }, [props.modalOpen])

  return (
    <ModalContainer isOpen={props.modalOpen} ref={modalContainerRef}>
      <ModalContent position={props.settings.mobilePosition} ref={modalContentRef}>
        {props.children}
      </ModalContent>
    </ModalContainer>
  )
}
