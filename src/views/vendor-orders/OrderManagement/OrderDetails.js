import React, { useState, useEffect } from 'react'
import { Card, Table, Steps, Typography, Space, Tag } from 'antd'
import {
    LoadingOutlined,
    UserOutlined,
    CreditCardOutlined,
    CalendarOutlined,
    SyncOutlined,
    ShoppingCartOutlined,
    TruckOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons'
import { Button } from 'components/ui'

import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import appConfig from 'configs/app.config'
import NumberFormat from 'react-number-format'
import { jwtDecode } from 'jwt-decode'

const token = localStorage.getItem('admin')
const decodedToken = jwtDecode(token)
var vendor_id = decodedToken.id

const authData = JSON.parse(localStorage.getItem('admin')).auth
const authData1 = JSON.parse(authData)
const token1 = authData1.session.token
// console.log('new token ---', token1)

const { Step } = Steps
const { Title, Paragraph, Text } = Typography

const OrderDetails = () => {
    const { order_id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [orderStatus, setOrderStatus] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        if (order_id) {
            const fetchOrderDetails = async () => {
                try {
                    setLoading(true)
                    const response = await axios.get(
                        `${appConfig.apiPrefix}/order/${order_id}/vendors/${vendor_id}`
                    )
                    setOrder(response.data.order)
                } catch (err) {
                    setError(err)
                } finally {
                    setLoading(false)
                }
            }

            fetchOrderDetails()
        }
    }, [order_id])
    useEffect(() => {
        if (order && order.orderItems && order.orderItems.length > 0) {
            const orderItemId = order.orderItems[0].orderItem_id
            const fetchOrderStatus = async () => {
                try {
                    setLoading(true)
                    const response = await axios.get(
                        `${appConfig.apiPrefix}/order/order-items/${orderItemId}/status`
                    )
                    setOrderStatus(response.data)
                } catch (err) {
                    setError(err)
                } finally {
                    setLoading(false)
                }
            }

            fetchOrderStatus()
        }
    }, [order])

    const handleRefresh = () => {
        navigate('/app/vendor-orders/OrderManagement')
    }
    const handleUpdateStatus = async () => {
        try {
            setIsUpdating(true)
            const newStatus = status === 5 ? 5 : status + 1 // If status is "Delivered" (5), keep it the same, otherwise increment it
            const headers = {
                headers: {
                    Authorization: `Bearer ${token1}`,
                },
            }

            // Update the order status
            for (const orderItem of order.orderItems) {
                const updateResponse = await axios.put(
                    `${appConfig.apiPrefix}/order/vendor/${order_id}/item/${orderItem.orderItem_id}/status`,
                    { vendor_status: newStatus },
                    headers
                )
            }

            // Fetch the updated order details
            const fetchResponse = await axios.get(
                `${appConfig.apiPrefix}/order/${order_id}/vendors/${vendor_id}`
            )
            setOrder(fetchResponse.data.order)
        } catch (err) {
            setError(err)
        } finally {
            setIsUpdating(false)
        }
    }
    const getNextStatusText = () => {
        switch (status) {
            case 1:
                return 'Update to Processing'
            case 2:
                return 'Update to Shipped'
            case 3:
                return 'Update to Out for Delivery'
            case 4:
                return 'Update to Delivered'
            case 5:
                return 'Order Delivered'
            default:
                return 'Unknown Status'
        }
    }
    const statusMap = {
        1: 'Order Received',
        2: 'Processing',
        3: 'Shipped',
        4: 'Out for Delivery',
        5: 'Delivered',
        // 6: 'Cancelled',
    }
    const statusColorMapping = {
        1: { backgroundColor: '#fde3cf', color: '#fa8c16' },
        2: { backgroundColor: '#e6f7ff', color: '#1890ff' },
        3: { backgroundColor: '#CF9FFF', color: 'purple' },
        4: { backgroundColor: '#e6f7ff', color: '#52c41a' },
        5: { backgroundColor: '#d9f7be', color: '#52c41a' },
        6: { backgroundColor: '#fff1f0', color: '#f5222d' },
    }

    if (!order_id) {
        return <div>Loading...</div>
    }
    if (loading) {
        return <LoadingOutlined spin />
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    if (!order) {
        return <div>Order not found</div>
    }

    const { order_date, status, total_amount, user, orderItems, addresses } =
        order

    // Add totalGst to each order item
    const orderItemsWithOtherDetails = orderItems.map((item) => ({
        ...item,
        totalGst: (parseFloat(item.sub_total) * 0.03).toFixed(2),
    }))

    const totalSubTotal = order.orderItems.reduce(
        (acc, item) => acc + parseFloat(item.sub_total),
        0
    )

    // Function to format numbers with thousand separators
    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
        }).format(number)
    }

    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            render: (product) => (
                <div>
                    <img
                        src={`${appConfig.imgPrefix}/${product.p_images[0]}`}
                        alt={product.product_name}
                        style={{ width: '100px', height: '100px' }}
                    />
                    {product.product_name}
                </div>
            ),
        },
        {
            title: 'Unit Price',
            dataIndex: 'unit_price',
            render: (unit_price) => (
                <NumberFormat
                    displayType="text"
                    value={(Math.round(unit_price * 100) / 100).toFixed(2)}
                    prefix={'₹'}
                    thousandSeparator={true}
                    renderText={(value) => (
                        <span style={{ color: '#666' }}>{value}</span>
                    )}
                />
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Sub Total',
            dataIndex: 'sub_total',
            render: (sub_total) => (
                <NumberFormat
                    displayType="text"
                    value={(Math.round(sub_total * 100) / 100).toFixed(2)}
                    prefix={'₹'}
                    thousandSeparator={true}
                    renderText={(value) => (
                        <span style={{ color: '#666' }}>{value}</span>
                    )}
                />
            ),
        },
        {
            title: 'GST(3%)',
            dataIndex: 'totalGst',
            render: (totalGst) => (
                <NumberFormat
                    displayType="text"
                    value={(Math.round(totalGst * 100) / 100).toFixed(2)}
                    prefix={'₹'}
                    thousandSeparator={true}
                    renderText={(value) => (
                        <span style={{ color: '#666' }}>{value}</span>
                    )}
                />
            ),
        },
        {
            title: 'Amount With GST',
            dataIndex: 'total_price',
            render: (total_price) => (
                <NumberFormat
                    displayType="text"
                    value={(Math.round(total_price * 100) / 100).toFixed(2)}
                    prefix={'₹'}
                    thousandSeparator={true}
                    renderText={(value) => (
                        <span style={{ color: '#666' }}>{value}</span>
                    )}
                />
            ),
        },
    ]

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}
            >
                <h3 style={{ marginRight: '1rem' }}>Order #{order_id} </h3>
                <span
                    style={{
                        backgroundColor:
                            statusColorMapping[status]?.backgroundColor ||
                            '#E0B0FF',
                        color: statusColorMapping[status]?.color || 'purple',
                        padding: '4px 8px',
                        borderRadius: '4px',
                    }}
                >
                    {statusMap[status]}
                </span>
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '6px',
                    marginBottom: '20px',
                }}
            >
                <CalendarOutlined style={{ marginRight: '0.5rem' }} />
                <span>
                    {new Date(order_date).toLocaleString('en-GB', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    })}
                </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 60%', marginRight: '20px' }}>
                    {/* <Card
                    title="Order Details"
                    style={{ marginBottom: '20px' }}
                    headStyle={{
                        color: '#832729',
                    }}
                > */}

                    <Table
                        dataSource={orderItemsWithOtherDetails}
                        style={{
                            marginBottom: '20px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            borderRadius: '15px',
                        }}
                        columns={columns}
                        pagination={false}
                        footer={() => (
                            <div style={{ textAlign: 'right' }}>
                                <span
                                    style={{
                                        FontWeight: '700',
                                        fontSize: '15px',
                                        marginRight: '3px',
                                    }}
                                >
                                    {/* Sub Total:{' '} */}
                                    Net Amount:{' '}
                                </span>
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(
                                        totalSubTotal +
                                            totalSubTotal.toFixed(2) * 0.03
                                    ).toFixed(2)}
                                    prefix={'₹'}
                                    thousandSeparator={true}
                                    renderText={(value) => (
                                        <span
                                            style={{
                                                color: '#666',
                                                marginRight: '8px',
                                            }}
                                        >
                                            {value}
                                        </span>
                                    )}
                                />
                            </div>
                        )}
                    />
                    {/* </Card> */}
                    <Card
                        title={
                            <Space>
                                <CreditCardOutlined />
                                <Title
                                    level={4}
                                    style={{ margin: 0, color: '#832729' }}
                                >
                                    Payment Details
                                </Title>
                            </Space>
                        }
                        style={{
                            marginBottom: '20px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        }}
                        header={{
                            color: '#832729',
                        }}
                    >
                        <Paragraph>
                            <Space>
                                <ShoppingCartOutlined
                                    style={{ fontSize: '16px' }}
                                />
                                <Text strong>Invoice: </Text>
                                <Text>######</Text>
                            </Space>
                        </Paragraph>
                        <Paragraph>
                            <Space>
                                <CalendarOutlined
                                    style={{ fontSize: '16px' }}
                                />
                                <Text strong>Order Date: </Text>
                                <Text>
                                    {new Date(order_date).toLocaleString(
                                        'en-GB',
                                        {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                        }
                                    )}
                                </Text>
                            </Space>
                        </Paragraph>
                        <Paragraph>
                            <Space>
                                <SyncOutlined style={{ fontSize: '16px' }} />
                                <Text strong>Payment Status: </Text>
                                <Text
                                    style={{
                                        backgroundColor: '#d9f7be',
                                        color: '#52c41a',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontWeight: '630',
                                    }}
                                >
                                    {'Completed'}
                                </Text>
                            </Space>
                        </Paragraph>
                        <Paragraph>
                            <Space>
                                <CreditCardOutlined
                                    style={{ fontSize: '16px' }}
                                />
                                <Text strong>Payment Method: </Text>
                                <Text>Card</Text>
                            </Space>
                        </Paragraph>
                        <Paragraph>
                            <Space>
                                <ShoppingCartOutlined
                                    style={{ fontSize: '16px' }}
                                />
                                <Text strong>Sub Total: </Text>
                                <Text>₹{formatNumber(totalSubTotal)}</Text>
                            </Space>
                        </Paragraph>
                        <Paragraph>
                            <Space>
                                <ShoppingCartOutlined
                                    style={{ fontSize: '16px' }}
                                />
                                <Text strong>Total GST (3%): </Text>
                                <Text>
                                    ₹
                                    {formatNumber(
                                        totalSubTotal.toFixed(2) * 0.03
                                    )}
                                </Text>
                            </Space>
                        </Paragraph>

                        <Paragraph>
                            <Space>
                                <TruckOutlined style={{ fontSize: '16px' }} />
                                <Text strong>Shipping Cost: </Text>
                                <Text>Free</Text>
                            </Space>
                        </Paragraph>
                        <Paragraph>
                            <Space>
                                <ShoppingCartOutlined
                                    style={{ fontSize: '16px' }}
                                />
                                <Text strong>Grand Total: </Text>
                                <Text>
                                    <Text>
                                        ₹
                                        {formatNumber(
                                            totalSubTotal +
                                                totalSubTotal.toFixed(2) * 0.03
                                        )}
                                    </Text>
                                </Text>
                            </Space>
                        </Paragraph>
                    </Card>
                </div>
                <div style={{ flex: '1 1 35%' }}>
                    <Card
                        title={
                            <Space>
                                <UserOutlined />
                                <Title
                                    level={4}
                                    style={{ margin: 0, color: '#832729' }}
                                >
                                    Buyer Details
                                </Title>
                            </Space>
                        }
                        style={{
                            marginBottom: '20px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        }}
                        headStyle={{
                            color: '#832729',
                        }}
                    >
                        <Paragraph>
                            <Space>
                                <UserOutlined style={{ fontSize: '16px' }} />
                                <Text strong>Name: </Text>
                                <Text>{`${user.first_name} ${user.last_name}`}</Text>
                            </Space>
                        </Paragraph>
                        <Paragraph>
                            <Space>
                                <PhoneOutlined style={{ fontSize: '16px' }} />
                                <Text strong>Phone Number: </Text>
                                <Text>{user.phone_no}</Text>
                            </Space>
                        </Paragraph>
                        <Paragraph>
                            <Space>
                                <MailOutlined style={{ fontSize: '16px' }} />
                                <Text strong>Email: </Text>
                                <Text>{user.email}</Text>
                            </Space>
                        </Paragraph>
                    </Card>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* <div style={{ flex: '0 0 53px' }} /> */}
                        {/* This will create a 71px space above the next element */}
                        <Card
                            title={
                                <Space>
                                    <EnvironmentOutlined />
                                    <Title
                                        level={4}
                                        style={{ margin: 0, color: '#832729' }}
                                    >
                                        Shipping Information
                                    </Title>
                                </Space>
                            }
                            style={{
                                marginBottom: '20px',
                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            }}
                            headStyle={{
                                color: '#832729',
                            }}
                        >
                            <Paragraph>
                                <Space>
                                    <TruckOutlined
                                        style={{ fontSize: '16px' }}
                                    />
                                    <Text strong>Courier: </Text>
                                    <Text>####</Text>
                                </Space>
                            </Paragraph>
                            <Paragraph>
                                <Space>
                                    <TruckOutlined
                                        style={{ fontSize: '16px' }}
                                    />
                                    <Text strong>Tracking Number: </Text>
                                    <Text>#####</Text>
                                </Space>
                            </Paragraph>
                            {user.addresses.map((address) =>
                                address.address_type === 'shipping' ? (
                                    <>
                                        <Paragraph>
                                            <Space>
                                                <EnvironmentOutlined
                                                    style={{ fontSize: '16px' }}
                                                />
                                                <Text strong>
                                                    Shipping Address:
                                                </Text>
                                                <Text>
                                                    {address.street_address},{' '}
                                                    {address.city.city_name},{' '}
                                                    {address.state.state_name},{' '}
                                                    {address.pincode}
                                                </Text>
                                            </Space>
                                        </Paragraph>
                                        {/* <Paragraph>
                                        <Space>
                                            <EnvironmentOutlined
                                                style={{ fontSize: '16px' }}
                                            />
                                            <Text strong>City: </Text>
                                            <Text>
                                                {address.city.city_name}
                                            </Text>
                                        </Space>
                                    </Paragraph>
                                    <Paragraph>
                                        <Space>
                                            <EnvironmentOutlined
                                                style={{ fontSize: '16px' }}
                                            />
                                            <Text strong>State: </Text>
                                            <Text>
                                                {address.state.state_name}
                                            </Text>
                                        </Space>
                                    </Paragraph>
                                    <Paragraph>
                                        <Space>
                                            <EnvironmentOutlined
                                                style={{ fontSize: '16px' }}
                                            />
                                            <Text strong>Pincode: </Text>
                                            <Text>{address.pincode}</Text>
                                        </Space>
                                    </Paragraph> */}
                                    </>
                                ) : null
                            )}
                            {user.addresses.map((address) =>
                                address.address_type === 'billing' ? (
                                    <Paragraph>
                                        <Space>
                                            <EnvironmentOutlined
                                                style={{ fontSize: '16px' }}
                                            />
                                            <Text strong>
                                                Billing Address:{' '}
                                            </Text>
                                            <Text>
                                                {address.street_address},{' '}
                                                {address.city.city_name},{' '}
                                                {address.state.state_name},{' '}
                                                {address.pincode}
                                            </Text>
                                        </Space>
                                    </Paragraph>
                                ) : null
                            )}
                        </Card>
                    </div>
                </div>
                <Card
                    title={
                        <Space>
                            <TruckOutlined />
                            <Title
                                level={4}
                                style={{ margin: 0, color: '#832729' }}
                            >
                                Tracking Info
                            </Title>
                        </Space>
                    }
                    style={{
                        width: '100%',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    }}
                    headStyle={{ color: '#832729' }}
                >
                    {orderStatus && (
                        <Steps
                            direction="vertical"
                            style={{ marginBottom: '20px' }}
                            current={orderStatus.vendor_status}
                        >
                            <Step
                                title="Order Received"
                                description={
                                    orderStatus.order_received ? (
                                        <span style={{ color: '#666' }}>
                                            {new Date(
                                                orderStatus?.order_received
                                            ).toLocaleString('en-GB', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                            })}
                                        </span>
                                    ) : null
                                }
                                content="Your order has been received."
                                icon={<UserOutlined />}
                            />
                            <Step
                                title="Processing"
                                description={
                                    orderStatus.processing ? (
                                        <span style={{ color: '#666' }}>
                                            {new Date(
                                                orderStatus?.processing
                                            ).toLocaleString('en-GB', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                            })}
                                        </span>
                                    ) : null
                                }
                                content="Your order is being processed."
                                icon={<SyncOutlined />}
                            />
                            <Step
                                title="Shipped"
                                description={
                                    orderStatus.shipped ? (
                                        <span style={{ color: '#666' }}>
                                            {new Date(
                                                orderStatus?.shipped
                                            ).toLocaleString('en-GB', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                            })}
                                        </span>
                                    ) : null
                                }
                                content="Your order has been shipped."
                                icon={<TruckOutlined />}
                            />
                            <Step
                                title="Out for Delivery"
                                description={
                                    orderStatus.out_for_delivery ? (
                                        <span style={{ color: '#666' }}>
                                            {new Date(
                                                orderStatus?.out_for_delivery
                                            ).toLocaleString('en-GB', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                            })}
                                        </span>
                                    ) : null
                                }
                                content="Your order is out for delivery."
                                icon={<EnvironmentOutlined />}
                            />
                            <Step
                                title="Delivered"
                                description={
                                    orderStatus.delivered ? (
                                        <span style={{ color: '#666' }}>
                                            {new Date(
                                                orderStatus?.delivered
                                            ).toLocaleString('en-GB', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                            })}
                                        </span>
                                    ) : null
                                }
                                content="Your order has been delivered."
                                icon={<CheckCircleOutlined />}
                            />
                        </Steps>
                    )}
                    {status !== 3 &&
                        status !== 4 &&
                        status !== 5 &&
                        status !== 6 && ( // Show the button if the status is not "Delivered" or "Cancelled"
                            <Button
                                style={{ marginTop: '18px' }}
                                varient="solid"
                                size="sm"
                                onClick={handleUpdateStatus}
                                disabled={isUpdating}
                            >
                                {isUpdating
                                    ? 'Updating...'
                                    : getNextStatusText()}
                            </Button>
                        )}
                </Card>
                <div style={{ marginTop: '18px' }}>
                    <Button
                        style={{ color: '#832729' }}
                        varient="solid"
                        size="sm"
                        onClick={handleRefresh}
                    >
                        Back to Order List
                    </Button>
                </div>
            </div>
        </>
    )
}

