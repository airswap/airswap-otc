import {
  DAI_CONTRACT_ADDRESS,
  ETH_ADDRESS,
  OTC_AFFILIATE_ADDRESS,
  SWAP_CONTRACT_ADDRESS,
  WETH_CONTRACT_ADDRESS,
} from 'airswap.js/src/constants'
import { ipfsStoreJSON } from 'airswap.js/src/ipfs'
import { getSwapOrderId } from 'airswap.js/src/swap/utils'
import React, { useContext, useEffect, useState } from 'react'

import { FormSubmitContext } from '../../app/context/FormSubmitContext'
import { ModalContext, ModalPosition } from '../../app/context/ModalContext'
import { WidgetContext } from '../../app/context/WidgetContext'
import BuildOrderForm from '../../Components/BuildOrderForm'
import TransactionStatus from '../../Components/ModalContent/TransactionStatus'
import createValidatedValue, { ValidatedValue } from '../../Components/validationComponents/createValidatedValue'
import {
  formatValidationMessage,
  RequiredValidator,
  TokenAddressValidator,
} from '../../Components/validationComponents/validators'
import Card from '../../elements/Card'
import { SignedSimpleSwapOrderType } from '../../types/models/Orders'
import { TokenKind, TokenKindInterfaceMap } from '../../types/models/Tokens'
import { getExpirationFromMinutes, redirectWithParam } from '../../utils/helpers'
import { ExpirationType } from '../../utils/numbers'
import { isERC20 } from '../../utils/tokens'
import createFlowChecks from '../createFlowChecks'
import AvailableForTrade from './AvailableForTrade'
import Container, { MakerOrderCardProps } from './Container'

