import { ETH_ADDRESS, SWAP_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS } from 'airswap.js/src/constants'
import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'

import { FormSubmitContext } from '../../../app/context/FormSubmitContext'
import { ModalContext, ModalPosition } from '../../../app/context/ModalContext'
import Button, { ButtonVariant } from '../../../elements/Button'
import { Flex } from '../../../elements/Flex'
import { VerticalSpacer } from '../../../elements/Spacer'
import { H3, H6 } from '../../../elements/Typography'
import ThumbsUpGif from '../../../static/animated-thumbs-up-icon.gif'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { ReactComponent as ErrorIcon } from '../../../static/wallet-connect-error-icon.svg'
import theme from '../../../theme'
import { TokenKind } from '../../../types/models/Tokens'
import ActionStatus from '../ActionStatus'
import { IconContainer } from '../styles'
import Container, { ApproveTokenProps } from './Container'
import { ApproveTokenContainer, Close } from './styles'

function ApproveToken(props: ApproveTokenProps) {
  const { setModalSettings, setModalOpen } = useContext(ModalContext)
  const { setIsFormSubmitting, setShouldProgress } = useContext(FormSubmitContext)
  const [isApproving, setIsApproving] = useState<boolean>(false)

  const getTokenAddress = () => {
    return props.tokenAddress === ETH_ADDRESS ? WETH_CONTRACT_ADDRESS : props.tokenAddress
  }

  const approveToken = () => {
    setIsApproving(true)
    setModalSettings({ canDismiss: false, mobilePosition: ModalPosition.BOTTOM })
    if (props.tokenKind === TokenKind.ERC721) {
      props.approveERC721(props.tokenAddress, props.tokenId || '')
    } else if (props.tokenKind === TokenKind.ERC1155) {
      props.submitERC1155SetApprovalForAll({
        contractAddress: props.tokenAddress,
        operator: SWAP_CONTRACT_ADDRESS,
        approved: true,
      })
    } else {
      props.approveAirswapToken(getTokenAddress())
    }
  }

  const closeModal = () => {
    setIsFormSubmitting(false)
    setModalOpen(false)
  }

  useEffect(() => {
    // Finished approving
    if (
      (props.tokenKind === TokenKind.ERC721 && props.isERC721Approved) ||
      (props.tokenKind === TokenKind.ERC1155 && props.isERC1155Approved) ||
      (props.tokenKind !== TokenKind.ERC721 &&
        props.tokenKind !== TokenKind.ERC1155 &&
        props.connectedApprovals &&
        props.connectedApprovals[getTokenAddress()])
    ) {
      setTimeout(async () => {
        await setModalOpen(false)
        setShouldProgress(true)
      }, 1000)
    }
  }, [
    JSON.stringify(props.connectedApprovals),
    props.tokenAddress,
    props.isERC721Approved,
    props.isERC1155Approved,
    JSON.stringify(props.erc1155ApproveTransaction),
    JSON.stringify(props.erc721ApproveTransaction),
  ])

  useEffect(() => {
    if (
      props.errorSubmittingApproveTokenMap[getTokenAddress()] ||
      props.errorMiningApproveTokenMap[getTokenAddress()]
    ) {
      setModalSettings({ canDismiss: true, mobilePosition: ModalPosition.BOTTOM })
    }
  }, [JSON.stringify(props.errorSubmittingApproveTokenMap), JSON.stringify(props.errorMiningApproveTokenMap)])

  if (
    props.errorMiningApproveTokenMap[getTokenAddress()] ||
    (props.erc1155ApproveTransaction && props.erc1155ApproveTransaction.errorMining) ||
    (props.erc721ApproveTransaction && props.erc721ApproveTransaction.errorMining)
  ) {
    return (
      <ApproveTokenContainer justify="center">
        <Close onClick={closeModal}>
          <CloseIcon />
        </Close>
        <IconContainer>
          <ErrorIcon />
        </IconContainer>
        <VerticalSpacer units={10} />
        <Flex>
          <H3 weight={theme.text.fontWeight.semibold}>
            <FormattedMessage defaultMessage="Error" />
          </H3>
          <VerticalSpacer units={4} />
          <H6 weight={theme.text.fontWeight.light}>
            <FormattedMessage defaultMessage="There was an error mining the transaction" />
          </H6>
        </Flex>
      </ApproveTokenContainer>
    )
  }

  if (
    props.errorSubmittingApproveTokenMap[getTokenAddress()] ||
    (props.erc1155ApproveTransaction && props.erc1155ApproveTransaction.errorSubmitting) ||
    (props.erc721ApproveTransaction && props.erc721ApproveTransaction.errorSubmitting)
  ) {
    return (
      <ApproveTokenContainer justify="center">
        <Close onClick={closeModal}>
          <CloseIcon />
        </Close>
        <IconContainer>
          <ErrorIcon />
        </IconContainer>
        <VerticalSpacer units={10} />
        <Flex>
          <H3 weight={theme.text.fontWeight.semibold}>
            <FormattedMessage defaultMessage="Error" />
          </H3>
          <VerticalSpacer units={4} />
          <H6 weight={theme.text.fontWeight.light}>
            {props.errorSubmittingApproveTokenMap[getTokenAddress()] ||
              (props.erc1155ApproveTransaction && props.erc1155ApproveTransaction.errorSubmitting) ||
              (props.erc721ApproveTransaction && props.erc721ApproveTransaction.errorSubmitting)}
          </H6>
        </Flex>
      </ApproveTokenContainer>
    )
  }

  const tokenSymbol = props.tokensByAddress[getTokenAddress()].symbol

  if (isApproving) {
    return (
      <ActionStatus
        gif={ThumbsUpGif}
        title={
          props.tokenKind === TokenKind.ERC721
            ? `Approving ${tokenSymbol} #${props.tokenId}`
            : `Approving ${tokenSymbol}`
        }
      />
    )
  }

  return (
    <ApproveTokenContainer justify="center">
      <Close onClick={closeModal}>
        <CloseIcon />
      </Close>
      <IconContainer>
        <img src={ThumbsUpGif} />
      </IconContainer>
      <VerticalSpacer units={12} />
      {props.tokenKind === TokenKind.ERC721 ? (
        <>
          <H3 weight={theme.text.fontWeight.semibold}>
            <FormattedMessage
              defaultMessage="Approve {token} #{tokenId}"
              values={{ token: tokenSymbol, tokenId: props.tokenId }}
            />
          </H3>
          <VerticalSpacer units={6} />
          <H6 weight={theme.text.fontWeight.light}>
            <FormattedMessage
              defaultMessage="You must give AirSwap's smart contract permission to swap {token} #{tokenId}. You only need to do this once for each NFT."
              values={{ token: tokenSymbol, tokenId: props.tokenId }}
            />
          </H6>
        </>
      ) : (
        <>
          <H3 weight={theme.text.fontWeight.semibold}>
            <FormattedMessage defaultMessage="Approve {token}" values={{ token: tokenSymbol }} />
          </H3>
          <VerticalSpacer units={6} />
          <H6 weight={theme.text.fontWeight.light}>
            <FormattedMessage
              defaultMessage="You must give AirSwap's smart contract permission to swap {token}. You only need to do this once for each token."
              values={{ token: tokenSymbol }}
            />
          </H6>
        </>
      )}
      <VerticalSpacer units={14} />
      <Button variant={ButtonVariant.PRIMARY} onClick={approveToken}>
        <FormattedMessage defaultMessage="Approve" />
      </Button>
    </ApproveTokenContainer>
  )
}

export default Container(withRouter(ApproveToken))
