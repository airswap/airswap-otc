import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ReactComponent as CopyIcon } from '../../static/copy-icon.svg'
import { copyToClipboard } from '../../utils/transformations'
import Tooltip from '../Tooltip'
import { CopyIconContainer, LinkContainer, TooltipText, TooltipTextBody, TooltipTextHeader } from './styles'

interface ClickableAddressProps {
  label: string
  isHeader?: boolean
  direction?: 'bottom' | 'bottom-left' | 'bottom-right' | 'top' | 'top-left' | 'top-right'
  showIcon?: boolean
}

export default function ClickableAddress(props: ClickableAddressProps) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  const onClick = () => {
    copyToClipboard(props.label)

    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 2000)
  }

  return (
    <Tooltip
      position={props.direction || 'bottom-right'}
      render={() => (
        <TooltipText>
          {showTooltip ? <FormattedMessage defaultMessage="Copied to clipboard!" /> : props.label}
        </TooltipText>
      )}
    >
      <LinkContainer onClick={onClick}>
        {props.showIcon && (
          <CopyIconContainer>
            <CopyIcon />
          </CopyIconContainer>
        )}
        {props.isHeader ? (
          <TooltipTextHeader>{`${props.label.slice(0, 6)}…${props.label.slice(38, 42)}`}</TooltipTextHeader>
        ) : (
          <TooltipTextBody>{`${props.label.slice(0, 6)}…${props.label.slice(38, 42)}`}</TooltipTextBody>
        )}
      </LinkContainer>
    </Tooltip>
  )
}
