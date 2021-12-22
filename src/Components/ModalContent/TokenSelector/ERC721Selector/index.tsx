import React, { useContext, useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ModalContext } from '../../../../app/context/ModalContext'
import { WidgetContext } from '../../../../app/context/WidgetContext'
import Button, { ButtonVariant } from '../../../../elements/Button'
import { Flex } from '../../../../elements/Flex'
import { InputVariant } from '../../../../elements/Input'
import { HorizontalSpacer, VerticalSpacer } from '../../../../elements/Spacer'
import Spinner from '../../../../elements/Spinner'
import { H3, H4, H6, H7, H8 } from '../../../../elements/Typography'
import { ReactComponent as ArrowLeftIcon } from '../../../../static/arrow-left-icon.svg'
import { ReactComponent as ArrowRightIcon } from '../../../../static/arrow-right-icon.svg'
import { ReactComponent as CloseIcon } from '../../../../static/close-icon.svg'
import { ReactComponent as FlashlightIcon } from '../../../../static/flashlight-icon.svg'
import { ReactComponent as WarningIcon } from '../../../../static/warning-icon.svg'
import theme from '../../../../theme'
import createValidatedValue from '../../../validationComponents/createValidatedValue'
import ValidatedInput from '../../../validationComponents/ValidatedInput'
import ValidationForm from '../../../validationComponents/ValidationForm'
import { formatValidationMessage, RequiredValidator } from '../../../validationComponents/validators'
import Container, { ERC721SelectorProps } from './Container'
import {
  BackButton,
  ERC721Description,
  ERC721Image,
  ERC721SelectorContainer,
  IconContainer,
  NavigationContainer,
  SearchContainer,
  SelectButtonContainer,
  StatusContainer,
} from './styles'

enum SearchState {
  DEFAULT,
  SEARCHING,
  NOT_FOUND,
  FOUND,
}

function ERC721Selector(props: ERC721SelectorProps) {
  const [tokenId, setTokenId] = createValidatedValue([RequiredValidator], props.param.value || '')
  const [searchTokenId, setSearchTokenId] = useState<string>(props.param.value || '')
  const [searchState, setSearchState] = useState<SearchState>(SearchState.DEFAULT)
  const searchTimeout = useRef<number>()

  const { setModalOpen } = useContext(ModalContext)
  const { isWidget, widgetParams } = useContext(WidgetContext)

  const foundToken = props.getNFTItemByAddressAndId(props.token.address, searchTokenId)

  useEffect(() => {
    if (foundToken && searchTokenId && searchTokenId.length && tokenId.value) {
      clearTimeout(searchTimeout.current)
      setSearchState(SearchState.FOUND)
      props.fetchERC721OwnerOf({ contractAddress: foundToken.address, tokenId: tokenId.value })
    }
  }, [searchTimeout, foundToken, searchTokenId])

  useEffect(() => {
    if (
      props.showBalance &&
      foundToken &&
      props.connectedWalletAddress &&
      !props.getIsERC721Owner(foundToken.address, foundToken.id)
    ) {
      tokenId.setMessage(formatValidationMessage('You do not own this NFT!', true))
    }
  }, [props.showBalance, props.connectedWalletAddress, props.getIsERC721Owner])

  const searchERC721 = async () => {
    if (!tokenId.value || !tokenId.value.length) return false
    props.crawlNFTItem(props.token.address, tokenId.value)
    setSearchTokenId(tokenId.value)
    setSearchState(SearchState.SEARCHING)

    // Set search state if token not found in 5 seconds
    searchTimeout.current = setTimeout(() => {
      setSearchState(SearchState.NOT_FOUND)
    }, 5000)

    return false
  }

  const dismissModal = () => {
    setModalOpen(false)
  }

  const selectERC721 = () => {
    if (foundToken && foundToken.id) {
      props.selectERC721(foundToken.id)
    }
  }

  const widgetPrimaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.primaryColor
    : undefined
  const widgetSecondaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.secondaryColor
    : undefined

  const renderSearchState = () => {
    switch (searchState) {
      case SearchState.FOUND:
        return (
          <StatusContainer justify="space-between">
            <Flex>{foundToken && <ERC721Image src={foundToken.img_url} />}</Flex>
            <SelectButtonContainer>
              <Button
                color={widgetPrimaryColor}
                variant={ButtonVariant.SECONDARY}
                onClick={props.dismissERC721Selector}
              >
                <FormattedMessage defaultMessage="Back" />
              </Button>
              <HorizontalSpacer units={8} />
              <Button backgroundColor={widgetSecondaryColor} variant={ButtonVariant.PRIMARY} onClick={selectERC721}>
                <FormattedMessage defaultMessage="Select" />
              </Button>
            </SelectButtonContainer>
          </StatusContainer>
        )
      case SearchState.NOT_FOUND:
        return (
          <StatusContainer justify="center">
            <WarningIcon />
            <VerticalSpacer units={2} />
            <H4 weight={theme.text.fontWeight.medium}>
              <FormattedMessage defaultMessage="NFT not found" />
            </H4>
            <VerticalSpacer units={2} />
            <H6 weight={theme.text.fontWeight.light}>
              <FormattedMessage defaultMessage="Check the tokenID you entered" />
            </H6>
          </StatusContainer>
        )
      case SearchState.SEARCHING:
        return (
          <StatusContainer justify="center">
            <Flex height="60px">
              <Spinner size={60} />
              <IconContainer>
                <FlashlightIcon width={45} />
              </IconContainer>
            </Flex>
            <VerticalSpacer units={3} />
            <H8 color={widgetPrimaryColor || theme.palette.primaryColor}>
              <FormattedMessage defaultMessage="Searching NFT..." />
            </H8>
          </StatusContainer>
        )
      case SearchState.DEFAULT:
      default:
        return (
          <StatusContainer justify="center">
            <Flex height="60px">
              <IconContainer clickable onClick={searchERC721}>
                <FlashlightIcon width={45} />
              </IconContainer>
            </Flex>
            <VerticalSpacer units={3} />
            <ERC721Description>
              <H8 color={widgetPrimaryColor || theme.palette.primaryColor}>
                <FormattedMessage defaultMessage="Enter ID and Click the arrow to lookup and render your NFT" />
              </H8>
            </ERC721Description>
          </StatusContainer>
        )
    }
  }

  return (
    <ERC721SelectorContainer>
      <NavigationContainer>
        <BackButton onClick={props.dismissERC721Selector}>
          <ArrowLeftIcon />
          <HorizontalSpacer units={1} />
          <H7>
            <FormattedMessage defaultMessage="Back" />
          </H7>
        </BackButton>
        <CloseIcon onClick={dismissModal} />
      </NavigationContainer>
      <H3 weight={theme.text.fontWeight.semibold}>
        <FormattedMessage defaultMessage="Enter ID" />
      </H3>
      <VerticalSpacer units={2} />
      <H8>
        <FormattedMessage
          defaultMessage="Enter the TokenID of the {token} you want to send"
          values={{ token: props.token.name }}
        />
      </H8>
      <VerticalSpacer units={5} />
      <ValidationForm onSubmit={searchERC721} validatedValues={[tokenId]}>
        <SearchContainer color={widgetSecondaryColor}>
          <ValidatedInput expand autoFocus value={tokenId} onChange={setTokenId} variant={InputVariant.BLANK} />
          <ArrowRightIcon width={20} onClick={searchERC721} />
        </SearchContainer>
      </ValidationForm>
      <VerticalSpacer units={6} />
      {renderSearchState()}
    </ERC721SelectorContainer>
  )
}

export default Container(ERC721Selector)
