import React, { useState } from 'react'
import { Tabs } from 'antd'
import PendingVendors from '../PendingVendors'
import ActiveVendors from '../ActiveVendors'
import DeactivatedVendors from '../DeactivatedVendors'

const VendorManagement = () => {
    const [activeKey, setActiveKey] = useState('1')
    const [refreshDeactivated, setRefreshDeactivated] = useState(false)

    const handleTabChange = (key) => {
        setActiveKey(key)
    }
    const handleDeactivate = () => {
        setRefreshDeactivated(!refreshDeactivated)
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
            children: <ActiveVendors onDeactivate={handleDeactivate} />,
        },
        {
            key: '3',
            label: 'Deactivated',
            children: (
                <DeactivatedVendors refreshDeactivated={refreshDeactivated} />
            ),
        },
    ]

    return (
        <>
            {/* <h3 style={{ marginBottom: '10px', color: '#022B4E' }}>
                Manage Vendors
            </h3> */}
            <h3 style={{ marginBottom: '10px', color: '#832729' }}>
                Manage Vendors
            </h3>
            <Tabs
                activeKey={activeKey}
                items={tabItems}
                onChange={handleTabChange}
            />
        </>
    )
}

export default VendorManagement
