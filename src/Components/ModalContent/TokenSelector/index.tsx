import { SWAP_CONTRACT_ADDRESS } from 'airswap.js/src/constants'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import { ModalContext, ModalPosition } from '../../../app/context/ModalContext'
import { WidgetContext } from '../../../app/context/WidgetContext'
import { Flex } from '../../../elements/Flex'
import { VerticalSpacer } from '../../../elements/Spacer'
import Spinner from '../../../elements/Spinner'
import { H4 } from '../../../elements/Typography'
import { ReactComponent as CloseIcon } from '../../../static/close-icon.svg'
import { TokenKind, TokenMetadata } from '../../../types/models/Tokens'
import { isEthereumAddress } from '../../../utils/helpers'
import { isERC20 } from '../../../utils/tokens'
import SuspiciousToken from '../SuspiciousToken'
import Container, { TokenSection, TokenSelectorProps } from './Container'
import ERC721Selector from './ERC721Selector'
import ERC1155Selector from './ERC1155Selector'
import {
  Close,
  HeaderText,
  LoadingContainer,
  NoResultsContainer,
  NoResultsFound,
  SubHeaderText,
  TokenSelectorContainer,
  TokenSelectorLabel,
  TokenSelectorLabelContainer,
  TokensList,
  TokensListHeader,
} from './styles'
import TokenItem from './TokenItem'
import TokenSearch from './TokenSearch'

