import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { Table, Input, Empty, Spin } from 'antd'
import appConfig from 'configs/app.config'
import { Notification, toast } from 'components/ui'
import { LoadingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

function AllCustomers() {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(
                    `${appConfig.apiPrefix}/customer/admin`
                )
                setCustomers(response?.data?.data || [])
                // console.log(response?.data?.data.length)
            } catch (err) {
                toast.push(
                    <Notification
                        title={'Failed to fetch customers'}
                        type="danger"
                        duration={2500}
                    >
                        {err?.message} - Please try again later
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])

    const columns = [
        {
            title: '#',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (text, record, index) => (
                <span style={{ color: '#666' }}>{indexStart + index + 1}</span>
            ),
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
            sorter: (a, b) =>
                (a?.first_name || '').localeCompare(b?.first_name || ''),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
            sorter: (a, b) =>
                (a?.last_name || '').localeCompare(b?.last_name || ''),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => (
                <Link href={`mailto:${text}`} style={{ color: '#3D77FF' }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_no',
            key: 'phone_no',
            render: (phone_no, record) => (
                <span style={{ color: '#666' }}>{`+${
                    record?.country_code || ''
                } ${phone_no || ''}`}</span>
            ),
        },
        {
            title: 'Registration Date/Time',
            dataIndex: 'createdAt',
            render: (text) => (
                <span style={{ color: '#666' }}>
                    {new Date(text).toLocaleString('en-GB')}
                </span>
            ),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
    ]

    const filteredCustomers = useMemo(() => {
        return customers.filter(
            (customer) =>
                customer.first_name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                customer.last_name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                customer.email
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                customer.phone_no?.includes(searchQuery)
        )
    }, [customers, searchQuery])

    const indexStart = useMemo(() => {
        return (currentPage - 1) * pageSize
    }, [currentPage, pageSize])

    const handlePageSizeChange = (current, size) => {
        setPageSize(Number(size))
        setCurrentPage(1) // Reset to the first page when page size changes
    }

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                }}
            >
                {/* <h3 style={{ color: '#022B4E' }}>Customers</h3> */}
                <h3 style={{ color: '#832729' }}>Registered Users</h3>
                <div>
                    <Input.Search
                        placeholder="Search customer.."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: 272 }}
                        size="large"
                    />
                </div>
            </div>
            {loading ? (
                <Spin
                    indicator={
                        <LoadingOutlined
                            style={{ fontSize: 28, color: '#832729' }}
                            spin
                        />
                    }
                />
            ) : filteredCustomers.length > 0 ? (
                <Table
                    dataSource={filteredCustomers}
                    style={{ overflowX: 'auto', overflowY: 'auto' }}
                    columns={columns}
                    rowKey="user_id"
                    pagination={{
                        position: ['bottomRight'],
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                        pageSize: pageSize,
                        pageSizeOptions: ['5', '10', '20', '50'],
                        onShowSizeChange: handlePageSizeChange,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                    }}
                />
            ) : searchQuery ? (
                <Empty
                    style={{ fontWeight: '350' }}
                    description={`No customers found for "${searchQuery}"`}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <Empty
                    style={{ fontWeight: '350' }}
                    description="No customers available"
                />
            )}
        </>
    )
}

export default AllCustomers
