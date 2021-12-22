import React, { useState } from 'react'

interface FormSubmitContextType {
  isFormSubmitting: boolean
  shouldProgress: boolean
  setIsFormSubmitting(isSubmitting: boolean): void
  setShouldProgress(shouldProgress: boolean): void
}

export const FormSubmitContext = React.createContext<FormSubmitContextType>({
  isFormSubmitting: false,
  shouldProgress: true,
  setIsFormSubmitting: () => {},
  setShouldProgress: () => {},
})

interface ContextProviderProps {
  children: React.ReactNode
}

export default function FormSubmitContextProvider(props: ContextProviderProps) {
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false)
  const [shouldProgress, setShouldProgress] = useState<boolean>(true)

  const safeSetIsFormSubmitting = (value: boolean) => {
    if (isFormSubmitting !== value) {
      setIsFormSubmitting(value)
    }
  }

  const formSubmitContextValue = {
    isFormSubmitting,
    setIsFormSubmitting: safeSetIsFormSubmitting,
    shouldProgress,
    setShouldProgress,
  }

  return <FormSubmitContext.Provider value={formSubmitContextValue}>{props.children}</FormSubmitContext.Provider>
}