function TokenSelectorModalContent(props: TokenSelectorProps) {
  const { setModalContent, setModalSettings, setModalOpen } = useContext(ModalContext)
  const { isWidget, widgetParams } = useContext(WidgetContext)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [tokenSections, setTokenSections] = useState<TokenSection[]>([])
  const [navigationIndex, setNavigationIndex] = useState<number>(-1)
  const [selectedToken, setSelectedToken] = useState<TokenMetadata>()
  const listRef = useRef<FixedSizeList>(null)

  const onSearchTextChange = (value: string) => {
    setSearchText(value.toLowerCase())
    setNavigationIndex(-1)
  }

  const selectERC1155 = (tokenId: string) => {
    if (selectedToken) {
      props.setTokenId(tokenId)
      props.setTokenAddress(selectedToken.address)
      props.setTokenKind(TokenKind.ERC1155)
      // Fetch owner and approval status of erc1155
      if (props.connectedWalletAddress) {
        props.fetchERC1155BalanceOf({
          contractAddress: selectedToken.address,
          owner: props.connectedWalletAddress,
          id: tokenId,
        })
        props.fetchERC1155IsApprovedForAll({
          contractAddress: selectedToken.address,
          owner: props.connectedWalletAddress,
          operator: SWAP_CONTRACT_ADDRESS,
        })
      }
      setModalOpen(false)
    }
  }

  const selectERC721 = (tokenId: string) => {
    if (selectedToken) {
      props.setParam(tokenId)
      props.setTokenAddress(selectedToken.address)
      props.setTokenKind(TokenKind.ERC721)
      // Fetch owner and approval status of nft
      props.fetchERC721OwnerOf({ contractAddress: selectedToken.address, tokenId })
      props.fetchERC721GetApproved({ contractAddress: selectedToken.address, tokenId })
      setModalOpen(false)
    }
  }

  const selectToken = (token: TokenMetadata) => () => {
    if (token.kind && !isERC20(token.kind)) {
      setSelectedToken(token)
      setSearchText(token.symbol)
      // Don't set param yet. Param will be set on erc1155/erc721 modals
    } else {
      // Token is ERC20
      props.addTrackedAddress({ address: props.connectedWalletAddress, tokenAddress: token.address })
      props.setTokenAddress(token.address)
      if (!isERC20(props.tokenKind)) {
        props.setParam('')
        props.setTokenKind(TokenKind.ERC20)
      }
      setModalOpen(false)
    }
  }

  const dismissIdSelector = () => {
    setSearchText(searchText || props.tokenAddress.value || '')
    setSelectedToken(undefined)
  }

  const getCombinedTokens = (sections: TokenSection[]) => {
    return sections.reduce((combined: TokenMetadata[], section: TokenSection) => combined.concat(section.tokens), [])
  }

  const getSectionIndex = index => {
    let sectionIndex
    tokenSections.reduce((offset, section, i) => {
      if (offset >= 0 && offset < section.tokens.length) {
        sectionIndex = i
      }
      return offset - section.tokens.length
    }, index)
    return index + sectionIndex + 1
  }

  // Handle keyboard navigation
  const handleNavigation = event => {
    if (event.key) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        // Set Navigation Index
        let index
        if (event.key === 'ArrowDown') {
          index = Math.min(
            navigationIndex + 1,
            tokenSections.reduce((length, section) => length + section.tokens.length, 0) - 1,
          )
        } else {
          index = Math.max(navigationIndex - 1, 0)
        }
        setNavigationIndex(index)
        // Set Scroll
        if (listRef.current) {
          listRef.current.scrollToItem(getSectionIndex(index), 'center')
        }
      } else if (event.key === 'Enter') {
        // Select token
        const combinedTokens = getCombinedTokens(tokenSections)
        const tokenAtNavigationIndex = combinedTokens[navigationIndex]
        if (tokenAtNavigationIndex.kind && !isERC20(tokenAtNavigationIndex.kind)) {
          setSelectedToken(tokenAtNavigationIndex)
        } else {
          props.setTokenAddress(tokenAtNavigationIndex.address)
          props.setTokenKind(TokenKind.ERC20)
          setModalOpen(false)
        }
      }
    }
  }

  // Filter Token Sections
  const filterTokenSections = (sections: TokenSection[]) => {
    return sections.map(section => ({
      label: section.label,
      tokens: section.tokens.filter(token => {
        if (!token) return false
        if (!searchText || !searchText.length) return true

        return (
          (token.symbol && token.symbol.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) ||
          (token.name && token.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) ||
          (token.address && token.address.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
        )
      }),
    }))
  }

  // Add keyboard navigation handlers
  useEffect(() => {
    if (!selectedToken) {
      document.addEventListener('keydown', handleNavigation)
    }

    return () => document.removeEventListener('keydown', handleNavigation)
  }, [navigationIndex, selectedToken, tokenSections])

  // Set ERC-721 && ERC-1155
  useEffect(() => {
    if (props.tokenKind === TokenKind.ERC721 && props.tokenAddress.value && props.param.value) {
      const token = props.getNFTItemByAddressAndId(props.tokenAddress.value, props.param.value)
      setSelectedToken(token)
    } else if (props.tokenKind === TokenKind.ERC1155 && props.tokenAddress.value) {
      const token = props.tokensByAddress[props.tokenAddress.value]
      setSelectedToken(token)
    }
  }, [props.tokenKind, props.tokenAddress.value, props.param.value, props.getNFTItemByAddressAndId])

  // Populate Token List
  useEffect(() => {
    let populatedTokenSections
    if (isWidget && widgetParams && widgetParams.customTokenSections && widgetParams.customTokenSections.length) {
      // Populate custom token list for widget
      populatedTokenSections = widgetParams.customTokenSections.map(section => ({
        label: section.label,
        tokens: section.tokens
          .map(tokenAddress => props.tokensByAddress[tokenAddress.toLowerCase()])
          .filter(token => token),
      }))
    } else {
      // Populate regular token list
      populatedTokenSections = props.tokenSections.slice(0)
    }

    const combinedTokens = filterTokenSections(populatedTokenSections).reduce(
      (combined: TokenMetadata[], section: TokenSection) => {
        return [...combined, ...section.tokens]
      },
      [],
    )

    if (isEthereumAddress(searchText) && props.tokensByAddress[searchText] && !combinedTokens.length) {
      populatedTokenSections.push({
        label: 'Search Results',
        tokens: [props.tokensByAddress[searchText]],
      })
    }

    setTokenSections(filterTokenSections(populatedTokenSections))
  }, [Object.keys(props.tokensByAddress).length, props.tokenSections, searchText])

  useEffect(() => {
    const token = props.getTokenFromAllTokens(searchText.toLowerCase())
    if (
      isEthereumAddress(searchText) &&
      !getCombinedTokens(filterTokenSections(props.tokenSections)).length &&
      !token &&
      (!isWidget || !widgetParams || !widgetParams.customTokenSections || !widgetParams.customTokenSections.length)
    ) {
      setIsSearching(true)
      props.crawlToken(searchText.toLowerCase())
      // Set searching to false after 5 seconds - crawl token did not find the token
      setTimeout(() => {
        setIsSearching(false)
      }, 5000)
    }

    if (searchText.length && token && !getCombinedTokens(filterTokenSections(props.tokenSections)).length) {
      // if user copy/pasted a erc-20 token address that is not "AirSwapUI: yes", let's start tracking balances and approvals for it
      if (token.kind !== 'ERC721' && props.connectedWalletAddress) {
        props.addTrackedAddress({ address: props.connectedWalletAddress, tokenAddress: searchText.toLowerCase() })
      }

      // Check for similar token names
      const similarToken = getCombinedTokens(props.tokenSections).find(t => t.symbol === token.symbol)
      if (similarToken && similarToken.address !== token.address) {
        // If similar token found, show warning modal
        const chooseToken = () => {
          props.setTokenAddress(token.address)
          setModalOpen(false)
        }

        setModalContent(<SuspiciousToken similarToken={similarToken} token={token} chooseToken={chooseToken} />)
        setModalSettings({ mobilePosition: ModalPosition.BOTTOM })
      }

      setIsSearching(false)
    }
  }, [tokenSections, props.tokenSections, searchText, props.connectedWalletAddress])

  const widgetPrimaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.primaryColor
    : undefined
  const widgetSecondaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.secondaryColor
    : undefined

  // Token list count. Include header as an item count
  const tokenListCount = useMemo(
    () =>
      tokenSections.reduce((count, section) => (section.tokens.length ? count + section.tokens.length + 1 : count), 0),
    [tokenSections],
  )

  // With virtualized lists, the token section header and items are all "items"
  const TokenListItem = useMemo(
    () => ({ index, style }) => {
      let item
      let sectionIndex = 0
      let isTitle = false

      // Find section and token
      tokenSections.reduce((current, section, i) => {
        if (current < 0 || !section.tokens.length) return current

        // This is at the start of the section index, meaning its a title
        if (current === 0) {
          isTitle = true
        }

        // We found the section
        if (current < section.tokens.length + 1) {
          item = section.tokens[current - 1]
          sectionIndex = i
        }
        return current - (section.tokens.length + 1)
      }, index)

      // Return section header
      if (isTitle && tokenSections[sectionIndex] && tokenSections[sectionIndex].tokens.length) {
        return (
          <div style={style}>
            <TokenSelectorLabelContainer>
              <TokenSelectorLabel>{tokenSections[sectionIndex].label}</TokenSelectorLabel>
            </TokenSelectorLabelContainer>
          </div>
        )
      }

      if (!item) return null

      // Return token item
      let itemIndex = index
      for (let i = 0; i < sectionIndex + 1; i++) {
        if (tokenSections[i].tokens.length) {
          itemIndex -= 1
        }
      }

      return (
        <div style={style}>
          <TokenItem
            key={item.address}
            id={`token-selector-item-${itemIndex}`}
            dataTest={`token-selector-item-${item.address}`}
            isFocused={itemIndex === navigationIndex}
            showBalance={props.showBalance}
            token={item}
            onSelect={selectToken(item)}
          />
        </div>
      )
    },
    [tokenSections, props.showBalance],
  )

  // In ERC-721 Selection Flow
  if (selectedToken && selectedToken.kind === TokenKind.ERC721) {
    return (
      <ERC721Selector
        token={selectedToken}
        param={props.param}
        showBalance={props.showBalance}
        selectERC721={selectERC721}
        dismissERC721Selector={dismissIdSelector}
      />
    )
  }

  // In ERC-1155 Selection Flow
  if (selectedToken && selectedToken.kind === TokenKind.ERC1155) {
    return (
      <ERC1155Selector
        token={selectedToken}
        tokenId={props.tokenId}
        selectERC1155={selectERC1155}
        dismissERC1155Selector={dismissIdSelector}
      />
    )
  }

  return (
    <TokenSelectorContainer align="baseline">
      <Close onClick={() => setModalOpen(false)}>
        <CloseIcon />
      </Close>
      <TokensListHeader>
        <HeaderText>
          <FormattedMessage defaultMessage="Select Token" />
        </HeaderText>
        <SubHeaderText>
          <FormattedMessage defaultMessage="Search token by name, symbol or address" />
        </SubHeaderText>
        <TokenSearch iconColor={widgetSecondaryColor} value={searchText} onChange={onSearchTextChange} />
      </TokensListHeader>
      <TokensList>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              ref={listRef}
              className="token-selector-list"
              height={height}
              width={width}
              itemCount={tokenListCount}
              itemSize={80 + 10} // Height + padding
            >
              {TokenListItem}
            </FixedSizeList>
          )}
        </AutoSizer>
        {!isSearching && tokenListCount === 0 && (
          <NoResultsContainer>
            <Flex>
              <NoResultsFound>
                <FormattedMessage defaultMessage="No results found" />
              </NoResultsFound>
            </Flex>
          </NoResultsContainer>
        )}
        {isSearching && tokenListCount === 0 && (
          <LoadingContainer>
            <Spinner color={widgetPrimaryColor} />
            <VerticalSpacer units={6} />
            <H4>
              <FormattedMessage defaultMessage="Searching for token..." />
            </H4>
          </LoadingContainer>
        )}
      </TokensList>
    </TokenSelectorContainer>
  )
}

export default Container(TokenSelectorModalContent)
