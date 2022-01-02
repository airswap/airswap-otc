import React, { useContext, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { FormSubmitContext } from '../../../app/context/FormSubmitContext'
import { ModalContext } from '../../../app/context/ModalContext'
import Button, { ButtonVariant } from '../../../elements/Button'
import { Flex } from '../../../elements/Flex'
import { VerticalSpacer } from '../../../elements/Spacer'
import { H4, H6 } from '../../../elements/Typography'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { ReactComponent as ErrorIcon } from '../../../static/wallet-connect-error-icon.svg'
import theme from '../../../theme'
import { Close, IconContainer, ModalContainer } from './styles'

interface SwapFailureProps {
  reasons: string[]
  setTakeAnyway(value: boolean): void
}

export default function SwapFailure(props: SwapFailureProps) {
  const { setIsFormSubmitting, setShouldProgress } = useContext(FormSubmitContext)
  const { setModalOpen } = useContext(ModalContext)

  const dismiss = () => {
    setIsFormSubmitting(false)
    setModalOpen(false)
  }

  useEffect(() => {
    setShouldProgress(false)
  }, [])

  return (
    <ModalContainer>
      <Close onClick={dismiss}>
        <CloseIcon />
      </Close>
      <IconContainer>
        <ErrorIcon />
      </IconContainer>
      <Flex>
        <H4 weight={theme.text.fontWeight.semibold}>
          <FormattedMessage defaultMessage="Warning" />
        </H4>
        <VerticalSpacer units={2} />
        <H6 weight={theme.text.fontWeight.light}>
          <FormattedMessage defaultMessage="This order will fail due to the following reasons:" />
        </H6>
        {props.reasons.map(reason => (
          <>
            <VerticalSpacer units={2} />
            <H6>{reason}</H6>
          </>
        ))}
      </Flex>
      <Flex justify="center" direction="row">
        <Button variant={ButtonVariant.PRIMARY} onClick={dismiss}>
          <FormattedMessage defaultMessage="Back" />
        </Button>
      </Flex>
    </ModalContainer>
  )
}
