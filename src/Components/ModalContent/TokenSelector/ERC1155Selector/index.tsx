import React, { useContext } from 'react'
import { FormattedMessage } from 'react-intl'

import { ModalContext } from '../../../../app/context/ModalContext'
import { WidgetContext } from '../../../../app/context/WidgetContext'
import { InputVariant } from '../../../../elements/Input'
import { HorizontalSpacer, VerticalSpacer } from '../../../../elements/Spacer'
import { H3, H7 } from '../../../../elements/Typography'
import { ReactComponent as ArrowLeftIcon } from '../../../../static/arrow-left-icon.svg'
import { ReactComponent as ArrowRightIcon } from '../../../../static/arrow-right-icon.svg'
import { ReactComponent as CloseIcon } from '../../../../static/close-icon.svg'
import theme from '../../../../theme'
import { TokenMetadata } from '../../../../types/models/Tokens'
import createValidatedValue from '../../../validationComponents/createValidatedValue'
import ValidatedInput from '../../../validationComponents/ValidatedInput'
import ValidationForm from '../../../validationComponents/ValidationForm'
import { RequiredValidator } from '../../../validationComponents/validators'
import { BackButton, NavigationContainer, SearchContainer, SelectorContainer } from './styles'

// Props needed: setERC1155

// User enters id
// Fetch balance
// Check balance if wallet is connected

interface ERC1155SelectorProps {
  token: TokenMetadata
  tokenId: string
  selectERC1155(tokenId: string): void
  dismissERC1155Selector(): void
}

export default function ERC1155Selector(props: ERC1155SelectorProps) {
  const [tokenId, setTokenId] = createValidatedValue([RequiredValidator], props.tokenId)

  const { setModalOpen } = useContext(ModalContext)
  const { isWidget, widgetParams } = useContext(WidgetContext)

  const widgetSecondaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.secondaryColor
    : undefined

  const selectERC1155 = () => {
    props.selectERC1155(tokenId.value || '')
  }

  return (
    <SelectorContainer>
      <NavigationContainer>
        <BackButton onClick={props.dismissERC1155Selector}>
          <ArrowLeftIcon />
          <HorizontalSpacer units={1} />
          <H7>
            <FormattedMessage defaultMessage="Back" />
          </H7>
        </BackButton>
        <CloseIcon onClick={() => setModalOpen(false)} />
      </NavigationContainer>
      <H3 weight={theme.text.fontWeight.semibold}>
        <FormattedMessage defaultMessage="Enter ID" />
      </H3>
      <VerticalSpacer units={5} />
      <ValidationForm onSubmit={selectERC1155} validatedValues={[tokenId]}>
        <SearchContainer color={widgetSecondaryColor}>
          <ValidatedInput expand autoFocus value={tokenId} onChange={setTokenId} variant={InputVariant.BLANK} />
          <ArrowRightIcon width={20} onClick={selectERC1155} />
        </SearchContainer>
      </ValidationForm>
    </SelectorContainer>
  )
}