export default OrderDetails


//before color change
// import React, { useState, useEffect } from 'react'
// import { Card, Table, Steps, Typography, Space, Tag } from 'antd'
// import {
//     LoadingOutlined,
//     UserOutlined,
//     CreditCardOutlined,
//     CalendarOutlined,
//     SyncOutlined,
//     ShoppingCartOutlined,
//     TruckOutlined,
//     EnvironmentOutlined,
//     MailOutlined,
//     PhoneOutlined,
//     CheckCircleOutlined,
//     CloseCircleOutlined,
// } from '@ant-design/icons'
// import { Button } from 'components/ui'

// import { useParams, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import appConfig from 'configs/app.config'
// import NumberFormat from 'react-number-format'
// import { jwtDecode } from 'jwt-decode'

// const token = localStorage.getItem('admin')
// const decodedToken = jwtDecode(token)
// var vendor_id = decodedToken.id

// const authData = JSON.parse(localStorage.getItem('admin')).auth
// const authData1 = JSON.parse(authData)
// const token1 = authData1.session.token
// // console.log('new token ---', token1)

// const { Step } = Steps
// const { Title, Paragraph, Text } = Typography

// const OrderDetails = () => {
//     const { order_id } = useParams()
//     const navigate = useNavigate()
//     const [order, setOrder] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [orderStatus, setOrderStatus] = useState(null)
//     const [isUpdating, setIsUpdating] = useState(false)

