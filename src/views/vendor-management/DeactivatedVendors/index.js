import React, { useEffect, useMemo, useState } from 'react'
import { Table, Button, Input, Empty } from 'antd'
import axios from 'axios'
import appConfig from 'configs/app.config'
import { Link } from 'react-router-dom'

const DeactivatedVendors = ({ refreshDeactivated }) => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchData()
    }, [refreshDeactivated])

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/vendor/deactive`
            )
            setData(response.data.deactiveVendors)
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
            title: 'Deactivation Date',
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
                {/* <h3>Deactivated Vendors</h3> */}
                <h5>Deactivated Vendors</h5>
                <div>
                    <Input.Search
                        placeholder="Search deactivated vendors"
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
                    style={{ overflowX: 'auto' }}
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

export default DeactivatedVendors
