import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import PendingVendors from '../PendingVendors'
import ActiveVendors from '../ActiveVendors'
import DeactivatedVendors from '../DeactivatedVendors'

const { TabPane } = Tabs

const VendorManagement = () => {
    const [activeKey, setActiveKey] = useState('1') // State to manage active tab key

    // Function to handle tab change
    const handleTabChange = (key) => {
        setActiveKey(key)
    }
    return (
        <Tabs activeKey={activeKey} onChange={handleTabChange}>
            <TabPane tab="Pending" key="1">
                <PendingVendors />
            </TabPane>
            <TabPane tab="Active" key="2">
                <ActiveVendors onDeactivate={() => setActiveKey('3')} />
            </TabPane>
            <TabPane tab="Deactivated" key="3">
                <DeactivatedVendors />
            </TabPane>
        </Tabs>
    )
}

export default VendorManagement
