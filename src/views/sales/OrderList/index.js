import React from 'react'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import OrdersTable from './components/OrdersTable'

const OrderList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            {/* <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Orders</h3>
                <OrdersTableTools />
            </div> */}
            <OrdersTable />
            {/* <OrderDeleteConfirmation /> */}
        </AdaptableCard>
    )
}

export default OrderList
