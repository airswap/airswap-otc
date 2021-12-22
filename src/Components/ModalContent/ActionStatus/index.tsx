import React, { useContext, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { ModalContext, ModalPosition } from '../../../app/context/ModalContext'
import { VerticalSpacer } from '../../../elements/Spacer'
import Spinner from '../../../elements/Spinner'
import { H3, H6 } from '../../../elements/Typography'
import theme from '../../../theme'
import { IconContainer } from '../styles'
import { ModalContainer, Status } from './styles'

interface ActionStatusProps {
  icon?: React.ElementType
  gif?: any
  title: string
}

export default function ActionStatus(props: ActionStatusProps) {
  const { setModalSettings } = useContext(ModalContext)

  useEffect(() => {
    setModalSettings({ mobilePosition: ModalPosition.BOTTOM, canDismiss: false })
  }, [])

  return (
    <ModalContainer>
      <Status>
        <Spinner size={60} />
        <IconContainer position="absolute">
          {props.icon && <props.icon />}
          {props.gif && <img src={props.gif} />}
        </IconContainer>
      </Status>
      <H3 weight={theme.text.fontWeight.semibold}>{props.title}</H3>
      <VerticalSpacer units={3} />
      <H6 weight={theme.text.fontWeight.light}>
        <FormattedMessage defaultMessage="Authorize this action by signing with your wallet and then wait while the transaction is finalized." />
      </H6>
    </ModalContainer>
  )
}
