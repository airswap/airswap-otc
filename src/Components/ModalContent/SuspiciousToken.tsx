import { openEtherscanLink } from 'airswap.js/src/utils/etherscan'
import React, { useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { ModalContext } from '../../app/context/ModalContext'
import Button, { ButtonVariant } from '../../elements/Button'
import { Flex } from '../../elements/Flex'
import { HorizontalSpacer, VerticalSpacer } from '../../elements/Spacer'
import { H3, H6 } from '../../elements/Typography'
import { ReactComponent as ArrowUpRightIcon } from '../../static/arrow-up-right-icon.svg'
import { ReactComponent as CloseIcon } from '../../static/close-icon.svg'
import { ReactComponent as WarningIcon } from '../../static/warning-icon.svg'
import theme from '../../theme'
import { TokenMetadata } from '../../types/models/Tokens'

const Close = styled(Flex)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
`

const Container = styled(Flex)`
  padding: 50px;
  width: 400px;
  height: 500px;

  @media (max-width: ${`${theme.breakpoints.sm[1]}px`}) {
    width: 100%;
    height: auto;
  }
`

const TokenContainer = styled(Flex).attrs({
  direction: 'row',
  expand: true,
  align: 'center',
  justify: 'center',
})`
  cursor: pointer;
  background-color: ${theme.palette.primaryColor}1A;
  border-radius: 5px;
  padding: 10px;
`

interface SuspiciousTokenProps {
  similarToken: TokenMetadata
  token: TokenMetadata
  chooseToken(): void
}

export default function SuspiciousToken(props: SuspiciousTokenProps) {
  const { setModalOpen } = useContext(ModalContext)

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <Container>
      <Close onClick={closeModal}>
        <CloseIcon />
      </Close>
      <WarningIcon />
      <VerticalSpacer units={4} />
      <H3 weight={theme.text.fontWeight.medium}>
        <FormattedMessage defaultMessage="Warning" />
      </H3>
      <VerticalSpacer units={4} />
      <H6 weight={theme.text.fontWeight.light}>
        <FormattedMessage defaultMessage="We detected that the address you provded has the same ticker as another popular token." />
      </H6>
      <VerticalSpacer units={6} />
      <H6>
        <FormattedMessage defaultMessage="Are you sure you want to trade" />
      </H6>
      <VerticalSpacer units={2} />
      <TokenContainer onClick={() => openEtherscanLink(props.token.address, 'token')}>
        <H6 fit>
          <FormattedMessage
            defaultMessage="{name} ({symbol})"
            values={{ name: props.token.name, symbol: props.token.symbol }}
          />
        </H6>
        <HorizontalSpacer units={2} />
        <ArrowUpRightIcon />
      </TokenContainer>
      <VerticalSpacer units={12} />
      <Flex expand direction="row">
        <Button expand variant={ButtonVariant.SECONDARY} onClick={closeModal}>
          <FormattedMessage defaultMessage="No" />
        </Button>
        <HorizontalSpacer units={4} />
        <Button expand variant={ButtonVariant.PRIMARY} onClick={props.chooseToken}>
          <FormattedMessage defaultMessage="Yes" />
        </Button>
      </Flex>
    </Container>
  )
}
