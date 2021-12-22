import { Validator } from '@airswap/protocols'
import { Order } from '@airswap/types'
import {
  ETH_ADDRESS,
  NETWORK,
  OTC_AFFILIATE_ADDRESS,
  SWAP_CONTRACT_ADDRESS,
  WETH_CONTRACT_ADDRESS,
} from 'airswap.js/src/constants'
import { selectors as balancesSelectors } from 'airswap.js/src/deltaBalances/redux'
import { getDsProtocolPreTransferCheck } from 'airswap.js/src/dsProtocol/redux/callDataSelectors'
import { selectors as erc721Selectors } from 'airswap.js/src/erc721/redux/index'
import { getERC1155BalanceOf, getERC1155IsApprovedForAll } from 'airswap.js/src/erc1155/redux/callDataSelectors'
import { getComplianceServiceWhitelist } from 'airswap.js/src/erc1155/redux/selectors'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { selectors as walletSelectors } from 'airswap.js/src/wallet/redux/reducers'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import queryString from 'query-string'
import React, { useContext } from 'react'

import { FormSubmitContext } from '../app/context/FormSubmitContext'
import { ModalContext, ModalPosition } from '../app/context/ModalContext'
import { WalletContext } from '../app/context/WalletContext'
import { store } from '../app/providers/ReduxProvider'
import ApproveToken from '../Components/ModalContent/ApproveToken'
import ComplianceServiceWhiteList from '../Components/ModalContent/ComplianceServiceWhiteList'
import PreTransferCheck from '../Components/ModalContent/PreTransferCheck'
import { PreTransferCheckOrderDetails } from '../Components/ModalContent/PreTransferCheck/Container'
import SuspiciousToken from '../Components/ModalContent/SuspiciousToken'
import SwapFailure from '../Components/ModalContent/SwapFailure'
import WethModal from '../Components/ModalContent/WethModal'
import { ValidatedValue } from '../Components/validationComponents/createValidatedValue'
import { formatValidationMessage } from '../Components/validationComponents/validators'
import { makeGetBalanceForToken } from '../state/selectors'
import { FlatSignedSwapOrder } from '../types/models/Orders'
import { PreTransferCheckResponse } from '../types/models/Security'
import { TokenKind, TokenKindInterfaceMap, TokenMetadata } from '../types/models/Tokens'
import AvailableForTrade from './build/AvailableForTrade'

const { makeGetIsERC721Owner, makeGetIsERC721Approved } = erc721Selectors
const { getConnectedWalletAddress } = walletSelectors
const { getConnectedSwapApprovals, getConnectedBalances } = balancesSelectors
const { makeAtomicByToken, getTokensByAddress, makeDisplayByToken, getAirSwapApprovedTokens } = tokenSelectors

