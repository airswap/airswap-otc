import React, { useContext } from 'react'
import { FormattedMessage } from 'react-intl'

import { ModalContext } from '../../app/context/ModalContext'
import { WalletContext } from '../../app/context/WalletContext'
import Button, { ButtonVariant } from '../../elements/Button'
import { Flex } from '../../elements/Flex'
import { VerticalSpacer } from '../../elements/Spacer'
import { H4, H6 } from '../../elements/Typography'
import { ReactComponent as CloseIcon } from '../../static/close-icon.svg'
import { ReactComponent as ErrorIcon } from '../../static/wallet-connect-error-icon.svg'
import theme from '../../theme'
import { condenseAddress } from '../../utils/transformations'
import { IconContainer } from './styles'
import { Close, ModalContainer } from './WalletConnectionStatus/styles'

function InvalidTakerAddressModal({ address }: { address: string }) {
  const { setModalOpen } = useContext(ModalContext)
  const { startWalletConnect } = useContext(WalletContext)

  const onSelectDifferentWalletClick = () => {
    startWalletConnect()
    setModalOpen(false)
  }

  return (
    <ModalContainer justify="center">
      <Close onClick={setModalOpen.bind(null, false)}>
        <CloseIcon />
      </Close>
      <Flex direction="column" justify="space-between" expand>
        <IconContainer>
          <ErrorIcon />
        </IconContainer>
        <VerticalSpacer units={4} />
        <H4 weight={theme.text.fontWeight.semibold}>
          <FormattedMessage defaultMessage="Wallet Mismatch" />
        </H4>
        <VerticalSpacer units={4} />
        <H6 weight={theme.text.fontWeight.light}>
          <FormattedMessage defaultMessage="This is a private order. The connected wallet does not match the counterparty address that was defined by the maker of this trade. To take this order, you will need to connect the wallet with the following address: " />
        </H6>
        <VerticalSpacer units={4} />
        <H6 weight={theme.text.fontWeight.semibold}>
          <FormattedMessage
            values={{ address: condenseAddress(address, true, false, 'top') }}
            defaultMessage="{address}"
          />
        </H6>
        <VerticalSpacer units={4} />
        <Button onClick={onSelectDifferentWalletClick} variant={ButtonVariant.PRIMARY}>
          <FormattedMessage defaultMessage="Select a different wallet" />
        </Button>
      </Flex>
    </ModalContainer>
  )
}

export default InvalidTakerAddressModal
