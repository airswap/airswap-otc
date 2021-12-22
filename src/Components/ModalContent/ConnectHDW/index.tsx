import React, { useContext } from 'react'
import { FormattedMessage } from 'react-intl'

import { ModalContext, ModalPosition } from '../../../app/context/ModalContext'
import { MetamaskHDWFAQLink } from '../../../constants'
import Button from '../../../elements/Button'
import { Flex } from '../../../elements/Flex'
import Link from '../../../elements/Link'
import { HorizontalSpacer, VerticalSpacer } from '../../../elements/Spacer'
import { H3, H5, H7 } from '../../../elements/Typography'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { ReactComponent as LedgerLogo } from '../../../static/ledger-logo.svg'
import { ReactComponent as TrezorLogo } from '../../../static/trezor-logo.svg'
import WalletConnectionStatus from '../WalletConnectionStatus'
import Container, { ConnectHDWProps } from './Container'
import {
  CloseIconContainer,
  ConnectHDWContainer,
  HDWConnectStepDivider,
  HDWLogoContainer,
  StepNumberIcon,
} from './styles'

export enum HDWType {
  Ledger = 'Ledger',
  Trezor = 'Trezor',
}

interface HDWConnectStepProps {
  step: number
  label: string
}

function HDWConnectStep(props: HDWConnectStepProps) {
  return (
    <Flex expand direction="row" justify="space-between">
      <StepNumberIcon>{props.step}</StepNumberIcon>
      <HorizontalSpacer units={4} />
      <H7 textAlign="left">{props.label}</H7>
    </Flex>
  )
}

function ConnectHDW(props: ConnectHDWProps) {
  const { setModalContent, setModalSettings, setModalOpen } = useContext(ModalContext)

  const initHDWConnect = () => {
    if (props.hdwType === HDWType.Ledger) {
      props.initLedger()
    } else {
      props.initTrezor()
    }
    setModalContent(<WalletConnectionStatus />)
    setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
  }

  return (
    <ConnectHDWContainer>
      <CloseIconContainer onClick={() => setModalOpen(false)}>
        <CloseIcon />
      </CloseIconContainer>
      <HDWLogoContainer>{props.hdwType === HDWType.Ledger ? <LedgerLogo /> : <TrezorLogo />}</HDWLogoContainer>
      <VerticalSpacer units={5} />
      <H3 weight={600}>
        <FormattedMessage defaultMessage="Connect {hdwName}" values={{ hdwName: props.hdwType }} />
      </H3>
      <VerticalSpacer units={5} />
      <H5 opacity={0.5}>
        <FormattedMessage
          defaultMessage="Follow the steps below to connect your {hdwName} device."
          values={{ hdwName: props.hdwType }}
        />
      </H5>
      <VerticalSpacer units={5} />
      <Flex expand>
        <HDWConnectStep step={1} label="Select the 'Connect Hardware Wallet' option in Metamask" />
        <HDWConnectStepDivider />
        <HDWConnectStep step={2} label={`Plug your ${props.hdwType} device into your computer`} />
        <HDWConnectStepDivider />
        <HDWConnectStep step={3} label={`Select '${props.hdwType}', and click 'Connect'`} />
        <HDWConnectStepDivider />
        {props.hdwType === HDWType.Ledger ? (
          <>
            <HDWConnectStep step={4} label="Select the account you want to use" />
            <HDWConnectStepDivider />
            <HDWConnectStep step={5} label="Click 'Import'" />
          </>
        ) : (
          <>
            <HDWConnectStep
              step={4}
              label="You will get a popup from Trezor asking you for permission to export your public key. Once confirmed, you will see the list of Ethereum accounts from your Trezor device in the MetaMask extension"
            />
            <HDWConnectStepDivider />
            <HDWConnectStep step={5} label="Select the account you want to use, and click 'UNLOCK'" />
          </>
        )}
        <HDWConnectStepDivider />
        <HDWConnectStep step={6} label="Click 'Connect via Metmask' on this screen to connect to AirSwap" />
        <VerticalSpacer units={1} />
        <Link to={MetamaskHDWFAQLink}>
          <FormattedMessage defaultMessage="Learn more" />
        </Link>
      </Flex>
      <VerticalSpacer units={5} />
      {/* Add read more button */}
      <Button onClick={initHDWConnect}>
        <FormattedMessage defaultMessage="Connect via Metamask" />
      </Button>
    </ConnectHDWContainer>
  )
}

export default Container(ConnectHDW)
