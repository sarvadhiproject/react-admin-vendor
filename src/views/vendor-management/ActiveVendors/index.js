import React, { useState, useEffect, useMemo } from 'react'
import { Table, Button, Input, Empty, Spin } from 'antd'
import axios from 'axios'
import appConfig from 'configs/app.config'
import { Link } from 'react-router-dom'
import { Notification, toast } from 'components/ui'
import { LoadingOutlined } from '@ant-design/icons'

const ActiveVendors = () => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)

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
            toast.push(
                <Notification
                    title={'Failed to fetch active vendors'}
                    type="danger"
                    duration={2500}
                >
                    {error.message} - Please try again later
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setIsLoading(false)
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
            render: (text) => (
                <Link href={`mailto:${text}`} style={{ color: '#3D77FF' }}>
                    {text}
                </Link>
            ),
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
                <>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link
                            to={`/app/vendor-management/kyc-details`}
                            state={{ vendor_id: record.vendor_id }}
                        >
                            <Button
                                type="default"
                                style={{
                                    background: '#ffa500',
                                    borderColor: '#ffa500',
                                    color: '#fff',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.3s',
                                }}
                            >
                                View KYC
                            </Button>
                        </Link>
                    </div>
                </>
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

            {!isLoading && filteredVendors.length === 0 ? (
                searchQuery ? (
                    <Empty
                        description={`No pending vendors found for "${searchQuery}"`}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <Empty description="No pending vendors available" />
                )
            ) : isLoading ? (
                <center>
                    <Spin
                        indicator={
                            <LoadingOutlined
                                style={{ fontSize: 28, color: '#832729' }}
                                spin
                            />
                        }
                    />
                </center>
            ) : (
                <Table
                    columns={columns}
                    size="small"
                    dataSource={filteredVendors}
                    pagination={{
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                    }}
                    style={{ overflowX: 'auto' }}
                />
            )}
        </>
    )
}

export default ActiveVendors
