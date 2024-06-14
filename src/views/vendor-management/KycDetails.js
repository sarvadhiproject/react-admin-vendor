import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Card,
    Row,
    Col,
    Typography,
    Space,
    Spin,
    Divider,
    Modal,
    message,
} from 'antd'
import {
    UserOutlined,
    HomeOutlined,
    BankOutlined,
    IdcardOutlined,
    MailOutlined,
    PhoneOutlined,
    BuildOutlined,
    PropertySafetyOutlined,
    BankFilled,
    UserAddOutlined,
    LoadingOutlined,
    FileTextOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import appConfig from 'configs/app.config'
import { Button } from 'components/ui'
const { Title, Text, Link } = Typography

const KycDetails = () => {
    const location = useLocation()
    const vendor_id = location.state?.vendor_id
    const navigate = useNavigate()
    const [kycDetails, setKycDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingMap, setLoadingMap] = useState({})
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const fetchKycDetails = async () => {
            try {
                const response = await axios.get(
                    `${appConfig.apiPrefix}/vendor/getKYCDetails/${vendor_id}`
                )
                setKycDetails(response.data.vendor)
            } catch (error) {
                console.error('Error fetching KYC details:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchKycDetails()
    }, [vendor_id])

    const activateVendorAccount = async () => {
        setLoadingMap((prevState) => ({
            ...prevState,
            [vendor_id]: true,
        }))
        try {
            const response = await axios.put(
                `${appConfig.apiPrefix}/vendor/activate/${vendor_id}`
            )
            if (response.data.success) {
                message.success('Vendor account activated successfully')
                navigate('/app/vendor-management/VendorManagement')
            } else {
                message.error('Failed to activate vendor account')
            }
        } catch (error) {
            message.error('Failed to activate vendor account ', error)
        } finally {
            setLoadingMap((prevState) => ({
                ...prevState,
                [vendor_id]: false,
            }))
        }
    }

    const handleDeactivate = () => {
        setVisible(true)
    }
    const handleDeactivateConfirm = async () => {
        try {
            const response = await axios.put(
                `${appConfig.apiPrefix}/vendor/deactivate/${vendor_id}`
            )
            if (response.data.success) {
                message.success('Vendor account deactivated successfully')
                navigate('/app/vendor-management/VendorManagement')
            } else {
                message.error('Failed to deactivate vendor')
            }
        } catch (error) {
            message.error('Failed to deactivate vendor account', error)
        } finally {
            setVisible(false)
        }
    }
    const handleCancel = () => {
        setVisible(false)
    }

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Spin
                    indicator={<LoadingOutlined size={28} />}
                    size="large"
                    // style={{ color: '#4F46E5' }}
                    style={{ color: '#832729' }}
                />
            </div>
        )
    }

    if (!kycDetails) {
        return <div>No KYC details found.</div>
    }

    const { kycDetails: kycData = {}, ...vendor } = kycDetails

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                }}
            >
                {/* <h3 style={{ margin: 0, color: '#022B4E' }}>KYC Details</h3> */}
                <h3 style={{ margin: 0, color: '#832729' }}>KYC Details</h3>
                {/* <Button
                    type="primary"
                    icon={
                        <CheckCircleOutlined
                            style={{ marginRight: '6px', color: '#52c41a' }}
                        />
                    }
                    onClick={activateVendorAccount}
                    style={{
                        // backgroundColor: '#52c41a',
                        // color: 'white',
                        // borderColor: '#52c41a',
                    }}
                >
                    Activate Account
                </Button> */}
                {vendor.active_status === 'pending' && (
                    <Button
                        type="primary"
                        loading={loadingMap[vendor_id]}
                        onClick={activateVendorAccount}
                        style={{
                            background: '#1890ff',
                            borderColor: '#1890ff',
                            borderRadius: '4px',
                            transition: 'background-color 0.3s',
                            marginRight: '8px',
                            color: 'white',
                        }}
                    >
                        Activate
                    </Button>
                )}
                {vendor.active_status === 'active' && (
                    <Button
                        type="danger"
                        onClick={() => handleDeactivate()}
                        style={{
                            background: '#ff4d4f',
                            borderColor: '#ff4d4f',
                            color: 'white',
                        }}
                    >
                        Deactivate
                    </Button>
                )}
            </div>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card
                        title={
                            <Space>
                                <UserAddOutlined
                                    style={{
                                        fontSize: '20px',
                                        // color: '#4F46E5',
                                        color: '#832729',
                                    }}
                                />
                                <Title level={5}>Personal Details</Title>
                            </Space>
                        }
                        style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            fontSize: '16px',
                        }}
                    >
                        <Space direction="vertical">
                            <Space>
                                <UserOutlined />
                                <Text strong>Name:</Text>
                                {`${vendor?.first_name || ''} ${
                                    vendor?.last_name || ''
                                }`}
                            </Space>
                            <Space>
                                <MailOutlined />
                                <Text strong>Email:</Text>{' '}
                                <Link
                                    href={`mailto:${vendor?.email}`}
                                    style={{ color: '#4F46E5' }}
                                >
                                    {vendor?.email || ''}
                                </Link>
                            </Space>
                            <Space>
                                <PhoneOutlined />
                                <Text strong>Phone:</Text>
                                {`+${vendor?.country_code || ''} ${
                                    vendor?.phone_no || ''
                                }`}
                            </Space>
                            <Space>
                                <HomeOutlined />
                                <Text strong>Address:</Text>{' '}
                                {vendor?.address || ''}
                            </Space>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title={
                            <Space>
                                <BuildOutlined
                                    style={{
                                        fontSize: '20px',
                                        color: '#832729',
                                    }}
                                />
                                <Title level={5}>Company Details</Title>
                            </Space>
                        }
                        style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            fontSize: '16px',
                        }}
                    >
                        <Space direction="vertical">
                            <Space>
                                <PropertySafetyOutlined />
                                <Text strong>Company Name:</Text>{' '}
                                {vendor?.company_name || ''}
                            </Space>
                            <Space>
                                <IdcardOutlined />
                                <Text strong>Business Reg. No.:</Text>{' '}
                                {kycData?.business_reg_no || ''}
                            </Space>
                            <Space>
                                <IdcardOutlined />
                                <Text strong>GST No.:</Text>{' '}
                                {vendor?.gstno || ''}
                            </Space>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title={
                            <Space>
                                <FileTextOutlined
                                    style={{
                                        fontSize: '20px',
                                        color: '#832729',
                                    }}
                                />
                                <Title level={5}>KYC Documents</Title>
                            </Space>
                        }
                        style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            fontSize: '16px',
                        }}
                    >
                        <Space direction="vertical">
                            <Space>
                                <IdcardOutlined />
                                <Text strong>Aadhar No.:</Text>{' '}
                                {kycData?.aadhar_no || ''}
                            </Space>
                            <Space>
                                <IdcardOutlined />
                                <Text strong>Pan No.:</Text>{' '}
                                {kycData?.pan_no || ''}
                            </Space>
                            {/* <Divider /> */}
                            <hr style={{ margin: '3px' }} />
                            <Space>
                                <Link
                                    href={kycData?.aadhar_copy}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#4F46E5' }}
                                >
                                    View Aadhar Copy
                                </Link>
                            </Space>
                            <Space>
                                <Link
                                    href={kycData?.pan_copy}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#4F46E5' }}
                                >
                                    View Pan Copy
                                </Link>
                            </Space>
                            <Space>
                                <Link
                                    href={kycData?.add_prof}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#4F46E5' }}
                                >
                                    View Address Proof
                                </Link>
                            </Space>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title={
                            <Space>
                                <BankFilled
                                    style={{
                                        fontSize: '20px',
                                        color: '#832729',
                                    }}
                                />
                                <Title level={5}>Bank Details</Title>
                            </Space>
                        }
                        style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            fontSize: '16px',
                        }}
                    >
                        <Space direction="vertical">
                            <Space>
                                <BankOutlined />
                                <Text strong>Bank Name:</Text>{' '}
                                {kycData?.bank_name || ''}
                            </Space>
                            <Space>
                                <IdcardOutlined />
                                <Text strong>Account No.:</Text>{' '}
                                {kycData?.bank_acc_no || ''}
                            </Space>
                            <Space>
                                <IdcardOutlined />
                                <Text strong>IFSC Code:</Text>{' '}
                                {kycData?.ifsc_code || ''}
                            </Space>
                        </Space>
                    </Card>
                </Col>
            </Row>
            <div style={{ marginTop: '16px' }}>
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined style={{ marginRight: '7px' }} />}
                    onClick={() =>
                        navigate('/app/vendor-management/VendorManagement')
                    }
                    style={{
                        // color: '#022B4E',
                        color: '#832729',
                        // borderColor: '#022B4E',
                    }}
                >
                    Back to Vendor List
                </Button>
            </div>
            <Modal
                title={<h4>Deactivate Vendor</h4>}
                open={visible}
                okText="Confirm"
                cancelText="Cancel"
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
            </Modal>
        </>
    )
}

export default KycDetails
