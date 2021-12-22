import React, { useContext, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { FormSubmitContext } from '../../../app/context/FormSubmitContext'
import { ModalContext } from '../../../app/context/ModalContext'
import Button, { ButtonVariant } from '../../../elements/Button'
import { Flex } from '../../../elements/Flex'
import { HorizontalSpacer, VerticalSpacer } from '../../../elements/Spacer'
import { H4, H6 } from '../../../elements/Typography'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { ReactComponent as ErrorIcon } from '../../../static/wallet-connect-error-icon.svg'
import theme from '../../../theme'
import { Close, IconContainer, ModalContainer } from './styles'

interface CounterpartyBalanceProps {
  setTakeAnyway(value: boolean): void
}

export default function CounterpartyBalance(props: CounterpartyBalanceProps) {
  const { setIsFormSubmitting, setShouldProgress } = useContext(FormSubmitContext)
  const { setModalOpen } = useContext(ModalContext)

  const dismiss = () => {
    setIsFormSubmitting(false)
    setModalOpen(false)
  }

  const progress = () => {
    props.setTakeAnyway(true)
    setShouldProgress(true)
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
          <FormattedMessage defaultMessage="Insufficient counterparty balance." />
        </H6>
        <H6>
          <FormattedMessage defaultMessage="If you take this order, it will fail." />
        </H6>
        <VerticalSpacer units={12} />
        <Flex justify="space-between" direction="row">
          <Button variant={ButtonVariant.PRIMARY} onClick={dismiss}>
            <FormattedMessage defaultMessage="Back" />
          </Button>
          <HorizontalSpacer units={4} />
          <Button variant={ButtonVariant.SECONDARY} onClick={progress}>
            <FormattedMessage defaultMessage="Take anyway" />
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  )
}
