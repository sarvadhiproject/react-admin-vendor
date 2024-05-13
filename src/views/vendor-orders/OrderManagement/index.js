import React, { useState } from 'react'
import { Tabs } from 'antd'
import PendingOrders from '../PendingOrders'
import ActiveOrders from '../ActiveOrders'

const OrderManagement = () => {
    const [activeKey, setActiveKey] = useState('1')
    const handleTabChange = (key) => {
        setActiveKey(key)
    }

    const tabItems = [
        {
            key: '1',
            label: 'Pending',
            children: <PendingOrders />,
        },
        {
            key: '2',
            label: 'Active',
            children: <ActiveOrders />,
        },
    ]

    return (
        <>
            <h3 style={{ color: '#022B4E', marginBottom: '10px' }}>Orders</h3>
            <Tabs
                activeKey={activeKey}
                items={tabItems}
                onChange={handleTabChange}
            />
        </>
    )
}

export default OrderManagement
