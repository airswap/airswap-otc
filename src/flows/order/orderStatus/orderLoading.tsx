import React, { useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { WidgetContext } from '../../../app/context/WidgetContext'
import { Flex } from '../../../elements/Flex'
import { VerticalSpacer } from '../../../elements/Spacer'
import Spinner from '../../../elements/Spinner'
import { H1, H4 } from '../../../elements/Typography'
import theme from '../../../theme'

interface OrderLoadingContainerProps {
  color?: string
}

const OrderLoadingContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
})`
  width: 100%;
  height: 620px;
  background-color: ${({ color }) => color || theme.palette.primaryColor};
`

export default function OrderLoading() {
  const { isWidget, widgetParams } = useContext(WidgetContext)

  const widgetPrimaryColor = isWidget
    ? widgetParams && widgetParams.widgetConfig && widgetParams.widgetConfig.primaryColor
    : undefined

  return (
    <OrderLoadingContainer color={widgetPrimaryColor}>
      <Spinner color="#ffffff" />
      <VerticalSpacer units={10} />
      <H1 color="white" weight={theme.text.fontWeight.medium}>
        <FormattedMessage defaultMessage="Fetching trade data" />
      </H1>
      <VerticalSpacer units={6} />
      <H4 color="rgba(255, 255, 255, 0.75)" weight={theme.text.fontWeight.light}>
        <FormattedMessage defaultMessage="Trade data is being fetched from the interplanetary file system (IPFS)." />
      </H4>
    </OrderLoadingContainer>
  )
}
