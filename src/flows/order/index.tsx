import React, { useEffect, useMemo, useState } from 'react'

import Card from '../../elements/Card'
import Container, { OrderProps, OrderStatus } from './Container'
import OrderCancelled from './orderStatus/orderCancelled'
import OrderCompleted from './orderStatus/orderCompleted'
import OrderLoading from './orderStatus/orderLoading'
import ShareOrder from './shareOrder'
import TakeOrder from './takeOrder'

export enum UserOrderRole {
  MAKER,
  TAKER,
  OTHER,
}

function Order(props: OrderProps) {
  const [showLoading, setShowLoading] = useState<boolean>(true)

  useEffect(() => {
    // wait 3 seconds before rendering order content so that the user doesn't see screen jumping as the state is updated
    setShowLoading(true)
    setTimeout(() => {
      setShowLoading(false)
    }, 1500)
  }, [])

  const orderContent = useMemo(() => {
    switch (props.orderStatus) {
      case OrderStatus.CANCELLED:
        return <OrderCancelled transactionHash={props.transactionHash} userOrderRole={props.userOrderRole} />
      case OrderStatus.CONFIRMED:
        return <OrderCompleted transactionHash={props.transactionHash} userOrderRole={props.userOrderRole} />
      case OrderStatus.PENDING:
        if (props.userOrderRole === UserOrderRole.MAKER) {
          return <ShareOrder />
        }
        return <TakeOrder userOrderRole={props.userOrderRole} />
      case OrderStatus.LOADING:
      default:
        return <OrderLoading />
    }
  }, [props.transactionHash, props.orderStatus, props.userOrderRole])

  if (showLoading) {
    return (
      <Card>
        <OrderLoading />
      </Card>
    )
  }

  return <Card>{orderContent}</Card>
}

export default Container(Order)