//     useEffect(() => {
//         if (order_id) {
//             const fetchOrderDetails = async () => {
//                 try {
//                     setLoading(true)
//                     const response = await axios.get(
//                         `${appConfig.apiPrefix}/order/${order_id}/vendors/${vendor_id}`
//                     )
//                     setOrder(response.data.order)
//                 } catch (err) {
//                     setError(err)
//                 } finally {
//                     setLoading(false)
//                 }
//             }

//             fetchOrderDetails()
//         }
//     }, [order_id])
//     useEffect(() => {
//         if (order && order.orderItems && order.orderItems.length > 0) {
//             const orderItemId = order.orderItems[0].orderItem_id
//             const fetchOrderStatus = async () => {
//                 try {
//                     setLoading(true)
//                     const response = await axios.get(
//                         `${appConfig.apiPrefix}/order/order-items/${orderItemId}/status`
//                     )
//                     setOrderStatus(response.data)
//                 } catch (err) {
//                     setError(err)
//                 } finally {
//                     setLoading(false)
//                 }
//             }

//             fetchOrderStatus()
//         }
//     }, [order])

//     const handleRefresh = () => {
//         navigate('/app/vendor-orders/OrderManagement')
//     }
//     const handleUpdateStatus = async () => {
//         try {
//             setIsUpdating(true)
//             const newStatus = status === 5 ? 5 : status + 1 // If status is "Delivered" (5), keep it the same, otherwise increment it
//             const headers = {
//                 headers: {
//                     Authorization: `Bearer ${token1}`,
//                 },
//             }

