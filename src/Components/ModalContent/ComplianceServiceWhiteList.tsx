import React, { useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { ModalContext } from '../../app/context/ModalContext'
import Button, { ButtonVariant } from '../../elements/Button'
import { Flex } from '../../elements/Flex'
import { VerticalSpacer } from '../../elements/Spacer'
import { H3, H6 } from '../../elements/Typography'
import { ReactComponent as CloseIcon } from '../../static/close-icon.svg'
import { ReactComponent as WarningIcon } from '../../static/warning-icon.svg'
import theme from '../../theme'
import { condenseAddress } from '../../utils/transformations'

const Close = styled(Flex)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
`

const ContentContainer = styled(Flex).attrs({ justify: 'space-between' })`
  padding: 50px;
  width: 400px;
  height: 400px;

  @media (max-width: ${`${theme.breakpoints.sm[1]}px`}) {
    width: 100%;
    height: auto;
  }
`

interface ComplianceServiceWhiteListProps {
  walletAddress: string
}

export default function ComplianceServiceWhiteList(props: ComplianceServiceWhiteListProps) {
  const { setModalOpen } = useContext(ModalContext)

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <ContentContainer>
      <Close onClick={closeModal}>
        <CloseIcon />
      </Close>
      <WarningIcon />
      <VerticalSpacer units={4} />
      <H3 weight={theme.text.fontWeight.medium}>
        <FormattedMessage defaultMessage="Wallet not in whitelist" />
      </H3>
      <VerticalSpacer units={4} />
      <H6 weight={theme.text.fontWeight.light}>
        <FormattedMessage defaultMessage="Selected wallet is not in the whitelist" />
      </H6>
      <H6 weight={theme.text.fontWeight.semibold}>
        <FormattedMessage
          values={{ address: condenseAddress(props.walletAddress, true, false, 'top') }}
          defaultMessage="{address}"
        />
      </H6>
      <VerticalSpacer units={10} />
      <Button variant={ButtonVariant.PRIMARY} onClick={closeModal}>
        <FormattedMessage defaultMessage="Close" />
      </Button>
    </ContentContainer>
  )
}
