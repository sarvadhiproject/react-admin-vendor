import React, { useEffect, useMemo, useState } from 'react'
import {
    Table,
    Button,
    message,
    Input,
    Empty,
    Modal,
    Spin,
    Typography,
} from 'antd'
import axios from 'axios'
import appConfig from 'configs/app.config'
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    BankOutlined,
    FileTextOutlined,
    IdcardOutlined,
    FileProtectOutlined,
    HomeOutlined,
} from '@ant-design/icons'
const { Paragraph } = Typography

const PendingVendors = () => {
    const [data, setData] = useState([])
    const [loadingMap, setLoadingMap] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [kycDetails, setKycDetails] = useState(null)
    const [isKycModalVisible, setIsKycModalVisible] = useState(false)
    const [isKycLoading, setIsKycLoading] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/vendor/pending`
            )
            setData(response.data.pendingVendors)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }
    const fetchKycDetails = async (vendorId) => {
        setIsKycLoading(true)
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/vendor/getKYCDetails/${vendorId}`
            )
            setKycDetails(response.data)
            setIsKycModalVisible(true)
        } catch (error) {
            message.error('Failed to fetch KYC details')
            console.error('Error fetching KYC details:', error)
        } finally {
            setIsKycLoading(false)
        }
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

    const handleApprove = async (record) => {
        setLoadingMap((prevState) => ({
            ...prevState,
            [record.vendor_id]: true,
        }))
        try {
            const response = await axios.put(
                `${appConfig.apiPrefix}/vendor/activate/${record.vendor_id}`
            )
            if (response.data.success) {
                message.success('Vendor account activated successfully')
                fetchData()
            } else {
                message.error('Failed to activate vendor account')
            }
        } catch (error) {
            message.error('Failed to activate vendor account ', error)
        } finally {
            setLoadingMap((prevState) => ({
                ...prevState,
                [record.vendor_id]: false,
            }))
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
                <>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                            type="default"
                            onClick={() => fetchKycDetails(record.vendor_id)}
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
                        <Button
                            type="primary"
                            loading={loadingMap[record.vendor_id]}
                            onClick={() => handleApprove(record)}
                            style={{
                                background: '#1890ff',
                                borderColor: '#1890ff',
                                borderRadius: '4px',
                                transition: 'background-color 0.3s',
                                marginRight: '8px',
                            }}
                        >
                            Activate
                        </Button>
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
                    style={{ overflowX: 'auto' }}
                />
            ) : (
                <Empty
                    style={{ fontWeight: '350' }}
                    description="No data found!"
                />
            )}
            <Modal
                title="KYC Details"
                visible={isKycModalVisible}
                onCancel={() => setIsKycModalVisible(false)}
                footer={[
                    <Button
                        key="close"
                        onClick={() => setIsKycModalVisible(false)}
                    >
                        Close
                    </Button>,
                ]}
            >
                {isKycLoading ? (
                    <Spin />
                ) : kycDetails?.vendor ? (
                    <div style={{ lineHeight: '1.8' }}>
                        <Paragraph>
                            <UserOutlined /> <strong>First Name:</strong>{' '}
                            {kycDetails.vendor.first_name || 'N/A'}
                        </Paragraph>
                        <Paragraph>
                            <UserOutlined /> <strong>Last Name:</strong>{' '}
                            {kycDetails.vendor.last_name || 'N/A'}
                        </Paragraph>
                        <Paragraph>
                            <MailOutlined /> <strong>Email:</strong>{' '}
                            {kycDetails.vendor.email || 'N/A'}
                        </Paragraph>
                        <Paragraph>
                            <PhoneOutlined /> <strong>Phone No:</strong>{' '}
                            {kycDetails.vendor.phone_no || 'N/A'}
                        </Paragraph>
                        <Paragraph>
                            <FileTextOutlined /> <strong>GST No:</strong>{' '}
                            {kycDetails.vendor.gstno || 'N/A'}
                        </Paragraph>
                        <Paragraph>
                            <FileTextOutlined /> <strong>Company Name:</strong>{' '}
                            {kycDetails.vendor.company_name || 'N/A'}
                        </Paragraph>
                        <Paragraph>
                            <IdcardOutlined />{' '}
                            <strong>Business Registration No:</strong>{' '}
                            {kycDetails.vendor.kycDetails?.business_reg_no ||
                                'N/A'}
                        </Paragraph>
                        <Paragraph>
                            <IdcardOutlined /> <strong>Aadhar No:</strong>{' '}
                            {kycDetails.vendor.kycDetails?.aadhar_no || 'N/A'}
                        </Paragraph>
                        <Paragraph>
                            <IdcardOutlined /> <strong>Aadhar Copy:</strong>{' '}
                            {kycDetails.vendor.kycDetails?.aadhar_copy ? (
                                <a
                                    href={
                                        kycDetails.vendor.kycDetails.aadhar_copy
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View
                                </a>
                            ) : (
                                'N/A'
                            )}
                        </Paragraph>
                        <Paragraph>
                            <FileTextOutlined /> <strong>PAN No:</strong>{' '}
                            {kycDetails.vendor.kycDetails?.pan_no || 'N/A'}
                        </Paragraph>
                        <Paragraph>
                            <FileTextOutlined /> <strong>PAN Copy:</strong>{' '}
                            {kycDetails.vendor.kycDetails?.pan_copy ? (
                                <a
                                    href={kycDetails.vendor.kycDetails.pan_copy}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View
                                </a>
                            ) : (
                                'N/A'
                            )}
                        </Paragraph>
                        <Paragraph>
                            <HomeOutlined /> <strong>Address Proof:</strong>{' '}
                            {kycDetails.vendor.kycDetails?.add_prof ? (
                                <a
                                    href={kycDetails.vendor.kycDetails.add_prof}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View
                                </a>
                            ) : (
                                'N/A'
                            )}
                        </Paragraph>
                        <Paragraph>
                            <BankOutlined /> <strong>Bank Account No:</strong>{' '}
                            {kycDetails.vendor.kycDetails?.bank_acc_no || 'N/A'}
                        </Paragraph>
                        <Paragraph>
                            <BankOutlined /> <strong>Bank Name:</strong>{' '}
                            {kycDetails.vendor.kycDetails?.bank_name || 'N/A'}
                        </Paragraph>
                        <Paragraph>
                            <BankOutlined /> <strong>IFSC Code:</strong>{' '}
                            {kycDetails.vendor.kycDetails?.ifsc_code || 'N/A'}
                        </Paragraph>
                    </div>
                ) : (
                    <Empty description="No KYC details available" />
                )}
            </Modal>
        </>
    )
}

export default PendingVendors
