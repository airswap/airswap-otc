import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ReactComponent as QuestionMarkIcon } from '../../static/question-mark-icon.svg'
import Tooltip from '../Tooltip'
import { Container, IconContainer, Text } from './styles'

interface Props {
  variant: 'good' | 'bad' | 'unknown'
  white?: boolean
}

export default function TokenTag(props: Props) {
  if (props.variant === 'good') return null

  return (
    <Tooltip
      position="top"
      render={() =>
        props.variant === 'unknown' ? (
          <FormattedMessage defaultMessage="AirSwap allows users to add and trade any ERC20 token. The token you are about to trade was manually added by a user. Be careful and verify the legitimacy of the token on Etherscan before completing a transaction." />
        ) : (
          <FormattedMessage defaultMessage="Warning! The token you are about to trade uses the same name as a different known token. Be careful and verify the legitimacy of the token on Etherscan before completing a transaction." />
        )
      }
    >
      <Container variant={props.variant} white={props.white}>
        {props.variant === 'bad' ? (
          <>
            <Text variant={props.variant}>
              <FormattedMessage defaultMessage="Warning!" />
            </Text>
            <IconContainer variant={props.variant}>
              <QuestionMarkIcon />
            </IconContainer>
          </>
        ) : (
          <>
            <Text variant={props.variant}>
              <FormattedMessage defaultMessage="Custom Token" />
            </Text>
            <IconContainer variant={props.variant}>
              <QuestionMarkIcon />
            </IconContainer>
          </>
        )}
      </Container>
    </Tooltip>
  )
}
