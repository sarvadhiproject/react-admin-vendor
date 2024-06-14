import React, { useState } from 'react'
import { Tabs } from 'antd'
import PendingReviews from './PendingReviews'
import ApprovedReviews from './ApprovedReviews'
import RejectedReviews from './RejectedReviews'

const WebsiteReviews = () => {
    const [activeKey, setActiveKey] = useState('1')
    // const [refreshRejected, setRefreshRejected] = useState(false)
    // const [refreshApproved, setRefreshApproved] = useState(false)
    const [refreshTabs, setRefreshTabs] = useState(0)

    const handleTabChange = (key) => {
        setActiveKey(key)
    }
    // const handleRejected = () => {
    //     setRefreshRejected(!refreshRejected)
    // }
    // const handleApproved = () => {
    //     setRefreshApproved(!refreshApproved)
    // }
    const handleAction = () => {
        setRefreshTabs((prev) => prev + 1)
    }

    const tabItems = [
        {
            key: '1',
            label: 'Pending',
            // children: <PendingReviews onApproved={handleApproved} />,
            children: <PendingReviews onApproved={handleAction} />,
        },
        {
            key: '2',
            label: 'Approved',
            children: (
                <ApprovedReviews
                    // refreshApproved={refreshApproved}
                    // onRejected={handleRejected}
                    refreshTabs={refreshTabs}
                    onRejected={handleAction}
                />
            ),
        },
        {
            key: '3',
            label: 'Rejected',
            children: (
                <RejectedReviews
                    // refreshRejected={refreshRejected}
                    // refreshApproved={refreshApproved}
                    refreshTabs={refreshTabs}
                />
            ),
        },
    ]

    return (
        <>
            {/* <h3 style={{ marginBottom: '10px', color: '#022B4E' }}>
                Website Reviews
            </h3> */}
            <h3 style={{ marginBottom: '10px', color: '#832729' }}>
                Website Reviews
            </h3>
            <Tabs
                activeKey={activeKey}
                items={tabItems}
                onChange={handleTabChange}
            />
        </>
    )
}

export default WebsiteReviews