//             // Update the order status
//             for (const orderItem of order.orderItems) {
//                 const updateResponse = await axios.put(
//                     `${appConfig.apiPrefix}/order/vendor/${order_id}/item/${orderItem.orderItem_id}/status`,
//                     { vendor_status: newStatus },
//                     headers
//                 )
//             }

//             // Fetch the updated order details
//             const fetchResponse = await axios.get(
//                 `${appConfig.apiPrefix}/order/${order_id}/vendors/${vendor_id}`
//             )
//             setOrder(fetchResponse.data.order)
//         } catch (err) {
//             setError(err)
//         } finally {
//             setIsUpdating(false)
//         }
//     }
//     const getNextStatusText = () => {
//         switch (status) {
//             case 1:
//                 return 'Update to Processing'
//             case 2:
//                 return 'Update to Shipped'
//             case 3:
//                 return 'Update to Out for Delivery'
//             case 4:
//                 return 'Update to Delivered'
//             case 5:
//                 return 'Order Delivered'
//             default:
//                 return 'Unknown Status'
//         }
//     }
//     const statusMap = {
//         1: 'Order Received',
//         2: 'Processing',
//         3: 'Shipped',
//         4: 'Out for Delivery',
//         5: 'Delivered',
//         // 6: 'Cancelled',
//     }
//     const statusColorMapping = {
//         1: { backgroundColor: '#fde3cf', color: '#fa8c16' },
//         2: { backgroundColor: '#e6f7ff', color: '#1890ff' },
//         3: { backgroundColor: '#CF9FFF', color: 'purple' },
//         4: { backgroundColor: '#e6f7ff', color: '#52c41a' },
//         5: { backgroundColor: '#d9f7be', color: '#52c41a' },
//         6: { backgroundColor: '#fff1f0', color: '#f5222d' },
//     }

