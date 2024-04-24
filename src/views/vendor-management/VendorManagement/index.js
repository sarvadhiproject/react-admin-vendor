import React, { useState } from 'react'
import { Tabs } from 'antd'
import PendingVendors from '../PendingVendors'
import ActiveVendors from '../ActiveVendors'
import DeactivatedVendors from '../DeactivatedVendors'

const VendorManagement = () => {
    const [activeKey, setActiveKey] = useState('1')

    const handleTabChange = (key) => {
        setActiveKey(key)
    }

    const tabItems = [
        {
            key: '1',
            label: 'Pending',
            children: <PendingVendors />,
        },
        {
            key: '2',
            label: 'Active',
            children: <ActiveVendors onDeactivate={() => setActiveKey('3')} />,
        },
        {
            key: '3',
            label: 'Deactivated',
            children: <DeactivatedVendors />,
        },
    ]

    return (
        <Tabs
            activeKey={activeKey}
            items={tabItems}
            onChange={handleTabChange}
        />
    )
}

export default VendorManagement
