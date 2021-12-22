import { distanceInWordsStrict } from 'date-fns'
import React from 'react'

import ClickableAddress from '../elements/ClickableAddress'
import { TokenKind, TokenKindInterfaceMap } from '../types/models/Tokens'

export const condenseAddress = (
  label: string,
  showFullAddressOnHover: boolean = false,
  largeText?: boolean,
  direction?: 'bottom' | 'bottom-left' | 'bottom-right' | 'top' | 'top-left' | 'top-right',
  showIcon?: boolean,
): React.ReactElement | string => {
  if (label && label.indexOf('0x') === 0) {
    if (showFullAddressOnHover) {
      return <ClickableAddress direction={direction} isHeader={largeText} label={label} showIcon={showIcon} />
    }
    return `${label.slice(0, 6)}…${label.slice(38, 42)}`
  }
  return ''
}

export const copyToClipboard = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.right = '-100px'
  if (document.body) {
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Oops, unable to copy', err)
      return false
    }
    document.body.removeChild(textArea)
    return true
  }
  return false
}

export const calculateDifferenceInTrade = (timestamp: string) => {
  const now = Date.now()
  const t = parseInt(timestamp, 10)

  const distanceInWords = distanceInWordsStrict(now, t)
  const distanceInWordsArr = distanceInWords.split(' ')

  const localMap = {
    seconds: 's',
    second: 's',
    minutes: 'min',
    minute: 'min',
    hours: 'h',
    hour: 'h',
    days: 'd',
    day: 'd',
    months: 'M',
    month: 'M',
    years: 'y',
    year: 'y',
  }

  const key = distanceInWordsArr[1]

  if (key in localMap) {
    distanceInWordsArr[1] = localMap[key]
  }
  return `${distanceInWordsArr.join('')} ago`
}

export const getUIGasLabel = (level: 'fast' | 'fastest' | 'average' | 'safeLow') => {
  switch (level) {
    case 'fastest':
      return 'Fast'
    case 'fast':
      return 'Standard'
    case 'average':
      return 'Slow'
    case 'safeLow':
      return 'Slow'
    default:
      return 'Standard'
  }
}

export const willFormatNumber = (num: string | number, digits: number, decimals: number) => {
  const amount = `${num}`
  if (amount.split('.').length === 1) return false
  return amount.length > digits || amount.split('.')[1].length > decimals
}

export const getFormattedNumber = (num: string | number, digits: number, decimals: number) => {
  let amount = `${num}`
  if (amount.split('.').length === 1) return amount
  if (amount.length <= digits && (!decimals || amount.split('.')[1].length <= decimals)) return amount

  amount = Number(num)
    .toFixed(decimals)
    .toString()
  return amount.substring(0, digits)
}

export const getFormattedTokenDisplay = (props: {
  amount?: string | number
  id?: string | number
  symbol?: string
  kind?: TokenKind | string
}) => {
  if (props.kind === TokenKind.ERC721 || props.kind === TokenKindInterfaceMap[TokenKind.ERC721])
    return `${props.symbol || ''} #${props.id}`
  if (props.kind === TokenKind.ERC1155 || props.kind === TokenKindInterfaceMap[TokenKind.ERC1155])
    return `${props.amount} ${props.symbol || ''} #${props.id}`
  return `${props.amount} ${props.symbol}`
}
