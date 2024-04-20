import React, { useEffect, useState } from 'react'
import { Table, Button, message } from 'antd'
import axios from 'axios'
import appConfig from 'configs/app.config'

const PendingVendors = () => {
    const [data, setData] = useState([])
    const [loadingMap, setLoadingMap] = useState({})
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/pending-vendors`
            )
            setData(response.data.pendingVendors)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleApprove = async (record) => {
        setLoadingMap((prevState) => ({ ...prevState, [record.id]: true }))
        try {
            const response = await axios.put(
                `${appConfig.apiPrefix}/activate-vendor/${record.id}`
            )
            if (response.data.success) {
                message.success('Vendor account activated successfully')
                fetchData()
            } else {
                message.error('Failed to approve vendor')
            }
        } catch (error) {
            message.error('Failed to activate vendor account : ', error)
        } finally {
            setLoadingMap((prevState) => ({ ...prevState, [record.id]: false }))
        }
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone No',
            dataIndex: 'phoneNo',
        },
        {
            title: 'Company Name',
            dataIndex: 'CompanyName',
        },
        {
            title: 'GST No',
            dataIndex: 'GSTNo',
        },
        {
            title: 'Registration Date/Time',
            dataIndex: 'createdAt',
            render: (text, record) => new Date(text).toLocaleString(),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    loading={loadingMap[record.id]}
                    onClick={() => handleApprove(record)}
                    // size="small"
                    style={{
                        background: '#1890ff',
                        borderColor: '#1890ff',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s',
                        '&:hover': {
                            background: '#40a9ff',
                            borderColor: '#40a9ff',
                        },
                    }}
                >
                    Activate
                </Button>
            ),
        },
    ]

    return (
        <>
            <h3 style={{ marginBottom: '30px', marginTop: '10px' }}>
                Vendor Registration Requests
            </h3>
            <Table
                style={{ backgroundColor: 'transparent' }}
                columns={columns}
                size="small"
                dataSource={data}
            />
        </>
    )
}

export default PendingVendors