function MakerOrderCard(props: MakerOrderCardProps) {
  const [makerTokenKind, setMakerTokenKind] = useState<TokenKind>(TokenKind.ERC20)
  const [makerTokenAddress, setMakerTokenAddress] = createValidatedValue<string>([RequiredValidator], null)
  const [makerTokenId, setMakerTokenId] = useState<string>() // This is only for erc-1155
  const [makerParam, setMakerParam] = createValidatedValue<string>([RequiredValidator])

  const [takerTokenKind, setTakerTokenKind] = useState<TokenKind>(TokenKind.ERC20)
  const [takerTokenAddress, setTakerTokenAddress] = createValidatedValue<string>([RequiredValidator], null)
  const [takerTokenId, setTakerTokenId] = useState<string>() // This is only for erc-1155
  const [takerParam, setTakerParam] = createValidatedValue<string>([RequiredValidator])
  const [takerWallet, setTakerWallet] = createValidatedValue<string>([TokenAddressValidator])

  const [orderExpiry, setOrderExpiry] = createValidatedValue<string>([RequiredValidator], '1')
  const [expirationType, setExpirationType] = useState<ExpirationType>(ExpirationType.HOURS)

  const { isWidget, widgetParams } = useContext(WidgetContext)
  const { setModalContent, setModalOpen, setModalSettings } = useContext(ModalContext)
  const { isFormSubmitting, setIsFormSubmitting, shouldProgress, setShouldProgress } = useContext(FormSubmitContext)

  const {
    checkComplianceServiceWhitelist,
    checkSecurityTokenPreTransfer,
    checkWalletConnection,
    checkTokenBalance,
    checkBalanceAndWrap,
    checkTokenApproval,
  } = createFlowChecks()

  // Initialize Default Trading Pair (DAI <-> ETH)
  useEffect(() => {
    if (!makerTokenAddress.value && props.tokensByAddress[DAI_CONTRACT_ADDRESS]) {
      setMakerTokenAddress(DAI_CONTRACT_ADDRESS)
    }
    if (!takerTokenAddress.value && props.tokensByAddress[ETH_ADDRESS]) {
      setTakerTokenAddress(ETH_ADDRESS)
    }
  }, [Object.keys(props.tokensByAddress).length])

  // Fetch ERC-1155 Balance & Whitelist
  useEffect(() => {
    if (props.connectedWalletAddress) {
      if (makerTokenKind === TokenKind.ERC1155 && makerTokenAddress.value && makerTokenId && makerParam.value) {
        props.fetchERC1155BalanceOf({
          contractAddress: makerTokenAddress.value,
          owner: props.connectedWalletAddress,
          id: makerTokenId,
        })
        props.fetchERC1155IsApprovedForAll({
          contractAddress: makerTokenAddress.value,
          owner: props.connectedWalletAddress,
          operator: SWAP_CONTRACT_ADDRESS,
        })

        // Check Maker erc-1155 whitelist
        props.checkComplianceServiceWhitelist({
          walletAddress: props.connectedWalletAddress,
          erc1155Address: makerTokenAddress.value,
        })
        if (takerWallet.value) {
          props.checkComplianceServiceWhitelist({
            walletAddress: takerWallet.value,
            erc1155Address: makerTokenAddress.value,
          })
        }
      } else if (takerTokenKind === TokenKind.ERC1155 && takerTokenAddress.value && takerTokenId && takerParam.value) {
        // Check Taker erc-1155 whitelist
        props.checkComplianceServiceWhitelist({
          walletAddress: props.connectedWalletAddress,
          erc1155Address: takerTokenAddress.value,
        })
        if (takerWallet.value) {
          props.checkComplianceServiceWhitelist({
            walletAddress: takerWallet.value,
            erc1155Address: takerTokenAddress.value,
          })

          // Track taker erc-1155 balance
          props.fetchERC1155BalanceOf({
            contractAddress: takerTokenAddress.value,
            owner: takerWallet.value,
            id: takerTokenId,
          })
        }
      }
    }
  }, [
    props.connectedWalletAddress,
    takerWallet.value,
    makerTokenAddress.value,
    takerTokenAddress.value,
    makerParam.value,
    takerParam.value,
    makerTokenId,
    takerTokenId,
    makerTokenKind,
    takerTokenKind,
  ])

  // Fetch Pre Transfer Check if maker/taker token is a security
  useEffect(() => {
    const makerToken = props.tokensByAddress[makerTokenAddress.value || '']
    const takerToken = props.tokensByAddress[takerTokenAddress.value || '']
    if (props.connectedWalletAddress && takerWallet.value && makerParam.value && takerParam.value) {
      if (makerToken && makerToken.security) {
        props.fetchDsProtocolPreTransferCheck({
          contractAddress: makerToken.address,
          from: props.connectedWalletAddress,
          to: takerWallet.value,
          value: props.getAtomicByToken({ address: makerToken.address }, makerParam.value),
        })
      } else if (takerToken && takerToken.security) {
        props.fetchDsProtocolPreTransferCheck({
          contractAddress: takerToken.address,
          from: takerWallet.value,
          to: props.connectedWalletAddress,
          value: props.getAtomicByToken({ address: takerToken.address }, takerParam.value),
        })
      }
    }
  }, [
    props.connectedWalletAddress,
    takerWallet.value,
    makerTokenAddress.value,
    takerTokenAddress.value,
    makerParam.value,
    takerParam.value,
    Object.keys(props.tokensByAddress).length,
  ])

  useEffect(() => {
    // Set default token from widget
    if (isWidget) {
      if (widgetParams.defaultMakerToken) {
        setMakerTokenAddress(widgetParams.defaultMakerToken)
      }
      if (widgetParams.defaultTakerToken) {
        setTakerTokenAddress(widgetParams.defaultTakerToken)
      }
    }

    // Set order from widget
    if (isWidget && widgetParams.order && props.tokensByAddress && props.getDisplayByToken) {
      const order = widgetParams.order

      // populate
      if (order.maker) {
        if (order.maker.token && props.tokensByAddress[order.maker.token]) {
          setMakerTokenAddress(order.maker.token)
          makerTokenAddress.setLocked(true)
        }
        if ((order.maker.amount || order.maker.id || order.maker.param) && order.maker.token) {
          const displayParam = props.getDisplayByToken(
            { address: order.maker.token },
            order.maker.amount || order.maker.param || '',
          )
          setMakerParam(
            order.maker.kind !== TokenKindInterfaceMap[TokenKind.ERC721] ? displayParam : order.maker.id || '',
          )
          setMakerTokenId(order.maker.id)
          makerParam.setLocked(true)
        }
        if (
          order.maker.kind &&
          Object.values(TokenKind).includes(TokenKindInterfaceMap[order.maker.kind] as TokenKind)
        ) {
          setMakerTokenKind(TokenKindInterfaceMap[order.maker.kind] as TokenKind)
        }
      }

      if (order.taker) {
        if (order.taker.token && props.tokensByAddress[order.taker.token]) {
          setTakerTokenAddress(order.taker.token)
          takerTokenAddress.setLocked(true)
        }
        if ((order.taker.amount || order.taker.id || order.taker.param) && order.taker.token) {
          const displayParam = props.getDisplayByToken(
            { address: order.taker.token },
            order.taker.amount || order.taker.param || '',
          )
          setTakerParam(
            order.taker.kind !== TokenKindInterfaceMap[TokenKind.ERC721] ? displayParam : order.taker.id || '',
          )
          setTakerTokenId(order.taker.id)
          takerParam.setLocked(true)
        }
        if (
          order.taker.kind &&
          Object.values(TokenKind).includes(TokenKindInterfaceMap[order.taker.kind] as TokenKind)
        ) {
          setTakerTokenKind(TokenKindInterfaceMap[order.taker.kind] as TokenKind)
        }
        if (order.taker.wallet) {
          setTakerWallet(order.taker.wallet)
          takerWallet.setLocked(true)
          takerWallet.validate()
        }
      }

      if (order.expiry) {
        setOrderExpiry(`${order.expiry}`)
        orderExpiry.setLocked(true)
      }
    }
  }, [isWidget, JSON.stringify(widgetParams), Object.keys(props.tokensByAddress).length, props.getDisplayByToken])

  // Display Maker Token Balance
  useEffect(() => {
    if (props.connectedWalletAddress && makerTokenAddress.value && isERC20(makerTokenKind)) {
      const makerToken = props.tokensByAddress[makerTokenAddress.value]
      if (!makerToken) return

      const makerTokenBalance = props.getBalanceForToken(props.connectedWalletAddress, makerToken.address, true)
      if (makerTokenBalance !== undefined) {
        const displayMakerTokenBalance = props.getDisplayByToken({ address: makerToken.address }, makerTokenBalance)

        const onAvailableBalanceClick = () => {
          setMakerParam(displayMakerTokenBalance)
        }

        makerParam.setMessage(
          formatValidationMessage(
            undefined,
            false,
            <AvailableForTrade
              locked={makerParam.locked}
              value={displayMakerTokenBalance}
              symbol={makerToken.symbol}
              onClick={onAvailableBalanceClick}
            />,
          ),
        )
      }
    } else {
      makerParam.setMessage(null)
    }
  }, [props.getBalanceForToken, makerTokenAddress.value, props.connectedWalletAddress, makerTokenKind])

  useEffect(() => {
    if (!props.connectedWalletAddress || !makerTokenAddress.value || !takerTokenAddress.value) return

    // Track token if not tracked
    if (
      !props.trackedTokensByAddress[props.connectedWalletAddress] ||
      !props.trackedTokensByAddress[props.connectedWalletAddress].indexOf(makerTokenAddress.value)
    ) {
      props.addTrackedAddress({
        address: props.connectedWalletAddress,
        tokenAddress: makerTokenAddress.value.toLowerCase(),
      })
    }

    if (
      !props.trackedTokensByAddress[props.connectedWalletAddress] ||
      !props.trackedTokensByAddress[props.connectedWalletAddress].indexOf(takerTokenAddress.value)
    ) {
      props.addTrackedAddress({
        address: props.connectedWalletAddress,
        tokenAddress: takerTokenAddress.value.toLowerCase(),
      })
    }
  }, [
    props.connectedWalletAddress,
    takerTokenAddress.value,
    makerTokenAddress.value,
    JSON.stringify(props.trackedTokensByAddress),
  ])

  // Create Order Flow
  useEffect(() => {
    if (isFormSubmitting && shouldProgress) {
      const makerTokenAddressValue = makerTokenAddress.value ? makerTokenAddress.value.toLowerCase() : ''
      const takerTokenAddressValue = takerTokenAddress.value ? takerTokenAddress.value.toLowerCase() : ''
      const makerToken = props.tokensByAddress[makerTokenAddressValue]
      const takerToken = props.tokensByAddress[takerTokenAddressValue]

      const createOrder = async () => {
        if (!orderExpiry.value || !makerToken || !takerToken || !takerParam.value || !makerParam.value) return

        // Check if ENS name has been validated
        if (props.ensError) {
          takerWallet.setMessage(formatValidationMessage(props.ensError, true))
          setShouldProgress(false)
          setIsFormSubmitting(false)
          return
        }

        // Check Wallet Connection
        if (!checkWalletConnection()) return

        // Check Maker Token Balance
        if (!checkTokenBalance(makerTokenAddressValue, makerTokenKind, makerParam, setMakerParam, makerTokenId, true)) {
          return
        }

        // Check Token Approval
        if (
          makerTokenAddressValue !== ETH_ADDRESS &&
          !checkTokenApproval(
            makerTokenAddressValue,
            makerTokenKind,
            makerTokenKind === TokenKind.ERC721 ? makerParam.value : makerTokenId,
          )
        ) {
          return
        }

        // If sending ETH/WETH, check WETH Balance and Wrap
        if (
          (makerTokenAddressValue === ETH_ADDRESS || makerTokenAddressValue === WETH_CONTRACT_ADDRESS) &&
          !checkBalanceAndWrap(makerParam.value)
        ) {
          return
        }

        // If sending ETH, check token approval for WETH
        if (makerTokenAddressValue === ETH_ADDRESS && !checkTokenApproval(WETH_CONTRACT_ADDRESS, makerTokenKind)) {
          return
        }

        // Check ERC-1155 Whitelist
        // Note: ERC-1155 is not supported for general use
        if (makerTokenKind === TokenKind.ERC1155) {
          // Counterparty is specified
          if (takerWallet.value && !checkComplianceServiceWhitelist(makerTokenAddressValue, takerWallet.value)) {
            return
          }
          if (!checkComplianceServiceWhitelist(makerTokenAddressValue, props.connectedWalletAddress)) {
            return
          }
        }
        if (takerTokenKind === TokenKind.ERC1155) {
          // Counterparty is specified
          if (takerWallet.value && !checkComplianceServiceWhitelist(takerTokenAddressValue, takerWallet.value)) {
            return
          }
          if (!checkComplianceServiceWhitelist(takerTokenAddressValue, props.connectedWalletAddress)) {
            return
          }
        }

        const expiration = orderExpiry.locked
          ? Number(orderExpiry.value)
          : getExpirationFromMinutes(orderExpiry.value, expirationType)
        const makerAmountAtomic = props.getAtomicByToken({ address: makerTokenAddressValue }, makerParam.value || '')
        const takerAmountAtomic = props.getAtomicByToken({ address: takerTokenAddressValue }, takerParam.value)

        const order = {
          expiry: expiration,
          nonce: Date.now(),
          maker: {
            wallet: props.connectedWalletAddress,
            token: makerTokenAddressValue === ETH_ADDRESS ? WETH_CONTRACT_ADDRESS : makerTokenAddressValue,
            amount: makerTokenKind !== TokenKind.ERC721 ? makerAmountAtomic : '0',
            id:
              makerTokenKind === TokenKind.ERC721
                ? makerParam.value
                : makerTokenKind === TokenKind.ERC1155
                ? makerTokenId
                : '0',
            kind: TokenKindInterfaceMap[makerTokenKind],
          },
          taker: {
            wallet: takerWallet.value || '',
            token: takerTokenAddressValue === ETH_ADDRESS ? WETH_CONTRACT_ADDRESS : takerTokenAddressValue,
            amount: takerTokenKind !== TokenKind.ERC721 ? takerAmountAtomic : '0',
            id:
              takerTokenKind === TokenKind.ERC721
                ? takerParam.value
                : takerTokenKind === TokenKind.ERC1155
                ? takerTokenId
                : '0',
            kind: TokenKindInterfaceMap[takerTokenKind],
          },
          affiliate: {
            wallet: OTC_AFFILIATE_ADDRESS,
            token: ETH_ADDRESS,
            amount: '0',
            id: '0',
            kind: TokenKindInterfaceMap[TokenKind.ERC20],
          },
        }

        // If security token and counterparty address provided, do pre-transfer check
        if (
          (makerToken.security || takerToken.security) &&
          takerWallet.value &&
          takerWallet.value.length &&
          !checkSecurityTokenPreTransfer({
            expiry: order.expiry,
            makerToken: order.maker.token,
            makerAmount: order.maker.amount,
            makerWallet: order.maker.wallet,
            takerToken: order.taker.token,
            takerAmount: order.taker.amount,
            takerWallet: order.taker.wallet,
          })
        ) {
          return
        }

        // Make Order
        const makeOrder = async () => {
          // if user set an ENS name, map it to the corresponding address
          if (takerWallet && takerWallet.value && takerWallet.value.includes('.eth')) {
            order.taker.wallet = props.ensAddressesByName[takerWallet.value]
          }

          try {
            setShouldProgress(false)
            setModalContent(<TransactionStatus orderId={getSwapOrderId(order)} />)
            setModalSettings({ canDismiss: false, mobilePosition: ModalPosition.BOTTOM })
            setModalOpen(true)

            // Sign Order
            setIsFormSubmitting(false)

            const signedOrder: SignedSimpleSwapOrderType = await props.signOrder(order)
            const orderCID = await ipfsStoreJSON(JSON.stringify(signedOrder))
            props.addOutstandingMakerOrder({ ...signedOrder, orderCID })

            // Trigger Widget onCreate callback
            if (isWidget && widgetParams.onCreate) {
              const nestedSignedOrder = {
                ...order,
                signature: {
                  version: signedOrder.version,
                  signer: signedOrder.signer,
                  r: signedOrder.r,
                  s: signedOrder.s,
                  v: signedOrder.v,
                },
              }
              widgetParams.onCreate(nestedSignedOrder, orderCID)
            }

            redirectWithParam(orderCID, props.history)
          } catch (e) {
            console.warn(`Failed to sign order: ${e}`)
            setIsFormSubmitting(false)
            setShouldProgress(false)
            setModalOpen(false)
          }
        }

        makeOrder()
      }

      createOrder()
    }
  }, [
    shouldProgress,
    isFormSubmitting,
    props.connectedWalletAddress,
    makerTokenAddress.value,
    props.signOrder,
    props.getAtomicByToken,
    props.walletConnectionError,
    props.ensError,
    props.ensAddressesByName,
    JSON.stringify(props.connectedApprovals),
    JSON.stringify(props.trackedTokensByAddress),
    Object.keys(props.tokensByAddress).length,
  ])

  const swapValidatedValue = (
    value1: ValidatedValue<string>,
    value2: ValidatedValue<string>,
    setValue1: (value: string) => void,
    setValue2: (value: string) => void,
  ) => {
    const tempValue = value1.value
    setValue1(value2.value || '')
    value1.setMessage(null)
    setValue2(tempValue || '')
    value2.setMessage(null)
  }

  const reverse = () => {
    // Swap Values
    swapValidatedValue(makerParam, takerParam, setMakerParam, setTakerParam)
    swapValidatedValue(makerTokenAddress, takerTokenAddress, setMakerTokenAddress, setTakerTokenAddress)

    // Swap Token Kind
    const tempTokenKind = makerTokenKind
    setMakerTokenKind(takerTokenKind)
    setTakerTokenKind(tempTokenKind)

    // Swap Token Id
    const tempTokenId = makerTokenId
    setMakerTokenId(takerTokenId)
    setTakerTokenId(tempTokenId)
  }

  const validatetakerWalletInput = addressString => {
    setTakerWallet(addressString)
    if (props.isENSReady && addressString.includes('.eth')) {
      props.findAddressByENSName(addressString)
    }
  }

  const onSubmit = () => {
    setIsFormSubmitting(true)
    setShouldProgress(true)
  }

  return (
    <Card>
      <BuildOrderForm
        makerTokenAddress={makerTokenAddress}
        setMakerTokenAddress={setMakerTokenAddress}
        makerParam={makerParam}
        setMakerParam={setMakerParam}
        makerTokenId={makerTokenId}
        setMakerTokenId={setMakerTokenId}
        makerTokenKind={makerTokenKind}
        setMakerTokenKind={setMakerTokenKind}
        orderExpiry={orderExpiry}
        setOrderExpiry={setOrderExpiry}
        takerTokenAddress={takerTokenAddress}
        setTakerTokenAddress={setTakerTokenAddress}
        takerParam={takerParam}
        setTakerParam={setTakerParam}
        takerTokenId={takerTokenId}
        setTakerTokenId={setTakerTokenId}
        takerTokenKind={takerTokenKind}
        setTakerTokenKind={setTakerTokenKind}
        takerWallet={takerWallet}
        setTakerWallet={validatetakerWalletInput}
        expirationType={expirationType}
        setExpirationType={setExpirationType}
        onSubmit={onSubmit}
        isDoingENSLookup={props.isDoingENSLookup}
        ensError={props.ensError}
        isWalletConnected={!!props.connectedWalletAddress}
        reverse={reverse}
      />
    </Card>
  )
}

export default Container(MakerOrderCard)
