import { ETH_ADDRESS, SWAP_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS } from 'airswap.js/src/constants'
import { getSwapOrderId } from 'airswap.js/src/swap/utils'
import BigNumber from 'bignumber.js'
import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'

import { FormSubmitContext } from '../../../app/context/FormSubmitContext'
import { ModalContext, ModalPosition } from '../../../app/context/ModalContext'
import { WidgetContext } from '../../../app/context/WidgetContext'
import CounterpartyBalance from '../../../Components/ModalContent/CounterpartyBalance'
import InvalidTakerAddressModal from '../../../Components/ModalContent/InvalidTakerAddressModal'
import TransactionStatus from '../../../Components/ModalContent/TransactionStatus'
import { ValidationUIVariant } from '../../../Components/validationComponents/asValidationUI'
import createValidatedValue from '../../../Components/validationComponents/createValidatedValue'
import { formatValidationMessage } from '../../../Components/validationComponents/validators'
import ArrowIcon, { ArrowDirection } from '../../../elements/ArrowIcon'
import Button, { ButtonSize, ButtonVariant } from '../../../elements/Button'
import Card from '../../../elements/Card'
import DisplayLabel from '../../../elements/DisplayLabel'
import { Flex } from '../../../elements/Flex'
import MediaQuery from '../../../elements/MediaQueryWrapper'
import { H6, H7 } from '../../../elements/Typography'
import { ReactComponent as ArrowRightIcon } from '../../../static/arrow-right-icon.svg'
import theme from '../../../theme'
import { FlatSignedSwapOrder, GasLevel } from '../../../types/models/Orders'
import { TokenKind, TokenKindInterfaceMap } from '../../../types/models/Tokens'
import { isMobile } from '../../../utils/helpers'
import {
  calculateExchangeRate,
  ExpirationMultiplier,
  ExpirationType,
  formatExpirationFromDate,
} from '../../../utils/numbers'
import { condenseAddress } from '../../../utils/transformations'
import useInterval from '../../../utils/useInterval'
import createFlowChecks from '../../createFlowChecks'
import Container, { TakerOrderCardDispatchProps, TakerOrderCardProps } from './Container'
import PriceLabel from './PriceLabel'
import {
  ArrowContainer,
  BlockH7,
  BottomContainer,
  BottomContainerContent,
  BottomContainerItem,
  BottomContainerItemLabel,
  CustomError,
  OrderDetails,
  SendReceiveContent,
  SendReceiveContentHeader,
  Subtitle,
  TakeOrderButtonIcon,
  Title,
  TokenLabelContainer,
  TopContainer,
} from './styles'
import { ValidatedTokenLabel } from './TokenLabel'

