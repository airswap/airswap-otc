import React, { useState } from 'react'

import theme from '../../theme'

export enum ModalPosition {
  BOTTOM,
  CENTER,
  FULL_SCREEN,
}

export interface ModalSettings {
  canDismiss: boolean
  mobilePosition: ModalPosition
}

interface ModalContextType {
  modalSettings: ModalSettings
  modalOpen: boolean
  modalContent: React.ReactNode
  setModalContent(modalContent: React.ReactNode): void
  setModalOpen(modalOpen: boolean): Promise<void>
  setModalSettings(settings: Partial<ModalSettings>): void
}

export const ModalContext = React.createContext<ModalContextType>({
  modalSettings: { canDismiss: true, mobilePosition: ModalPosition.CENTER },
  modalOpen: false,
  modalContent: null,
  setModalContent: () => {},
  setModalOpen: () => new Promise(() => {}),
  setModalSettings: () => {},
})

interface ContextProviderProps {
  children: React.ReactNode
}

export default function ModalContextProvider(props: ContextProviderProps) {
  const defaultModalSettings: ModalSettings = {
    canDismiss: true,
    mobilePosition: ModalPosition.CENTER,
  }

  const [modalSettings, setModalSettings] = useState<ModalSettings>(defaultModalSettings)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)

  const setModalOpenWithDefault = async (value: boolean): Promise<void> => {
    setModalOpen(value)

    // Reset modal content on close
    if (!value) {
      setModalContent(null)
    }

    return new Promise(resolve => {
      setTimeout(resolve.bind(null), theme.animation.defaultTransition * 1000)
    })
  }

  // Set default modal settings every time content is updated
  const setModalContentWithDefault = (content: React.ReactNode) => {
    setModalSettings(defaultModalSettings)
    setModalContent(content)
  }

  const setModalSettingsWithDefault = (settings: Partial<ModalSettings>) => {
    const newModalSettings = Object.assign({}, defaultModalSettings, settings)
    setModalSettings(newModalSettings)
  }

  const contextValue = {
    modalOpen,
    modalSettings,
    modalContent,
    setModalOpen: setModalOpenWithDefault,
    setModalContent: setModalContentWithDefault,
    setModalSettings: setModalSettingsWithDefault,
  }

  return <ModalContext.Provider value={contextValue}>{props.children}</ModalContext.Provider>
}
