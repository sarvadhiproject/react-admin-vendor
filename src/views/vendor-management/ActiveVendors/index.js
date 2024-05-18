import React, { useState, useEffect, useMemo } from 'react'
import { Table, Button, Modal, Input, message, Empty } from 'antd'
import axios from 'axios'
import appConfig from 'configs/app.config'

const { TextArea } = Input

const ActiveVendors = ({ onDeactivate }) => {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [selectedVendor, setSelectedVendor] = useState(null)
    const [deactivateReason, setDeactivateReason] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/vendor/active`
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
                `${appConfig.apiPrefix}/vendor/deactivate/${selectedVendor.vendor_id}`
            )
            if (response.data.success) {
                message.success('Vendor account deactivated successfully')
                setDeactivateReason('')
                fetchData()
                onDeactivate()
            } else {
                message.error('Failed to deactivate vendor')
            }
        } catch (error) {
            message.error('Failed to deactivate vendor account', error)
        } finally {
            setVisible(false)
        }
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const filteredVendors = useMemo(() => {
        return data.filter(
            (vendor) =>
                vendor.first_name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                vendor.last_name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                vendor.email
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                vendor.phone_no
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                vendor.company_name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                vendor.gstno?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [data, searchQuery])

    const indexStart = useMemo(() => {
        const pageSize = 10
        return (currentPage - 1) * pageSize
    }, [currentPage])

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            render: (text, record, index) => (
                <span style={{ color: '#666' }}>{indexStart + index + 1}</span>
            ),
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            sorter: (a, b) => a.first_name.localeCompare(b.first_name),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            sorter: (a, b) => a.last_name.localeCompare(b.last_name),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Phone No',
            dataIndex: 'phone_no',
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Company Name',
            dataIndex: 'company_name',
            sorter: (a, b) => a.company_name.localeCompare(b.company_name),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'GST No',
            dataIndex: 'gstno',
            sorter: (a, b) => a.gstno.localeCompare(b.gstno),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Registration Date',
            dataIndex: 'createdAt',
            render: (text, record) => (
                <span style={{ color: '#666' }}>
                    {new Date(text).toLocaleString('en-GB')}
                </span>
            ),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Activation Date',
            dataIndex: 'updatedAt',
            render: (text, record) => (
                <span style={{ color: '#666' }}>
                    {new Date(text).toLocaleString('en-GB')}
                </span>
            ),
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
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
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px',
                }}
            >
                {/* <h3>Active Vendors List</h3> */}
                <h5>Active Vendors List</h5>
                <div>
                    <Input.Search
                        placeholder="Search active vendors"
                        style={{ width: 270 }}
                        size="large"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {filteredVendors.length > 0 ? (
                <Table
                    columns={columns}
                    size="small"
                    dataSource={filteredVendors}
                    pagination={{
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                    }}
                />
            ) : (
                <Empty
                    style={{ fontWeight: '350' }}
                    description="No data found!"
                />
            )}
            <Modal
                title={<h4>Deactivate Vendor</h4>}
                open={visible}
                onOk={handleDeactivateConfirm}
                onCancel={handleCancel}
                okButtonProps={{
                    style: { background: '#ff4d4f', borderColor: '#ff4d4f' },
                }}
            >
                <p>
                    Are you sure you want to deactivate this vendor account?
                    Deactivating this account will also deactivate all
                    associated products, making them invisible to customers.
                </p>
                {/* <TextArea
                    placeholder="Reason for deactivate vendor"
                    rows={4}
                    value={deactivateReason}
                    onChange={(e) => setDeactivateReason(e.target.value)}
                /> */}
            </Modal>
        </>
    )
}

export default ActiveVendors