//     if (!order_id) {
//         return <div>Loading...</div>
//     }
//     if (loading) {
//         return <LoadingOutlined spin />
//     }

//     if (error) {
//         return <div>Error: {error.message}</div>
//     }

//     if (!order) {
//         return <div>Order not found</div>
//     }

//     const { order_date, status, total_amount, user, orderItems, addresses } =
//         order

//     // Add totalGst to each order item
//     const orderItemsWithOtherDetails = orderItems.map((item) => ({
//         ...item,
//         totalGst: (parseFloat(item.sub_total) * 0.03).toFixed(2),
//     }))

//     const totalSubTotal = order.orderItems.reduce(
//         (acc, item) => acc + parseFloat(item.sub_total),
//         0
//     )

//     // Function to format numbers with thousand separators
//     const formatNumber = (number) => {
//         return new Intl.NumberFormat('en-IN', {
//             maximumFractionDigits: 2,
//         }).format(number)
//     }

//     const columns = [
//         {
//             title: 'Product',
//             dataIndex: 'product',
//             render: (product) => (
//                 <div>
//                     <img
//                         src={`${appConfig.imgPrefix}/${product.p_images[0]}`}
//                         alt={product.product_name}
//                         style={{ width: '100px', height: '100px' }}
//                     />
//                     {product.product_name}
//                 </div>
//             ),
//         },
//         {
//             title: 'Unit Price',
//             dataIndex: 'unit_price',
//             render: (unit_price) => (
//                 <NumberFormat
//                     displayType="text"
//                     value={(Math.round(unit_price * 100) / 100).toFixed(2)}
//                     prefix={'₹'}
//                     thousandSeparator={true}
//                     renderText={(value) => (
//                         <span style={{ color: '#666' }}>{value}</span>
//                     )}
//                 />
//             ),
//         },
//         {
//             title: 'Quantity',
//             dataIndex: 'quantity',
//         },
//         {
//             title: 'Sub Total',
//             dataIndex: 'sub_total',
//             render: (sub_total) => (
//                 <NumberFormat
//                     displayType="text"
//                     value={(Math.round(sub_total * 100) / 100).toFixed(2)}
//                     prefix={'₹'}
//                     thousandSeparator={true}
//                     renderText={(value) => (
//                         <span style={{ color: '#666' }}>{value}</span>
//                     )}
//                 />
//             ),
//         },
//         {
//             title: 'GST(3%)',
//             dataIndex: 'totalGst',
//             render: (totalGst) => (
//                 <NumberFormat
//                     displayType="text"
//                     value={(Math.round(totalGst * 100) / 100).toFixed(2)}
//                     prefix={'₹'}
//                     thousandSeparator={true}
//                     renderText={(value) => (
//                         <span style={{ color: '#666' }}>{value}</span>
//                     )}
//                 />
//             ),
//         },
//         {
//             title: 'Amount With GST',
//             dataIndex: 'total_price',
//             render: (total_price) => (
//                 <NumberFormat
//                     displayType="text"
//                     value={(Math.round(total_price * 100) / 100).toFixed(2)}
//                     prefix={'₹'}
//                     thousandSeparator={true}
//                     renderText={(value) => (
//                         <span style={{ color: '#666' }}>{value}</span>
//                     )}
//                 />
//             ),
//         },
//     ]

