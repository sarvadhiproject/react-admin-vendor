import React, { useEffect, useMemo, useState } from 'react'
import { Table, Button, message, Input, Empty } from 'antd'
import axios from 'axios'
import appConfig from 'configs/app.config'

const PendingVendors = () => {
    const [data, setData] = useState([])
    const [loadingMap, setLoadingMap] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')

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
                vendor.phoneno
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                vendor.company_name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                vendor.gstno?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [data, searchQuery])

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
    const indexStart = useMemo(() => {
        const pageSize = 10 // Adjust this to your desired page size
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
            dataIndex: 'phoneno',
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Company Name',
            dataIndex: 'company_name',
            sorter: (a, b) => a.company_name.localeCompare(b.company_name),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,

            title: 'GST No',
            dataIndex: 'gstno',
            sorter: (a, b) => a.gstno.localeCompare(b.gstno),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Registration Date/Time',
            dataIndex: 'createdAt',
            render: (text, record) => (
                <span style={{ color: '#666' }}>
                    {new Date(text).toLocaleString('en-GB')}
                </span>
            ),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px',
                }}
            >
                <h5>Vendor Registration Requests</h5>
                <div>
                    <Input.Search
                        placeholder="Search pending vendors"
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
        </>
    )
}

export default PendingVendors