export default function createFlowChecks() {
  const { setModalContent, setModalOpen, setModalSettings } = useContext(ModalContext)
  const { setShouldProgress, setIsFormSubmitting } = useContext(FormSubmitContext)
  const { startWalletConnect, setShowWalletConnect } = useContext(WalletContext)

  // Get Redux Selectors
  const state = store.getState()
  const connectedWalletAddress = getConnectedWalletAddress(state)
  const connectedApprovals = getConnectedSwapApprovals(state)
  const tokensByAddress = getTokensByAddress(state)
  const getBalanceForToken = makeGetBalanceForToken(state)
  const getAtomicByToken = makeAtomicByToken(state)
  const getDisplayByToken = makeDisplayByToken(state)
  const atomicBalances = getConnectedBalances(state)
  const getIsERC721Owner = makeGetIsERC721Owner(state)
  const getIsERC721Approved = makeGetIsERC721Approved(state)
  const preTransferChecks = getDsProtocolPreTransferCheck(state)
  const allAirSwapTokens: TokenMetadata[] = Object.values(getAirSwapApprovedTokens(state))
  const complianceServiceWhitelist = getComplianceServiceWhitelist(state)

  // Flow Checks
  const checkWalletConnection = () => {
    if (!connectedWalletAddress) {
      setShouldProgress(false)
      startWalletConnect()
      return false
    }
    setShowWalletConnect(false)
    return true
  }

  const checkSimilarTokenExists = (tokenAddress: string, onVerify: () => void) => {
    const token = tokensByAddress[tokenAddress]
    const similarToken = allAirSwapTokens.find(t => t.symbol === token.symbol)
    if (similarToken && similarToken.address !== tokenAddress) {
      // If similar token found, show warning modal
      const chooseToken = () => {
        setModalOpen(false)
        onVerify()
        setShouldProgress(true)
      }

      setShouldProgress(false)
      setModalContent(<SuspiciousToken similarToken={similarToken} token={token} chooseToken={chooseToken} />)
      setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
      setModalOpen(true)
      return false
    }
    return true
  }

  const checkBalanceAndWrap = (amount: string) => {
    const wethAmountAtomic = getAtomicByToken({ address: WETH_CONTRACT_ADDRESS }, amount)
    const userWethBalance = atomicBalances[WETH_CONTRACT_ADDRESS]
    if (new BigNumber(userWethBalance).lt(new BigNumber(wethAmountAtomic))) {
      const minimumWrapAmount = new BigNumber(wethAmountAtomic).minus(new BigNumber(userWethBalance)).toString()

      setShouldProgress(false)
      setModalContent(<WethModal minimumWrapAmount={minimumWrapAmount} isWrap />)
      setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
      setModalOpen(true)
      return false
    }
    return true
  }

  const checkTokenApproval = (tokenAddress: string, tokenKind: TokenKind, tokenId?: string) => {
    // ERC-721
    if (tokenKind === TokenKind.ERC721 && tokenId) {
      if (!getIsERC721Approved(tokenAddress, tokenId)) {
        setShouldProgress(false)
        setModalContent(<ApproveToken tokenAddress={tokenAddress} tokenId={tokenId} tokenKind={tokenKind} />)
        setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
        setModalOpen(true)
        return false
      }
      return true
    }

    // ERC-1155
    if (tokenKind === TokenKind.ERC1155 && tokenId) {
      const approvalResponse = _.find(getERC1155IsApprovedForAll(state), {
        parameters: { contractAddress: tokenAddress, operator: SWAP_CONTRACT_ADDRESS, owner: connectedWalletAddress },
      })

      if (approvalResponse && approvalResponse.response) return true

      setShouldProgress(false)
      setModalContent(<ApproveToken tokenAddress={tokenAddress} tokenId={tokenId} tokenKind={tokenKind} />)
      setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
      setModalOpen(true)
      return false
    }

    // ERC-20
    if (tokenAddress !== ETH_ADDRESS && connectedApprovals && !connectedApprovals[tokenAddress]) {
      setShouldProgress(false)
      setModalContent(<ApproveToken tokenAddress={tokenAddress} tokenKind={tokenKind} />)
      setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
      setModalOpen(true)
      return false
    }
    return true
  }

  const checkTokenBalance = (
    tokenAddress: string,
    tokenKind: TokenKind,
    param: ValidatedValue<string>,
    setParam: (value: string) => any,
    tokenId?: string,
    amountEditable?: boolean,
  ) => {
    // ERC-721
    if (tokenKind === TokenKind.ERC721) {
      if (getIsERC721Owner(tokenAddress, param.value)) return true

      param.setMessage(formatValidationMessage('You do not own this NFT', true))
      setShouldProgress(false)
      setIsFormSubmitting(false)
      return false
    }

    // ERC-1155
    if (tokenKind === TokenKind.ERC1155) {
      const erc1155Balance = _.find(getERC1155BalanceOf(state), {
        parameters: {
          contractAddress: tokenAddress,
          id: tokenId,
          owner: connectedWalletAddress,
        },
      })

      if (erc1155Balance && new BigNumber(param.value || 0).lt(erc1155Balance.response)) {
        return true
      }

      param.setMessage(formatValidationMessage('You do not own this token', true))
      setShouldProgress(false)
      setIsFormSubmitting(false)
      return false
    }

    // ERC20
    const token = tokensByAddress[tokenAddress]
    const atomicAmount = getAtomicByToken({ address: token.address }, param.value || '')
    const tokenBalance = getBalanceForToken(connectedWalletAddress, token.address, true)
    const displayTokenBalance = getDisplayByToken({ address: token.address }, tokenBalance)
    if (new BigNumber(tokenBalance).lt(atomicAmount)) {
      const onAvailableBalanceClick = () => {
        if (amountEditable) {
          param.setMessage(null)
          setParam(displayTokenBalance)
        }
      }

      param.setMessage(
        formatValidationMessage(
          'Insufficient Balance',
          true,
          <AvailableForTrade
            locked={param.locked}
            value={displayTokenBalance}
            symbol={token.symbol}
            onClick={onAvailableBalanceClick}
          />,
        ),
      )
      setShouldProgress(false)
      setIsFormSubmitting(false)
      return false
    }
    return true
  }

  const checkSecurityTokenPreTransfer = (order: PreTransferCheckOrderDetails) => {
    const preTransferCheck: PreTransferCheckResponse = preTransferChecks[0]

    if (preTransferCheck && preTransferCheck.response.code !== '0') {
      setShouldProgress(false)
      setIsFormSubmitting(false)
      setModalContent(
        <PreTransferCheck
          order={order}
          code={preTransferCheck.response.code}
          reason={preTransferCheck.response.reason}
        />,
      )
      setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
      setModalOpen(true)
      return false
    }
    return true
  }

  const checkComplianceServiceWhitelist = (erc1155Address: string, walletAddress: string) => {
    const isWhitelisted = _.find(complianceServiceWhitelist, {
      whitelisted: true,
      walletAddress,
      erc1155Address,
    })

    if (!isWhitelisted) {
      setShouldProgress(false)
      setIsFormSubmitting(false)
      setModalContent(<ComplianceServiceWhiteList walletAddress={walletAddress} />)
      setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
      setModalOpen(true)
      return false
    }
    return true
  }

  const checkSwapFailure = async (order: FlatSignedSwapOrder) => {
    const formattedOrder: Order = {
      signer: {
        kind: order.makerKind,
        wallet: order.makerWallet,
        token: order.makerToken,
        amount: order.makerAmount || '0',
        id: order.makerId,
      },
      sender: {
        kind: order.takerKind,
        wallet: order.takerWallet,
        token: order.takerToken,
        amount: order.takerAmount || '0',
        id: order.takerId,
      },
      affiliate: {
        wallet: OTC_AFFILIATE_ADDRESS,
        token: ETH_ADDRESS,
        amount: '0',
        id: '0',
        kind: TokenKindInterfaceMap[TokenKind.ERC20],
      },
      nonce: `${order.nonce}`,
      expiry: `${order.expiry}`,
      signature: {
        signatory: order.signatureSignatory,
        validator: order.signatureValidator,
        version: order.signatureVersion,
        r: order.signatureR,
        s: order.signatureS,
        v: order.signatureV,
      },
    }
    const { network } = queryString.parse(window.location.hash)
    const validator = new Validator(network || NETWORK)
    const failureCodes = await validator.checkSwap(formattedOrder)
    if (failureCodes && failureCodes.length) {
      const reasons = failureCodes.map(code => Validator.getReason(code))
      setShouldProgress(false)
      setIsFormSubmitting(false)
      setModalContent(<SwapFailure reasons={reasons} setTakeAnyway={() => {}} />)
      setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
      setModalOpen(true)
      return false
    }
    return true
  }

  return {
    checkSecurityTokenPreTransfer,
    checkSimilarTokenExists,
    checkWalletConnection,
    checkBalanceAndWrap,
    checkTokenApproval,
    checkTokenBalance,
    checkComplianceServiceWhitelist,
    checkSwapFailure,
  }
}