//     return (
//         <>
//             <div
//                 style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     flexWrap: 'wrap',
//                 }}
//             >
//                 <h3 style={{ marginRight: '1rem' }}>Order #{order_id} </h3>
//                 <span
//                     style={{
//                         backgroundColor:
//                             statusColorMapping[status]?.backgroundColor ||
//                             '#E0B0FF',
//                         color: statusColorMapping[status]?.color || 'purple',
//                         padding: '4px 8px',
//                         borderRadius: '4px',
//                     }}
//                 >
//                     {statusMap[status]}
//                 </span>
//             </div>

//             <div
//                 style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     marginTop: '6px',
//                     marginBottom: '20px',
//                 }}
//             >
//                 <CalendarOutlined style={{ marginRight: '0.5rem' }} />
//                 <span>
//                     {new Date(order_date).toLocaleString('en-GB', {
//                         weekday: 'short',
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric',
//                         hour: 'numeric',
//                         minute: 'numeric',
//                         hour12: true,
//                     })}
//                 </span>
//             </div>
//             <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//                 <div style={{ flex: '1 1 60%', marginRight: '20px' }}>
//                     {/* <Card
//                     title="Order Details"
//                     style={{ marginBottom: '20px' }}
//                     headStyle={{
//                         color: '#022B4E',
//                     }}
//                 > */}

//                     <Table
//                         dataSource={orderItemsWithOtherDetails}
//                         style={{
//                             marginBottom: '20px',
//                             boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//                             borderRadius: '15px',
//                         }}
//                         columns={columns}
//                         pagination={false}
//                         footer={() => (
//                             <div style={{ textAlign: 'right' }}>
//                                 <span
//                                     style={{
//                                         FontWeight: '700',
//                                         fontSize: '15px',
//                                         marginRight: '3px',
//                                     }}
//                                 >
//                                     {/* Sub Total:{' '} */}
//                                     Net Amount:{' '}
//                                 </span>
//                                 <NumberFormat
//                                     displayType="text"
//                                     value={Math.round(
//                                         totalSubTotal +
//                                             totalSubTotal.toFixed(2) * 0.03
//                                     ).toFixed(2)}
//                                     prefix={'₹'}
//                                     thousandSeparator={true}
//                                     renderText={(value) => (
//                                         <span
//                                             style={{
//                                                 color: '#666',
//                                                 marginRight: '8px',
//                                             }}
//                                         >
//                                             {value}
//                                         </span>
//                                     )}
//                                 />
//                             </div>
//                         )}
//                     />
//                     {/* </Card> */}
//                     <Card
//                         title={
//                             <Space>
//                                 <CreditCardOutlined />
//                                 <Title
//                                     level={4}
//                                     style={{ margin: 0, color: '#022B4E' }}
//                                 >
//                                     Payment Details
//                                 </Title>
//                             </Space>
//                         }
//                         style={{
//                             marginBottom: '20px',
//                             boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//                         }}
//                         header={{
//                             color: '#022B4E',
//                         }}
//                     >
//                         <Paragraph>
//                             <Space>
//                                 <ShoppingCartOutlined
//                                     style={{ fontSize: '16px' }}
//                                 />
//                                 <Text strong>Invoice: </Text>
//                                 <Text>######</Text>
//                             </Space>
//                         </Paragraph>
//                         <Paragraph>
//                             <Space>
//                                 <CalendarOutlined
//                                     style={{ fontSize: '16px' }}
//                                 />
//                                 <Text strong>Order Date: </Text>
//                                 <Text>
//                                     {new Date(order_date).toLocaleString(
//                                         'en-GB',
//                                         {
//                                             weekday: 'short',
//                                             month: 'short',
//                                             day: 'numeric',
//                                             year: 'numeric',
//                                             hour: 'numeric',
//                                             minute: 'numeric',
//                                             hour12: true,
//                                         }
//                                     )}
//                                 </Text>
//                             </Space>
//                         </Paragraph>
//                         <Paragraph>
//                             <Space>
//                                 <SyncOutlined style={{ fontSize: '16px' }} />
//                                 <Text strong>Payment Status: </Text>
//                                 <Text
//                                     style={{
//                                         backgroundColor: '#d9f7be',
//                                         color: '#52c41a',
//                                         padding: '4px 8px',
//                                         borderRadius: '4px',
//                                         fontWeight: '630',
//                                     }}
//                                 >
//                                     {'Completed'}
//                                 </Text>
//                             </Space>
//                         </Paragraph>
//                         <Paragraph>
//                             <Space>
//                                 <CreditCardOutlined
//                                     style={{ fontSize: '16px' }}
//                                 />
//                                 <Text strong>Payment Method: </Text>
//                                 <Text>Card</Text>
//                             </Space>
//                         </Paragraph>
//                         <Paragraph>
//                             <Space>
//                                 <ShoppingCartOutlined
//                                     style={{ fontSize: '16px' }}
//                                 />
//                                 <Text strong>Sub Total: </Text>
//                                 <Text>₹{formatNumber(totalSubTotal)}</Text>
//                             </Space>
//                         </Paragraph>
//                         <Paragraph>
//                             <Space>
//                                 <ShoppingCartOutlined
//                                     style={{ fontSize: '16px' }}
//                                 />
//                                 <Text strong>Total GST (3%): </Text>
//                                 <Text>
//                                     ₹
//                                     {formatNumber(
//                                         totalSubTotal.toFixed(2) * 0.03
//                                     )}
//                                 </Text>
//                             </Space>
//                         </Paragraph>