function TakerOrderCard(props: TakerOrderCardProps & TakerOrderCardDispatchProps) {
  const [takerTokenAddress, setTakerTokenAddress] = createValidatedValue<string>()
  const [takerParam, setTakerParam] = createValidatedValue<string>()
  const [takerWallet, setTakerWallet] = createValidatedValue<string>()
  const [takerTokenKind, setTakerTokenKind] = useState<TokenKind>(TokenKind.ERC20)
  const [takerTokenId, setTakerTokenId] = useState<string>()

  const [makerTokenAddress, setMakerTokenAddress] = createValidatedValue<string>()
  const [makerParam, setMakerParam] = createValidatedValue<string>()
  const [makerAddress, setMakerAddress] = createValidatedValue<string>()
  const [makerTokenKind, setMakerTokenKind] = useState<TokenKind>(TokenKind.ERC20)
  const [makerTokenId, setMakerTokenId] = useState<string>()

  const [expirationString, setExpirationString] = useState<string>('')
  const [takeAnyway, setTakeAnyway] = useState<boolean>(false)
  const [verifiedTakerToken, setVerifiedTakerToken] = useState<boolean>(false)
  const [verifiedMakerToken, setVerifiedMakerToken] = useState<boolean>(false)

  const { setModalOpen, setModalContent, setModalSettings } = useContext(ModalContext)
  const { isFormSubmitting, setIsFormSubmitting, shouldProgress, setShouldProgress } = useContext(FormSubmitContext)
  const { isWidget, widgetParams } = useContext(WidgetContext)

  const {
    checkSwapFailure,
    checkSecurityTokenPreTransfer,
    checkSimilarTokenExists,
    checkWalletConnection,
    checkTokenBalance,
    checkBalanceAndWrap,
    checkTokenApproval,
    checkComplianceServiceWhitelist,
  } = createFlowChecks()

  const isExpirationImminent = () => {
    if (props.order.expiry) {
      const remaining = props.order.expiry - Date.now() / 1000
      return remaining < ExpirationMultiplier[ExpirationType.MINUTES] * 5
    }
    return false
  }

  const getTokenVariant = tokenAddress => {
    const tokenSymbol = props.tokensByAddress[tokenAddress] ? props.tokensByAddress[tokenAddress].symbol : ''

    let tokenVariant
    if (props.airswapApprovedTokensByAddress[tokenAddress]) {
      tokenVariant = 'good'
    } else if (props.airswapApprovedTokensBySymbol[tokenSymbol]) {
      tokenVariant = 'bad'
    } else {
      tokenVariant = 'unknown'
    }
    return tokenVariant
  }

  useEffect(() => {
    // Set gas level to fastest for now
    props.setGasLevel(GasLevel.FASTEST)
  }, [])

  // validate order and set state if valid
  useEffect(() => {
    if (props.order) {
      const takerToken = props.tokensByAddress[props.order.takerToken]
      const formattedTakerAmount = props.getDisplayByToken(
        { address: props.order.takerToken },
        props.order.takerAmount || '',
      )
      setTakerParam(
        props.order.takerKind === TokenKindInterfaceMap[TokenKind.ERC20] ||
          props.order.takerKind === TokenKindInterfaceMap[TokenKind.ERC1155]
          ? formattedTakerAmount
          : props.order.takerId || '',
      )
      setTakerTokenId(props.order.takerId)
      setTakerTokenAddress(props.order.takerToken)
      setTakerWallet(props.order.takerWallet)
      setTakerTokenKind((takerToken && takerToken.kind) || TokenKind.ERC20)

      const makerToken = props.tokensByAddress[props.order.makerToken]
      const formattedMakerAmount = props.getDisplayByToken(
        { address: props.order.makerToken },
        props.order.makerAmount || '',
      )
      setMakerParam(
        props.order.makerKind === TokenKindInterfaceMap[TokenKind.ERC20] ||
          props.order.makerKind === TokenKindInterfaceMap[TokenKind.ERC1155]
          ? formattedMakerAmount
          : props.order.makerId || '',
      )
      setMakerTokenId(props.order.makerId)
      setMakerTokenAddress(props.order.makerToken)
      setMakerAddress(props.order.makerWallet)
      setMakerTokenKind((makerToken && makerToken.kind) || TokenKind.ERC20)

      setExpirationString(formatExpirationFromDate(props.order.expiry || 0))
    }
  }, [JSON.stringify(props.order), props.getDisplayByToken])

  // Fetch pre-transfer check if maker/taker token is security token
  useEffect(() => {
    const makerToken = props.tokensByAddress[makerTokenAddress.value || '']
    const takerToken = props.tokensByAddress[takerTokenAddress.value || '']

    if (props.connectedWalletAddress && makerAddress.value) {
      if (makerToken && makerToken.security) {
        props.fetchDsProtocolPreTransferCheck({
          contractAddress: makerToken.address,
          from: makerAddress.value || '',
          to: props.connectedWalletAddress,
          value: props.getAtomicByToken({ address: makerToken.address }, makerParam.value || ''),
        })
      } else if (takerToken && takerToken.security) {
        props.fetchDsProtocolPreTransferCheck({
          contractAddress: takerToken.address,
          from: props.connectedWalletAddress,
          to: makerAddress.value || '',
          value: props.getAtomicByToken({ address: takerToken.address }, takerParam.value || ''),
        })
      }
    }
  }, [
    makerTokenAddress.value,
    takerTokenAddress.value,
    makerParam.value,
    takerParam.value,
    makerAddress.value,
    props.connectedWalletAddress,
  ])

  // Check ERC-1155 Whitelist
  useEffect(() => {
    if (makerTokenKind === TokenKind.ERC1155 && makerTokenAddress.value && props.connectedWalletAddress) {
      props.checkComplianceServiceWhitelist({
        walletAddress: props.connectedWalletAddress,
        erc1155Address: makerTokenAddress.value,
      })
    }

    if (takerTokenKind === TokenKind.ERC1155 && takerTokenAddress.value && props.connectedWalletAddress) {
      props.checkComplianceServiceWhitelist({
        walletAddress: props.connectedWalletAddress,
        erc1155Address: takerTokenAddress.value,
      })
    }
  }, [props.connectedWalletAddress, takerTokenKind, makerTokenKind, takerTokenAddress.value, makerTokenAddress.value])

  // Check Taker NFT Balance
  useEffect(() => {
    if (takerTokenAddress.value && takerParam.value) {
      if (takerTokenKind === TokenKind.ERC721) {
        props.fetchERC721OwnerOf({ contractAddress: takerTokenAddress.value, tokenId: takerParam.value })
        props.fetchERC721GetApproved({ contractAddress: takerTokenAddress.value, tokenId: takerParam.value })
      } else if (takerTokenKind === TokenKind.ERC1155) {
        props.fetchERC1155BalanceOf({
          contractAddress: takerTokenAddress.value,
          owner: props.connectedWalletAddress,
          id: takerTokenId,
        })
        props.fetchERC1155IsApprovedForAll({
          contractAddress: takerTokenAddress.value,
          owner: props.connectedWalletAddress,
          operator: SWAP_CONTRACT_ADDRESS,
        })
      }
    }
  }, [takerTokenId, takerTokenKind, takerTokenAddress.value, takerParam.value, props.connectedWalletAddress])

  // Check Maker Balances
  useEffect(() => {
    if (!makerTokenAddress.value || !makerParam.value || !makerAddress.value) return
    if (!props.areTokensReady) return

    // Check Maker Balance
    if (
      makerTokenAddress.value &&
      makerAddress.value &&
      props.tokensByAddress[makerTokenAddress.value] &&
      makerTokenKind !== TokenKind.ERC721 &&
      makerTokenKind !== TokenKind.ERC1155
    ) {
      const makerBalances = props.trackedBalances[makerAddress.value]
      if (!makerBalances) return
      const makerBalance = makerBalances[makerTokenAddress.value]
      const makerTokenSymbol = props.tokensByAddress[makerTokenAddress.value].symbol
      const displayMakerBalance = props.getDisplayByToken({ address: makerTokenAddress.value }, makerBalance)
      const atomicMakerAmount = props.getAtomicByToken({ address: makerTokenAddress.value }, makerParam.value || '')

      if (new BigNumber(makerBalance).lt(atomicMakerAmount)) {
        makerParam.setMessage(
          formatValidationMessage(
            'Warning!',
            false,
            <CustomError>{`Counterparty balance is ${displayMakerBalance} ${makerTokenSymbol}`}</CustomError>,
          ),
        )
        console.warn('not enough balance')
      }
    }
  }, [makerTokenAddress.value, makerParam.value, makerAddress.value, props.areTokensReady])

  useInterval(() => {
    setExpirationString(formatExpirationFromDate(props.order ? props.order.expiry || 0 : 0))
  }, 1000)

  const getSymbolFromAddress = (tokenAddress: string | null) => {
    if (!tokenAddress || !props.tokensByAddress || !props.tokensByAddress[tokenAddress]) return 'N/A'
    return props.tokensByAddress[tokenAddress].symbol
  }

  const showTakerErrorModal = address => {
    setModalContent(<InvalidTakerAddressModal address={address} />)
    setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
    setModalOpen(true)
  }

  const showTransactionTrackingModal = (order: FlatSignedSwapOrder) => {
    setModalContent(<TransactionStatus isTransaction hideClose orderId={getSwapOrderId(order)} />)
    setModalSettings({ mobilePosition: ModalPosition.BOTTOM, canDismiss: false })
    setModalOpen(true)
  }

  // Take Order
  useEffect(() => {
    if (isFormSubmitting && shouldProgress) {
      const doTakeOrder = async () => {
        const makerToken = props.tokensByAddress[makerTokenAddress.value || '']
        const takerToken = props.tokensByAddress[takerTokenAddress.value || '']
        if (
          !props.order ||
          !makerToken ||
          !takerToken ||
          takerWallet.value === null ||
          makerAddress.value === null ||
          makerParam.value === null ||
          takerParam.value === null
        )
          return

        // Check Wallet Connection
        if (!checkWalletConnection()) return

        // Check Wallet Address
        if (
          takerWallet.value !== ETH_ADDRESS &&
          takerWallet.value.toLowerCase() !== props.connectedWalletAddress.toLowerCase()
        ) {
          setShouldProgress(false)
          showTakerErrorModal(props.order.takerWallet)
          setIsFormSubmitting(false)
          return
        }

        // Check Taker Balance
        if (!checkTokenBalance(takerToken.address, takerTokenKind, takerParam, setTakerParam, takerTokenId)) {
          return
        }

        const makerAmountAtomic = props.getAtomicByToken({ address: makerToken.address }, makerParam.value)
        const makerTokenBalance = props.getBalanceForToken(makerAddress.value, makerToken.address)

        // If maker or taker token is a security, do pre-transfer check
        if (
          (makerToken.security || takerToken.security) &&
          !checkSecurityTokenPreTransfer({
            expiry: props.order.expiry,
            makerToken: props.order.makerToken,
            makerAmount: props.order.makerAmount || '',
            makerWallet: props.order.makerWallet,
            takerToken: props.order.takerToken,
            takerAmount: props.order.takerAmount || '',
            takerWallet: props.order.takerWallet,
          })
        ) {
          return
        }

        // Check Maker Balance
        if (
          new BigNumber(makerTokenBalance).lt(new BigNumber(makerAmountAtomic)) &&
          !takeAnyway &&
          makerTokenKind !== TokenKind.ERC721 &&
          makerTokenKind !== TokenKind.ERC1155
        ) {
          setShouldProgress(false)
          setModalContent(<CounterpartyBalance setTakeAnyway={setTakeAnyway} />)
          setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
          setModalOpen(true)
          return
        }

        // Check for similar token names
        if (!verifiedTakerToken && !checkSimilarTokenExists(takerToken.address, () => setVerifiedTakerToken(true))) {
          return
        }

        if (!verifiedMakerToken && !checkSimilarTokenExists(makerToken.address, () => setVerifiedMakerToken(true))) {
          return
        }

        // Check Token Approval
        if (!checkTokenApproval(takerToken.address, takerTokenKind, takerParam.value)) {
          return
        }

        // If sending ETH/WETH, check WETH Balance and Wrap
        if (
          (takerTokenAddress.value === WETH_CONTRACT_ADDRESS || takerTokenAddress.value === ETH_ADDRESS) &&
          !checkBalanceAndWrap(takerParam.value)
        ) {
          return
        }

        // Check ERC-1155 Whitelist for taker
        // Note: We are not doing maker whitelist check here because that happens on order creation.
        if (
          makerToken.kind === TokenKind.ERC1155 &&
          !checkComplianceServiceWhitelist(makerToken.address, props.connectedWalletAddress)
        ) {
          return
        }

        if (
          takerToken.kind === TokenKind.ERC1155 &&
          !checkComplianceServiceWhitelist(takerToken.address, props.connectedWalletAddress)
        ) {
          return
        }

        // One final check for swap failures.
        // This informs users of failures that may not have been caught in the previous flow checks
        if (!(await checkSwapFailure(props.order))) {
          return
        }

        // Finally, Take Order
        try {
          setShouldProgress(false)
          if (Number(widgetParams.orderGasLimit)) {
            props.fillSwap(props.order, { gasLimit: Number(widgetParams.orderGasLimit) })
          } else {
            props.fillSwap(props.order)
          }
          showTransactionTrackingModal(props.order)
          setIsFormSubmitting(false)
        } catch (e) {
          console.warn(`Failed to take order: ${e}`)
          setShouldProgress(false)
          setIsFormSubmitting(false)
          setTakeAnyway(false)
          setModalOpen(false)
        }
      }

      doTakeOrder()
    }
  }, [
    shouldProgress,
    isFormSubmitting,
    props.connectedWalletAddress,
    props.getAtomicByToken,
    JSON.stringify(verifiedMakerToken),
    JSON.stringify(verifiedTakerToken),
    JSON.stringify(props.order),
    JSON.stringify(props.connectedApprovals),
    Object.keys(props.tokensByAddress).length,
  ])

  const onSubmit = () => {
    if (isWidget && widgetParams.onSubmit) {
      widgetParams.onSubmit()
    }
    setIsFormSubmitting(true)
    setShouldProgress(true)
  }

  const isExpired = expirationString === 'Expired'
  const showPriceLabel =
    makerTokenKind !== TokenKind.ERC721 &&
    makerTokenKind !== TokenKind.ERC1155 &&
    takerTokenKind !== TokenKind.ERC721 &&
    takerTokenKind !== TokenKind.ERC1155

  const widgetPrimaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.primaryColor
    : undefined
  const widgetSecondaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.secondaryColor
    : undefined

  return (
    <Card>
      <TopContainer color={widgetPrimaryColor}>
        {/* Send */}
        <Title>
          {isExpired ? (
            <FormattedMessage defaultMessage="Trade Expired" />
          ) : (
            <FormattedMessage defaultMessage="Complete This Trade" />
          )}
        </Title>
        <Subtitle>
          {isExpired ? (
            <FormattedMessage defaultMessage="Trade expired and is no longer available" />
          ) : (
            <FormattedMessage defaultMessage="Review the terms of this trade and accept below" />
          )}
        </Subtitle>
        <OrderDetails>
          <SendReceiveContent align="flex-end">
            <MediaQuery size="sm">
              <SendReceiveContentHeader textAlign="center">
                <FormattedMessage defaultMessage="You'll send" />
              </SendReceiveContentHeader>
              <TokenLabelContainer>
                <ValidatedTokenLabel
                  errorOffset={showPriceLabel ? 60 : 20}
                  errorAlign="center"
                  tokenKind={takerTokenKind}
                  value={takerParam}
                  tokenId={takerTokenId}
                  tokenAddress={takerTokenAddress.value}
                  symbol={getSymbolFromAddress(takerTokenAddress.value)}
                  tokenVariant={getTokenVariant(takerTokenAddress.value)}
                />
              </TokenLabelContainer>
            </MediaQuery>
            <MediaQuery size="md-up">
              <SendReceiveContentHeader textAlign="right">
                <FormattedMessage defaultMessage="You'll send" />
              </SendReceiveContentHeader>
              <TokenLabelContainer>
                <ValidatedTokenLabel
                  errorOffset={showPriceLabel ? 60 : 20}
                  errorAlign="right"
                  tokenKind={takerTokenKind}
                  value={takerParam}
                  tokenId={takerTokenId}
                  tokenAddress={takerTokenAddress.value}
                  symbol={getSymbolFromAddress(takerTokenAddress.value)}
                  tokenVariant={getTokenVariant(takerTokenAddress.value)}
                />
              </TokenLabelContainer>
            </MediaQuery>
            {showPriceLabel && (
              <PriceLabel
                value={calculateExchangeRate(takerParam.value, makerParam.value)}
                baseTokenSymbol={getSymbolFromAddress(takerTokenAddress.value)}
                tokenSymbol={getSymbolFromAddress(makerTokenAddress.value)}
              />
            )}
          </SendReceiveContent>

          <ArrowContainer>
            <MediaQuery size="sm">
              <ArrowIcon color={widgetPrimaryColor} direction={ArrowDirection.DOWN} />
            </MediaQuery>
            <MediaQuery size="md-up">
              <ArrowIcon color={widgetPrimaryColor} direction={ArrowDirection.RIGHT} />
            </MediaQuery>
          </ArrowContainer>

          {/* Receive */}
          <SendReceiveContent align="flex-start">
            <MediaQuery size="sm">
              <SendReceiveContentHeader textAlign="center">
                <FormattedMessage defaultMessage="You'll receive" />
              </SendReceiveContentHeader>
              <TokenLabelContainer>
                <ValidatedTokenLabel
                  errorOffset={showPriceLabel ? 60 : 20}
                  errorAlign="center"
                  tokenKind={makerTokenKind}
                  value={makerParam}
                  tokenId={makerTokenId}
                  tokenAddress={makerTokenAddress.value}
                  symbol={getSymbolFromAddress(makerTokenAddress.value)}
                  tokenVariant={getTokenVariant(makerTokenAddress.value)}
                />
              </TokenLabelContainer>
            </MediaQuery>
            <MediaQuery size="md-up">
              <SendReceiveContentHeader textAlign="left">
                <FormattedMessage defaultMessage="You'll receive" />
              </SendReceiveContentHeader>
              <TokenLabelContainer>
                <ValidatedTokenLabel
                  errorOffset={showPriceLabel ? 60 : 20}
                  errorAlign="left"
                  tokenKind={makerTokenKind}
                  value={makerParam}
                  tokenId={makerTokenId}
                  tokenAddress={makerTokenAddress.value}
                  symbol={getSymbolFromAddress(makerTokenAddress.value)}
                  tokenVariant={getTokenVariant(makerTokenAddress.value)}
                />
              </TokenLabelContainer>
            </MediaQuery>
            {showPriceLabel && (
              <PriceLabel
                value={calculateExchangeRate(makerParam.value, takerParam.value)}
                baseTokenSymbol={getSymbolFromAddress(makerTokenAddress.value)}
                tokenSymbol={getSymbolFromAddress(takerTokenAddress.value)}
              />
            )}
          </SendReceiveContent>
        </OrderDetails>
      </TopContainer>
      <BottomContainer>
        <BottomContainerContent>
          <BottomContainerItem>
            <BottomContainerItemLabel>
              <FormattedMessage defaultMessage="Counterparty Address" />
            </BottomContainerItemLabel>
            <DisplayLabel color={widgetSecondaryColor} value={makerAddress.value || ''} clickToOpenEtherscan expand>
              <BlockH7>{condenseAddress(makerAddress.value || '', true)}</BlockH7>
            </DisplayLabel>
          </BottomContainerItem>
          <BottomContainerItem>
            <BottomContainerItemLabel>
              <FormattedMessage defaultMessage="Expires in" />
            </BottomContainerItemLabel>
            <DisplayLabel
              color={widgetSecondaryColor}
              colorVariant={isExpired ? ValidationUIVariant.ERROR : ValidationUIVariant.DEFAULT}
            >
              <H7
                weight={theme.text.fontWeight.medium}
                color={
                  isExpired || isExpirationImminent()
                    ? theme.palette.errorColor
                    : widgetSecondaryColor || theme.palette.primaryColor
                }
                opacity={expirationString === 'Expired' ? 0.5 : 1}
              >
                {expirationString}
              </H7>
            </DisplayLabel>
          </BottomContainerItem>
          <Button
            dataTest="take-order-btn"
            variant={ButtonVariant.PRIMARY}
            backgroundColor={widgetPrimaryColor}
            expand={isMobile()}
            size={ButtonSize.LARGE}
            disabled={isExpired}
            onClick={onSubmit}
            hoverColor={theme.palette.successColor}
          >
            <Flex align="center" direction="row" justify="center">
              <H6 fit>
                <FormattedMessage defaultMessage="Take" />
              </H6>
              <TakeOrderButtonIcon>
                <ArrowRightIcon />
              </TakeOrderButtonIcon>
            </Flex>
          </Button>
        </BottomContainerContent>
      </BottomContainer>
    </Card>
  )
}

export default Container(withRouter(TakerOrderCard))
