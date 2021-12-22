import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import Button, { ButtonVariant } from '../../elements/Button'
import { Flex } from '../../elements/Flex'
import { HorizontalSpacer, VerticalSpacer } from '../../elements/Spacer'
import { H3, H7, H8 } from '../../elements/Typography'

interface ContainerProps {
  noBorder?: boolean
}

const Container = styled(Flex)<ContainerProps>`
  height: 100%;
  border-right: ${({ noBorder }) => !noBorder && '1px solid rgba(255, 255, 255, 0.25)'};
`

const WalletItemContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  padding: 30px;
`

const LogoContainer = styled(Flex)`
  margin-bottom: 60px;

  svg {
    height: 30px;
  }
`

const WalletDescription = styled(Flex).attrs({
  justify: 'flex-start',
})`
  flex-grow: 1;
`

const WalletDescriptionText = styled(H8)`
  color: white;
  font-weight: ${({ theme }) => theme.text.fontWeight.light};
`

const WalletTitle = styled(H3).attrs({ fit: true })`
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
`

interface WalletItemProps {
  name: string
  description: string
  icon: React.ElementType
  faqUrl: string
  isHDW?: boolean
  textColor?: string
  dataTest?: string
  noBorder?: boolean
  onConnect(): void
}

export default function WalletItem(props: WalletItemProps) {
  return (
    <Container noBorder={props.noBorder}>
      <WalletItemContainer justify="space-between">
        <LogoContainer>
          <props.icon />
        </LogoContainer>

        <WalletDescription>
          <Flex expand direction="row" justify="center" align="center">
            <WalletTitle color="white">{props.name}</WalletTitle>
            {props.isHDW && (
              <>
                <HorizontalSpacer units={1} />
                <H7 fit color="white">
                  <FormattedMessage defaultMessage="(via Metamask)" />
                </H7>
              </>
            )}
          </Flex>
          <VerticalSpacer units={4} />
          <WalletDescriptionText>{props.description}</WalletDescriptionText>
        </WalletDescription>

        <Flex justify="space-between">
          <Button
            color={props.textColor}
            variant={ButtonVariant.SECONDARY}
            onClick={props.onConnect}
            tabIndex={-1}
            dataTest={props.dataTest}
          >
            <FormattedMessage defaultMessage="Select" />
          </Button>
          <VerticalSpacer units={4} />
          <Button onClick={() => window.open(props.faqUrl)} variant={ButtonVariant.LINK} tabIndex={-1}>
            <FormattedMessage defaultMessage="Learn more" />
          </Button>
          <VerticalSpacer units={2} />
        </Flex>
      </WalletItemContainer>
    </Container>
  )
}