//                         <Paragraph>
//                             <Space>
//                                 <TruckOutlined style={{ fontSize: '16px' }} />
//                                 <Text strong>Shipping Cost: </Text>
//                                 <Text>Free</Text>
//                             </Space>
//                         </Paragraph>
//                         <Paragraph>
//                             <Space>
//                                 <ShoppingCartOutlined
//                                     style={{ fontSize: '16px' }}
//                                 />
//                                 <Text strong>Grand Total: </Text>
//                                 <Text>
//                                     <Text>
//                                         ₹
//                                         {formatNumber(
//                                             totalSubTotal +
//                                                 totalSubTotal.toFixed(2) * 0.03
//                                         )}
//                                     </Text>
//                                 </Text>
//                             </Space>
//                         </Paragraph>
//                     </Card>
//                 </div>
//                 <div style={{ flex: '1 1 35%' }}>
//                     <Card
//                         title={
//                             <Space>
//                                 <UserOutlined />
//                                 <Title
//                                     level={4}
//                                     style={{ margin: 0, color: '#022B4E' }}
//                                 >
//                                     Buyer Details
//                                 </Title>
//                             </Space>
//                         }
//                         style={{
//                             marginBottom: '20px',
//                             boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//                         }}
//                         headStyle={{
//                             color: '#022B4E',
//                         }}
//                     >
//                         <Paragraph>
//                             <Space>
//                                 <UserOutlined style={{ fontSize: '16px' }} />
//                                 <Text strong>Name: </Text>
//                                 <Text>{`${user.first_name} ${user.last_name}`}</Text>
//                             </Space>
//                         </Paragraph>
//                         <Paragraph>
//                             <Space>
//                                 <PhoneOutlined style={{ fontSize: '16px' }} />
//                                 <Text strong>Phone Number: </Text>
//                                 <Text>{user.phone_no}</Text>
//                             </Space>
//                         </Paragraph>
//                         <Paragraph>
//                             <Space>
//                                 <MailOutlined style={{ fontSize: '16px' }} />
//                                 <Text strong>Email: </Text>
//                                 <Text>{user.email}</Text>
//                             </Space>
//                         </Paragraph>
//                     </Card>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                         {/* <div style={{ flex: '0 0 53px' }} /> */}
//                         {/* This will create a 71px space above the next element */}
//                         <Card
//                             title={
//                                 <Space>
//                                     <EnvironmentOutlined />
//                                     <Title
//                                         level={4}
//                                         style={{ margin: 0, color: '#022B4E' }}
//                                     >
//                                         Shipping Information
//                                     </Title>
//                                 </Space>
//                             }
//                             style={{
//                                 marginBottom: '20px',
//                                 boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//                             }}
//                             headStyle={{
//                                 color: '#022B4E',
//                             }}
//                         >
//                             <Paragraph>
//                                 <Space>
//                                     <TruckOutlined
//                                         style={{ fontSize: '16px' }}
//                                     />
//                                     <Text strong>Courier: </Text>
//                                     <Text>####</Text>
//                                 </Space>
//                             </Paragraph>
//                             <Paragraph>
//                                 <Space>
//                                     <TruckOutlined
//                                         style={{ fontSize: '16px' }}
//                                     />
//                                     <Text strong>Tracking Number: </Text>
//                                     <Text>#####</Text>
//                                 </Space>
//                             </Paragraph>
//                             {user.addresses.map((address) =>
//                                 address.address_type === 'shipping' ? (
//                                     <>
//                                         <Paragraph>
//                                             <Space>
//                                                 <EnvironmentOutlined
//                                                     style={{ fontSize: '16px' }}
//                                                 />
//                                                 <Text strong>
//                                                     Shipping Address:
//                                                 </Text>
//                                                 <Text>
//                                                     {address.street_address},{' '}
//                                                     {address.city.city_name},{' '}
//                                                     {address.state.state_name},{' '}
//                                                     {address.pincode}
//                                                 </Text>
//                                             </Space>
//                                         </Paragraph>
//                                         {/* <Paragraph>
//                                         <Space>
//                                             <EnvironmentOutlined
//                                                 style={{ fontSize: '16px' }}
//                                             />
//                                             <Text strong>City: </Text>
//                                             <Text>
//                                                 {address.city.city_name}
//                                             </Text>
//                                         </Space>
//                                     </Paragraph>
//                                     <Paragraph>
//                                         <Space>
//                                             <EnvironmentOutlined
//                                                 style={{ fontSize: '16px' }}
//                                             />
//                                             <Text strong>State: </Text>
//                                             <Text>
//                                                 {address.state.state_name}
//                                             </Text>
//                                         </Space>
//                                     </Paragraph>
//                                     <Paragraph>
//                                         <Space>
//                                             <EnvironmentOutlined
//                                                 style={{ fontSize: '16px' }}
//                                             />
//                                             <Text strong>Pincode: </Text>
//                                             <Text>{address.pincode}</Text>
//                                         </Space>
//                                     </Paragraph> */}
//                                     </>
//                                 ) : null
//                             )}
//                             {user.addresses.map((address) =>
//                                 address.address_type === 'billing' ? (
//                                     <Paragraph>
//                                         <Space>
//                                             <EnvironmentOutlined
//                                                 style={{ fontSize: '16px' }}
//                                             />
//                                             <Text strong>
//                                                 Billing Address:{' '}
//                                             </Text>
//                                             <Text>
//                                                 {address.street_address},{' '}
//                                                 {address.city.city_name},{' '}
//                                                 {address.state.state_name},{' '}
//                                                 {address.pincode}
//                                             </Text>
//                                         </Space>
//                                     </Paragraph>
//                                 ) : null
//                             )}
//                         </Card>
//                     </div>
//                 </div>
//                 <Card
//                     title={
//                         <Space>
//                             <TruckOutlined />
//                             <Title
//                                 level={4}
//                                 style={{ margin: 0, color: '#022B4E' }}
//                             >
//                                 Tracking Info
//                             </Title>
//                         </Space>
//                     }
//                     style={{
//                         width: '100%',
//                         boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//                     }}
//                     headStyle={{ color: '#022B4E' }}
//                 >
//                     {orderStatus && (
//                         <Steps
//                             direction="vertical"
//                             style={{ marginBottom: '20px' }}
//                             current={orderStatus.vendor_status}
//                         >
//                             <Step
//                                 title="Order Received"
//                                 description={
//                                     orderStatus.order_received ? (
//                                         <span style={{ color: '#666' }}>
//                                             {new Date(
//                                                 orderStatus?.order_received
//                                             ).toLocaleString('en-GB', {
//                                                 weekday: 'short',
//                                                 month: 'short',
//                                                 day: 'numeric',
//                                                 year: 'numeric',
//                                                 hour: 'numeric',
//                                                 minute: 'numeric',
//                                                 hour12: true,
//                                             })}
//                                         </span>
//                                     ) : null
//                                 }
//                                 content="Your order has been received."
//                                 icon={<UserOutlined />}
//                             />
//                             <Step
//                                 title="Processing"
//                                 description={
//                                     orderStatus.processing ? (
//                                         <span style={{ color: '#666' }}>
//                                             {new Date(
//                                                 orderStatus?.processing
//                                             ).toLocaleString('en-GB', {
//                                                 weekday: 'short',
//                                                 month: 'short',
//                                                 day: 'numeric',
//                                                 year: 'numeric',
//                                                 hour: 'numeric',
//                                                 minute: 'numeric',
//                                                 hour12: true,
//                                             })}
//                                         </span>
//                                     ) : null
//                                 }
//                                 content="Your order is being processed."
//                                 icon={<SyncOutlined />}
//                             />
//                             <Step
//                                 title="Shipped"
//                                 description={
//                                     orderStatus.shipped ? (
//                                         <span style={{ color: '#666' }}>
//                                             {new Date(
//                                                 orderStatus?.shipped
//                                             ).toLocaleString('en-GB', {
//                                                 weekday: 'short',
//                                                 month: 'short',
//                                                 day: 'numeric',
//                                                 year: 'numeric',
//                                                 hour: 'numeric',
//                                                 minute: 'numeric',
//                                                 hour12: true,
//                                             })}
//                                         </span>
//                                     ) : null
//                                 }
//                                 content="Your order has been shipped."
//                                 icon={<TruckOutlined />}
//                             />
//                             <Step
//                                 title="Out for Delivery"
//                                 description={
//                                     orderStatus.out_for_delivery ? (
//                                         <span style={{ color: '#666' }}>
//                                             {new Date(
//                                                 orderStatus?.out_for_delivery
//                                             ).toLocaleString('en-GB', {
//                                                 weekday: 'short',
//                                                 month: 'short',
//                                                 day: 'numeric',
//                                                 year: 'numeric',
//                                                 hour: 'numeric',
//                                                 minute: 'numeric',
//                                                 hour12: true,
//                                             })}
//                                         </span>
//                                     ) : null
//                                 }
//                                 content="Your order is out for delivery."
//                                 icon={<EnvironmentOutlined />}
//                             />
//                             <Step
//                                 title="Delivered"
//                                 description={
//                                     orderStatus.delivered ? (
//                                         <span style={{ color: '#666' }}>
//                                             {new Date(
//                                                 orderStatus?.delivered
//                                             ).toLocaleString('en-GB', {
//                                                 weekday: 'short',
//                                                 month: 'short',
//                                                 day: 'numeric',
//                                                 year: 'numeric',
//                                                 hour: 'numeric',
//                                                 minute: 'numeric',
//                                                 hour12: true,
//                                             })}
//                                         </span>
//                                     ) : null
//                                 }
//                                 content="Your order has been delivered."
//                                 icon={<CheckCircleOutlined />}
//                             />
//                         </Steps>
//                     )}
//                     {status !== 3 &&
//                         status !== 4 &&
//                         status !== 5 &&
//                         status !== 6 && ( // Show the button if the status is not "Delivered" or "Cancelled"
//                             <Button
//                                 style={{ marginTop: '18px' }}
//                                 varient="solid"
//                                 size="sm"
//                                 onClick={handleUpdateStatus}
//                                 disabled={isUpdating}
//                             >
//                                 {isUpdating
//                                     ? 'Updating...'
//                                     : getNextStatusText()}
//                             </Button>
//                         )}
//                 </Card>
//                 <div style={{ marginTop: '18px' }}>
//                     <Button
//                         style={{ color: '#022B4E' }}
//                         varient="solid"
//                         size="sm"
//                         onClick={handleRefresh}
//                     >
//                         Back to Order List
//                     </Button>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default OrderDetails

