import React, { useState, useEffect, useMemo } from 'react'
import {
    Table,
    Modal,
    message,
    Row,
    Col,
    Tooltip,
    Empty,
    Spin,
    Input,
    Form,
    Select,
    DatePicker,
} from 'antd'
import { EditOutlined, LoadingOutlined } from '@ant-design/icons'
import appConfig from 'configs/app.config'
import { HiOutlineTrash, HiPlusCircle } from 'react-icons/hi'
import { Button, Notification, toast } from 'components/ui'
import NumberFormat from 'react-number-format'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import moment from 'moment'

const token = localStorage.getItem('admin')
const decodedToken = jwtDecode(token)
const vendorID = decodedToken.id

const Coupons = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [coupons, setCoupons] = useState([])
    const [isAddCouponOpen, setIsAddCouponOpen] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState(null)
    const [isSaving, setIsSaving] = useState(false) // Added for loading effect
    const [form] = Form.useForm()

    useEffect(() => {
        fetchCoupons()
    }, [currentPage])

    const fetchCoupons = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/coupon/vendor/${vendorID}`
            )
            setCoupons(response.data)
        } catch (error) {
            // message.error('Failed to fetch coupons')
            toast.push(
                <Notification
                    title={'Failed to fetch coupons'}
                    type="danger"
                    duration={2500}
                >
                    {error}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddOrUpdateCoupon = async () => {
        setIsSaving(true)
        try {
            const values = await form.validateFields()
            values.expiry_date = values.expiry_date.format('YYYY-MM-DD')
            if (editingCoupon) {
                await axios.put(
                    `${appConfig.apiPrefix}/coupon/${editingCoupon.coupon_id}`,
                    {
                        ...values,
                        vendor_id: vendorID,
                    }
                )
                // message.success('Coupon updated successfully')
                toast.push(
                    <Notification
                        title={'Successfully updated'}
                        type="success"
                        duration={2500}
                    >
                        Coupon added successfully
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            } else {
                await axios.post(`${appConfig.apiPrefix}/coupon/add`, {
                    ...values,
                    vendor_id: vendorID,
                })
                // message.success('Coupon added successfully')
                toast.push(
                    <Notification
                        title={'Successfully added'}
                        type="success"
                        duration={2500}
                    >
                        Coupon added successfully
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
            fetchCoupons()
            setIsAddCouponOpen(false)
            setEditingCoupon(null)
            form.resetFields()
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message === 'Coupon code already exists'
            ) {
                // message.error('Coupon code already exists')
                toast.push(
                    <Notification
                        title={'Failed to save coupon'}
                        type="danger"
                        duration={2500}
                    >
                        Coupon code already exists
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            } else {
                // message.error('Failed to save coupon')
                toast.push(
                    <Notification
                        title={'Failed to save coupon'}
                        type="danger"
                        duration={2500}
                    >
                        Please try again later
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteCoupon = async (couponId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this coupon?',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await axios.delete(
                        `${appConfig.apiPrefix}/coupon/${couponId}`
                    )
                    // message.success('Coupon deleted successfully')
                    toast.push(
                        <Notification
                            title={'Successfully deleted'}
                            type="success"
                            duration={2500}
                        >
                            Coupon deleted successfully
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                    fetchCoupons()
                } catch (error) {
                    // message.error('Failed to delete coupon')
                    toast.push(
                        <Notification
                            title={'Failed to delete coupon'}
                            type="danger"
                            duration={2500}
                        >
                            {error} - Please try again later
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                }
            },
        })
    }

    const filteredCoupons = useMemo(() => {
        return coupons.filter((coupon) =>
            coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [coupons, searchQuery])

    const indexStart = useMemo(() => {
        const pageSize = 10
        return (currentPage - 1) * pageSize
    }, [currentPage])

    const columns = [
        {
            title: '#',
            dataIndex: 'coupon_id',
            key: 'coupon_id',
            render: (text, record, index) => (
                <span style={{ color: '#666' }}>{indexStart + index + 1}</span>
            ),
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Discount Type',
            dataIndex: 'discount_type',
            key: 'discount_type',
            sorter: (a, b) => a.discount_type.localeCompare(b.discount_type),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Discount Value',
            dataIndex: 'discount_value',
            key: 'discount_value',
            sorter: (a, b) => a.discount_value - b.discount_value,
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Minimum Amount',
            dataIndex: 'minimum_amount',
            key: 'minimum_amount',
            sorter: (a, b) => a.minimum_amount - b.minimum_amount,
            render: (text) => (
                <NumberFormat
                    displayType="text"
                    // value={(Math.round(text * 100) / 100).toFixed(2)}
                    value={Math.round(text * 100) / 100}
                    prefix={'₹'}
                    thousandSeparator={true}
                    renderText={(value) => (
                        <span style={{ color: '#666' }}>{value}</span>
                    )}
                />
            ),
        },
        {
            title: 'Maximum Uses',
            dataIndex: 'maximum_uses',
            key: 'maximum_uses',
            sorter: (a, b) => a.maximum_uses - b.maximum_uses,
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiry_date',
            key: 'expiry_date',
            sorter: (a, b) => new Date(a.expiry_date) - new Date(b.expiry_date),
            render: (text) => (
                <span style={{ color: '#666' }}>
                    {moment(text).format('DD-MMMM-YYYY').toUpperCase()}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex' }}>
                    <Tooltip title="Edit coupon">
                        <EditOutlined
                            style={{
                                marginRight: '20px',
                                color: '#022B4E',
                                fontSize: '18px',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                setEditingCoupon(record)
                                setIsAddCouponOpen(true)
                                form.setFieldsValue({
                                    ...record,
                                    expiry_date: moment(record.expiry_date),
                                })
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete coupon">
                        <HiOutlineTrash
                            style={{
                                color: 'red',
                                fontSize: '18px',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleDeleteCoupon(record.coupon_id)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ]

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h3 style={{ color: '#022B4E' }}>Coupons</h3>
                <div className="flex items-center">
                    <Input.Search
                        placeholder="Search coupon code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ marginRight: '1rem' }}
                        size="large"
                    />
                    <Button
                        onClick={() => {
                            setIsAddCouponOpen(true)
                            setEditingCoupon(null)
                            form.resetFields()
                        }}
                        block
                        variant="solid"
                        size="sm"
                        style={{ width: '150px' }}
                        icon={<HiPlusCircle />}
                    >
                        Add Coupons
                    </Button>
                </div>
            </div>
            {!isLoading && filteredCoupons.length === 0 ? (
                <Empty description="No coupon found!" />
            ) : isLoading ? (
                <Spin
                    indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                />
            ) : (
                <Table
                    dataSource={filteredCoupons}
                    columns={columns}
                    rowKey="coupon_id"
                    size="small"
                    pagination={{
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                    }}
                />
            )}

            <Modal
                title={editingCoupon ? 'Edit Coupon' : 'Add Coupon'}
                visible={isAddCouponOpen}
                onCancel={() => {
                    setIsAddCouponOpen(false)
                    setEditingCoupon(null)
                    form.resetFields()
                }}
                onOk={handleAddOrUpdateCoupon}
                okButtonProps={{
                    style: {
                        backgroundColor: '#022B4E',
                        borderColor: '#022B4E',
                    },
                    loading: isSaving, // Added loading state
                }}
                okText={
                    isSaving
                        ? editingCoupon
                            ? 'Updating...'
                            : 'Adding...'
                        : 'Save'
                }
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="code"
                                label="Code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the coupon code',
                                    },
                                    {
                                        pattern: /^[A-Za-z0-9]{6,10}$/,
                                        message:
                                            'Code must be 6-10 alphanumeric characters',
                                    },
                                ]}
                            >
                                <Input placeholder="Code (6-10 alphanumeric characters)" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="discount_type"
                                label="Discount Type"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter the discount type',
                                    },
                                ]}
                            >
                                <Select placeholder="Select Discount Type">
                                    <Select.Option value="Percentage">
                                        Percentage (%)
                                    </Select.Option>
                                    <Select.Option value="Fixed Value">
                                        Fixed Value
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="discount_value"
                                label="Discount Value"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter the discount value',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Discount Value"
                                    type="number"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="minimum_amount"
                                label="Minimum Amount"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter the minimum amount',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Minimum Amount"
                                    type="number"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="maximum_uses"
                                label="Maximum Uses"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter the maximum uses',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Maximum Uses"
                                    type="number"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="expiry_date"
                                label="Expiry Date"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the expiry date',
                                    },
                                ]}
                            >
                                <DatePicker
                                    placeholder="Expiry Date"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default Coupons
