import { openEtherscanLink } from 'airswap.js/src/utils/etherscan'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ValidationUIVariant } from '../../Components/validationComponents/asValidationUI'
import { ReactComponent as CopyIcon } from '../../static/copy-icon.svg'
import { ReactComponent as LinkIcon } from '../../static/external-link-icon.svg'
import { copyToClipboard } from '../../utils/transformations'
import Spinner from '../Spinner'
import { ClickToCopyContainer, DisplayLabelContainer, DisplayLabelValue, TooltipContainer, TooltipText } from './styles'

export interface DisplayLabelProps {
  value?: string
  children?: React.ReactNode
  color?: string
  white?: boolean
  expand?: boolean
  clickToCopy?: boolean
  clickToOpenEtherscan?: boolean
  colorVariant?: ValidationUIVariant
  isWaiting?: boolean
  onCopyClick?(): void
}

export default function DisplayLabel(props: DisplayLabelProps) {
  const [showCopiedTooltip, setShowCopiedTooltip] = useState<boolean>(false)

  const copyOnClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.preventDefault()

    if (props.onCopyClick) {
      props.onCopyClick()
    }
    if (props.clickToCopy && typeof props.value === 'string') {
      if (copyToClipboard(props.value)) {
        setShowCopiedTooltip(true)
        setTimeout(() => {
          setShowCopiedTooltip(false)
        }, 2000)
      }
    }
  }

  return (
    <DisplayLabelContainer
      color={props.color}
      white={props.white}
      expand={props.expand}
      colorVariant={props.colorVariant}
    >
      <DisplayLabelValue white={props.white} colorVariant={props.colorVariant}>
        {props.children || props.value}
      </DisplayLabelValue>
      {props.isWaiting && <Spinner />}
      {props.clickToCopy && (
        <ClickToCopyContainer onClick={copyOnClick} color={props.color}>
          <TooltipContainer showCopiedTooltip={showCopiedTooltip}>
            <TooltipText>
              <FormattedMessage defaultMessage="Copied!" />
            </TooltipText>
          </TooltipContainer>
          <CopyIcon />
        </ClickToCopyContainer>
      )}
      {props.clickToOpenEtherscan && (
        <ClickToCopyContainer color={props.color} onClick={openEtherscanLink.bind(null, props.value, 'address')}>
          <LinkIcon />
        </ClickToCopyContainer>
      )}
    </DisplayLabelContainer>
  )
}
