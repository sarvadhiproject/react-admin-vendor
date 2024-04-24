import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Input, message } from 'antd'
import axios from 'axios'
import appConfig from 'configs/app.config'

const { TextArea } = Input

const ActiveVendors = () => {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [selectedVendor, setSelectedVendor] = useState(null)
    const [deactivateReason, setDeactivateReason] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/active-vendors`
            )
            setData(response.data.activeVendors)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleDeactivate = (record) => {
        setSelectedVendor(record)
        setVisible(true)
    }

    const handleCancel = () => {
        setVisible(false)
        setDeactivateReason('')
    }

    const handleDeactivateConfirm = async () => {
        try {
            const response = await axios.put(
                `${appConfig.apiPrefix}/deactivate-vendor/${selectedVendor.id}`
            )
            if (response.data.success) {
                message.success('Vendor account deactivated successfully')
                setVisible(false)
                setDeactivateReason('')
                fetchData()
            } else {
                message.error('Failed to deactivate vendor')
            }
        } catch (error) {
            // console.error('Error deactivateing vendor account:', error)
            message.error('Failed to deactivate vendor account:', error)
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
            dataIndex: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone No',
            dataIndex: 'phoneno',
        },
        {
            title: 'Company Name',
            dataIndex: 'company_name',
        },
        {
            title: 'GST No',
            dataIndex: 'gstno',
        },
        {
            title: 'Registration Date',
            dataIndex: 'createdAt',
            render: (text, record) => new Date(text).toLocaleString(),
        },
        {
            title: 'Activation Date',
            dataIndex: 'updatedAt',
            render: (text, record) => new Date(text).toLocaleString(),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <Button
                    type="danger"
                    onClick={() => handleDeactivate(record)}
                    style={{
                        background: '#ff4d4f',
                        borderColor: '#ff4d4f',
                        color: 'white',
                    }}
                >
                    Deactivate
                </Button>
            ),
        },
    ]

    return (
        <>
            <h3 style={{ marginBottom: '30px', marginTop: '10px' }}>
                Active vendors list
            </h3>
            <Table columns={columns} size="small" dataSource={data} />
            <Modal
                title="Deactivate Vendor"
                open={visible}
                onOk={handleDeactivateConfirm}
                onCancel={handleCancel}
                okButtonProps={{
                    style: { background: '#ff4d4f', borderColor: '#ff4d4f' },
                }}
            >
                <p>Are you sure you want to deactivate this vendor account?</p>
                <TextArea
                    placeholder="Reason for deactivate vendor"
                    rows={4}
                    value={deactivateReason}
                    onChange={(e) => setDeactivateReason(e.target.value)}
                />
            </Modal>
        </>
    )
}

export default ActiveVendors
