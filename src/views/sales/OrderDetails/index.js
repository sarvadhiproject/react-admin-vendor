// import React, { useState, useEffect } from 'react'
// import classNames from 'classnames'
// import { Tag } from 'components/ui'
// import { Loading, Container, DoubleSidedImage } from 'components/shared'
// import OrderProducts from './components/OrderProducts'
// import PaymentSummary from './components/PaymentSummary'
// import ShippingInfo from './components/ShippingInfo'
// import Activity from './components/Activity'
// import CustomerInfo from './components/CustomerInfo'
// import { HiOutlineCalendar } from 'react-icons/hi'
// import { apiGetSalesOrderDetails } from 'services/SalesService'
// import { useLocation } from 'react-router-dom'
// import isEmpty from 'lodash/isEmpty'
// import dayjs from 'dayjs'

// const paymentStatus = {
//     0: {
//         label: 'Paid',
//         class: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100',
//     },
//     1: {
//         label: 'Unpaid',
//         class: 'text-red-500 bg-red-100 dark:text-red-100 dark:bg-red-500/20',
//     },
// }

// const progressStatus = {
//     0: {
//         label: 'Fulfilled',
//         class: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-100',
//     },
//     1: {
//         label: 'Unfulfilled',
//         class: 'text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20',
//     },
// }

// const OrderDetails = () => {
//     const location = useLocation()

//     const [loading, setLoading] = useState(false)
//     const [data, setData] = useState({})

//     useEffect(() => {
//         fetchData()
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     const fetchData = async () => {
//         const id = location.pathname.substring(
//             location.pathname.lastIndexOf('/') + 1
//         )
//         if (id) {
//             setLoading(true)
//             const response = await apiGetSalesOrderDetails({ id })
//             if (response) {
//                 setLoading(false)
//                 setData(response.data)
//             }
//         }
//     }

//     return (
//         <Container className="h-full">
//             <Loading loading={loading}>
//                 {!isEmpty(data) && (
//                     <>
//                         <div className="mb-6">
//                             <div className="flex items-center mb-2">
//                                 <h3>
//                                     <span>Order</span>
//                                     <span className="ltr:ml-2 rtl:mr-2">
//                                         #{data.id}
//                                     </span>
//                                 </h3>
//                                 <Tag
//                                     className={classNames(
//                                         'border-0 rounded-md ltr:ml-2 rtl:mr-2',
//                                         paymentStatus[data.payementStatus].class
//                                     )}
//                                 >
//                                     {paymentStatus[data.payementStatus].label}
//                                 </Tag>
//                                 <Tag
//                                     className={classNames(
//                                         'border-0 rounded-md ltr:ml-2 rtl:mr-2',
//                                         progressStatus[data.progressStatus]
//                                             .class
//                                     )}
//                                 >
//                                     {progressStatus[data.progressStatus].label}
//                                 </Tag>
//                             </div>
//                             <span className="flex items-center">
//                                 <HiOutlineCalendar className="text-lg" />
//                                 <span className="ltr:ml-1 rtl:mr-1">
//                                     {dayjs
//                                         .unix(data.dateTime)
//                                         .format('ddd DD-MMM-YYYY, hh:mm A')}
//                                 </span>
//                             </span>
//                         </div>
//                         <div className="xl:flex gap-4">
//                             <div className="w-full">
//                                 <OrderProducts data={data.product} />
//                                 <div className="xl:grid grid-cols-2 gap-4">
//                                     <ShippingInfo data={data.shipping} />
//                                     <PaymentSummary
//                                         data={data.paymentSummary}
//                                     />
//                                 </div>
//                                 <Activity data={data.activity} />
//                             </div>
//                             <div className="xl:max-w-[360px] w-full">
//                                 <CustomerInfo data={data.customer} />
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </Loading>
//             {!loading && isEmpty(data) && (
//                 <div className="h-full flex flex-col items-center justify-center">
//                     <DoubleSidedImage
//                         src="/img/others/img-2.png"
//                         darkModeSrc="/img/others/img-2-dark.png"
//                         alt="No order found!"
//                     />
//                     <h3 className="mt-8">No order found!</h3>
//                 </div>
//             )}
//         </Container>
//     )
// }

// export default OrderDetails
// OrderDetails.jsx

// import React, { useState, useEffect } from 'react'
// import { Card, Table, Tag, Button, Descriptions, Steps, Typography } from 'antd'
// import { LoadingOutlined } from '@ant-design/icons'

// const { Step } = Steps

// const OrderDetails = ({ orderId }) => {
//     const [order, setOrder] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [transactionStatus, setTransactionStatus] = useState('')
//     const { Title, Paragraph } = Typography

//     // useEffect(() => {
//     //     // Fetch order details from API
//     //     const fetchOrderDetails = async () => {
//     //         try {
//     //             const response = await fetch(`/api/orders/${orderId}`)
//     //             const data = await response.json()
//     //             setOrder(data)
//     //             setTransactionStatus(data.transactionStatus)
//     //         } catch (error) {
//     //             setError(error)
//     //         } finally {
//     //             setLoading(false)
//     //         }
//     //     }

//     //     fetchOrderDetails()
//     // }, [orderId])
//     useEffect(() => {
//         // Dummy data
//         const dummyOrder = {
//             products: [
//                 {
//                     product: {
//                         name: 'Product 1',
//                         imageUrl: 'https://via.placeholder.com/50',
//                     },
//                     unitPrice: 19.99,
//                     quantity: 2,
//                     total: 39.98,
//                 },
//                 {
//                     product: {
//                         name: 'Product 2',
//                         imageUrl: 'https://via.placeholder.com/50',
//                     },
//                     unitPrice: 29.99,
//                     quantity: 1,
//                     total: 29.99,
//                 },
//             ],
//             invoiceNumber: 'INV-123456',
//             purchaseDate: '2023-05-09',
//             buyer: {
//                 name: 'John Doe',
//                 phoneNumber: '+1 123 456 7890',
//                 email: 'john.doe@example.com',
//             },
//             paymentDetails: {
//                 paymentMethod: 'Credit Card',
//                 totalPrice: 69.97,
//                 shippingCost: 5.99,
//                 grandTotal: 75.96,
//             },
//             shippingInfo: {
//                 courier: 'FedEx',
//                 trackingNumber: '1234567890',
//                 shippingAddress: '123 Main St, Anytown USA',
//                 billingAddress: '123 Main St, Anytown USA',
//             },
//             trackingInfo: [
//                 {
//                     date: '2023-05-09T10:00:00Z',
//                     status: 'Shipped',
//                     message: 'Order has been shipped',
//                 },
//                 {
//                     date: '2023-05-10T14:00:00Z',
//                     status: 'In Transit',
//                     message: 'Package is in transit',
//                 },
//                 {
//                     date: '2023-05-11T16:00:00Z',
//                     status: 'Delivered',
//                     message: 'Package has been delivered',
//                 },
//             ],
//             transactionStatus: 'Completed',
//         }

//         setOrder(dummyOrder)
//         setTransactionStatus(dummyOrder.transactionStatus)
//         setLoading(false)
//     }, [])

//     const handleTransactionStatusChange = async (newStatus) => {
//         // try {
//         //     // Update transaction status in API
//         //     await fetch(`/api/orders/${orderId}/status`, {
//         //         method: 'PUT',
//         //         headers: {
//         //             'Content-Type': 'application/json',
//         //         },
//         //         body: JSON.stringify({ status: newStatus }),
//         //     })
//         setTransactionStatus(newStatus)
//         // } catch (error) {
//         //     setError(error)
//         // }
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

//     const {
//         products,
//         invoiceNumber,
//         purchaseDate,
//         buyer,
//         paymentDetails,
//         shippingInfo,
//         trackingInfo,
//     } = order

//     const columns = [
//         {
//             title: 'Product',
//             dataIndex: 'product',
//             render: (product) => (
//                 <div>
//                     <img
//                         src={product.imageUrl}
//                         alt={product.name}
//                         style={{ width: '50px', height: '50px' }}
//                     />
//                     {product.name}
//                 </div>
//             ),
//         },
//         {
//             title: 'Unit Price',
//             dataIndex: 'unitPrice',
//             render: (unitPrice) => <span>${unitPrice.toFixed(2)}</span>,
//         },
//         {
//             title: 'Quantity',
//             dataIndex: 'quantity',
//         },
//         {
//             title: 'Total',
//             dataIndex: 'total',
//             render: (total) => <span>${total.toFixed(2)}</span>,
//         },
//     ]

//     const transactionSteps = trackingInfo.map(
//         ({ date, status, message }, index) => (
//             <Step
//                 key={index}
//                 title={new Date(date).toLocaleDateString()}
//                 description={message}
//                 status={
//                     index === trackingInfo.length - 1 ? 'process' : 'finish'
//                 }
//             />
//         )
//     )

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column' }}>
//             <Card title="Order Details" style={{ marginBottom: '20px' }}>
//                 <Table
//                     dataSource={products}
//                     columns={columns}
//                     pagination={false}
//                 />
//             </Card>
//             <Card
//                 title="Payment Details"
//                 style={{ marginBottom: '20px' }}
//                 headStyle={{ fontWeight: 'bold' }}
//             >
//                 <Paragraph>
//                     <Title level={5}>Invoice: {invoiceNumber}</Title>
//                     <Title level={5}>Purchase Date: {purchaseDate}</Title>
//                     <Title level={5}>
//                         Transaction Status: {transactionStatus}
//                         <Button
//                             type="primary"
//                             style={{ marginLeft: '10px' }}
//                             onClick={() =>
//                                 handleTransactionStatusChange('Completed')
//                             }
//                         >
//                             Change Status
//                         </Button>
//                     </Title>
//                     <Title level={5}>
//                         Payment Method: {paymentDetails.paymentMethod}
//                     </Title>
//                     <Title level={5}>
//                         Total Price: ${paymentDetails.totalPrice.toFixed(2)}
//                     </Title>
//                     <Title level={5}>
//                         Shipping Cost: ${paymentDetails.shippingCost.toFixed(2)}
//                     </Title>
//                     <Title level={5}>
//                         Grand Total: ${paymentDetails.grandTotal.toFixed(2)}
//                     </Title>
//                 </Paragraph>
//             </Card>
//             <Card title="Tracking Info" style={{ marginBottom: '20px' }}>
//                 <Steps
//                     direction="vertical"
//                     current={trackingInfo.length - 1}
//                     progressDot
//                     style={{ marginBottom: '20px' }}
//                 >
//                     {transactionSteps}
//                 </Steps>
//             </Card>
//             <div style={{ flex: '1 1 35%' }}>
//                 <Card title="Buyer Details" style={{ marginBottom: '20px' }}>
//                     <Paragraph>
//                         <Title level={5}>Name: {buyer.name}</Title>
//                         <Title level={5}>
//                             Phone Number: {buyer.phoneNumber}
//                         </Title>
//                         <Title level={5}>Email: {buyer.email}</Title>
//                     </Paragraph>
//                 </Card>
//                 <Card title="Shipping Information">
//                     <Paragraph>
//                         <Title level={5}>Courier: {shippingInfo.courier}</Title>
//                         <Title level={5}>
//                             Tracking Number: {shippingInfo.trackingNumber}
//                         </Title>
//                         <Title level={5}>
//                             Shipping Address: {shippingInfo.shippingAddress}
//                         </Title>
//                         <Title level={5}>
//                             Billing Address: {shippingInfo.billingAddress}
//                         </Title>
//                     </Paragraph>
//                 </Card>
//             </div>
//         </div>
//     )
// }

// export default OrderDetails

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
} from '@ant-design/icons'
import { Button } from 'components/ui'

import { useNavigate } from 'react-router-dom'

const { Step } = Steps
const { Title, Paragraph, Text } = Typography

const OrderDetails = ({ orderId }) => {
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [transactionStatus, setTransactionStatus] = useState('')

    useEffect(() => {
        // Dummy data
        const dummyOrder = {
            products: [
                {
                    product: {
                        name: 'Product 1',
                        imageUrl: 'https://via.placeholder.com/50',
                    },
                    unitPrice: 19.99,
                    quantity: 2,
                    total: 39.98,
                },
                {
                    product: {
                        name: 'Product 2',
                        imageUrl: 'https://via.placeholder.com/50',
                    },
                    unitPrice: 29.99,
                    quantity: 1,
                    total: 29.99,
                },
            ],
            invoiceNumber: 'INV-123456',
            purchaseDate: '2023-05-09',
            buyer: {
                name: 'John Doe',
                phoneNumber: '+1 123 456 7890',
                email: 'john.doe@example.com',
            },
            paymentDetails: {
                paymentMethod: 'Credit Card',
                totalPrice: 69.97,
                shippingCost: 5.99,
                grandTotal: 75.96,
            },
            shippingInfo: {
                courier: 'FedEx',
                trackingNumber: '1234567890',
                shippingAddress: '123 Main St, Anytown USA',
                billingAddress: '123 Main St, Anytown USA',
            },
            trackingInfo: [
                {
                    date: '2023-05-09T10:00:00Z',
                    status: 'Shipped',
                    message: 'Order has been shipped',
                },
                {
                    date: '2023-05-10T14:00:00Z',
                    status: 'In Transit',
                    message: 'Package is in transit',
                },
                {
                    date: '2023-05-11T16:00:00Z',
                    status: 'Delivered',
                    message: 'Package has been delivered',
                },
            ],
            transactionStatus: 'Completed',
        }

        setOrder(dummyOrder)
        setTransactionStatus(dummyOrder.transactionStatus)
        setLoading(false)
    }, [])

    const handleTransactionStatusChange = async (newStatus) => {
        setTransactionStatus(newStatus)
    }

    const handleRefresh = () => {
        navigate('/sales/order-list')
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

    const {
        products,
        invoiceNumber,
        purchaseDate,
        buyer,
        paymentDetails,
        shippingInfo,
        trackingInfo,
    } = order

    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            render: (product) => (
                <div>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '50px', height: '50px' }}
                    />
                    {product.name}
                </div>
            ),
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            render: (unitPrice) => <span>${unitPrice.toFixed(2)}</span>,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            render: (total) => <span>${total.toFixed(2)}</span>,
        },
    ]

    const transactionSteps = trackingInfo.map(
        ({ date, status, message }, index) => (
            <Step
                key={index}
                title={new Date(date).toLocaleDateString()}
                description={message}
                status={
                    index === trackingInfo.length - 1 ? 'process' : 'finish'
                }
                icon={
                    <Tag
                        color={
                            status === 'Delivered'
                                ? 'green'
                                : status === 'In Transit'
                                ? 'blue'
                                : 'orange'
                        }
                    >
                        {status}
                    </Tag>
                }
            />
        )
    )

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 60%', marginRight: '20px' }}>
                {/* <Card
                    title="Order Details"
                    style={{ marginBottom: '20px' }}
                    headStyle={{
                        color: '#022B4E',
                    }}
                > */}
                <Table
                    dataSource={products}
                    style={{
                        marginBottom: '20px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '15px',
                    }}
                    columns={columns}
                    pagination={false}
                />
                {/* </Card> */}
                <Card
                    title={
                        <Space>
                            <CreditCardOutlined />
                            <Title
                                level={4}
                                style={{ margin: 0, color: '#022B4E' }}
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
                        color: '#022B4E',
                    }}
                >
                    <Paragraph>
                        <Space>
                            <ShoppingCartOutlined
                                style={{ fontSize: '16px' }}
                            />
                            <Text strong>Invoice: </Text>
                            <Text>{invoiceNumber}</Text>
                        </Space>
                    </Paragraph>
                    <Paragraph>
                        <Space>
                            <CalendarOutlined style={{ fontSize: '16px' }} />
                            <Text strong>Purchase Date: </Text>
                            <Text>{purchaseDate}</Text>
                        </Space>
                    </Paragraph>
                    <Paragraph>
                        <Space>
                            <SyncOutlined style={{ fontSize: '16px' }} />
                            <Text strong>Transaction Status: </Text>
                            <Text
                                style={{
                                    backgroundColor:
                                        transactionStatus === 'Completed'
                                            ? '#d9f7be'
                                            : '#ffcdd2',
                                    color:
                                        transactionStatus === 'Completed'
                                            ? '#52c41a'
                                            : '#cf1322',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                }}
                            >
                                {transactionStatus}
                            </Text>
                            <Button
                                varient="solid"
                                size="sm"
                                onClick={() =>
                                    handleTransactionStatusChange('Completed')
                                }
                            >
                                Change Status
                            </Button>
                        </Space>
                    </Paragraph>
                    <Paragraph>
                        <Space>
                            <CreditCardOutlined style={{ fontSize: '16px' }} />
                            <Text strong>Payment Method: </Text>
                            <Text>{paymentDetails.paymentMethod}</Text>
                        </Space>
                    </Paragraph>
                    <Paragraph>
                        <Space>
                            <ShoppingCartOutlined
                                style={{ fontSize: '16px' }}
                            />
                            <Text strong>Total Price: </Text>
                            <Text>${paymentDetails.totalPrice.toFixed(2)}</Text>
                        </Space>
                    </Paragraph>
                    <Paragraph>
                        <Space>
                            <TruckOutlined style={{ fontSize: '16px' }} />
                            <Text strong>Shipping Cost: </Text>
                            <Text>
                                ${paymentDetails.shippingCost.toFixed(2)}
                            </Text>
                        </Space>
                    </Paragraph>
                    <Paragraph>
                        <Space>
                            <ShoppingCartOutlined
                                style={{ fontSize: '16px' }}
                            />
                            <Text strong>Grand Total: </Text>
                            <Text>${paymentDetails.grandTotal.toFixed(2)}</Text>
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
                                style={{ margin: 0, color: '#022B4E' }}
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
                        color: '#022B4E',
                    }}
                >
                    <Paragraph>
                        <Space>
                            <UserOutlined style={{ fontSize: '16px' }} />
                            <Text strong>Name: </Text>
                            <Text>{buyer.name}</Text>
                        </Space>
                    </Paragraph>
                    <Paragraph>
                        <Space>
                            <PhoneOutlined style={{ fontSize: '16px' }} />
                            <Text strong>Phone Number: </Text>
                            <Text>{buyer.phoneNumber}</Text>
                        </Space>
                    </Paragraph>
                    <Paragraph>
                        <Space>
                            <MailOutlined style={{ fontSize: '16px' }} />
                            <Text strong>Email: </Text>
                            <Text>{buyer.email}</Text>
                        </Space>
                    </Paragraph>
                </Card>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '0 0 53px' }} />
                    {/* This will create a 71px space above the next element */}
                    <Card
                        title={
                            <Space>
                                <EnvironmentOutlined />
                                <Title
                                    level={4}
                                    style={{ margin: 0, color: '#022B4E' }}
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
                            color: '#022B4E',
                        }}
                    >
                        <Paragraph>
                            <Space>
                                <TruckOutlined style={{ fontSize: '16px' }} />
                                <Text strong>Courier: </Text>
                                <Text>{shippingInfo.courier}</Text>
                            </Space>
                        </Paragraph>
                        <Paragraph>
                            <Space>
                                <TruckOutlined style={{ fontSize: '16px' }} />
                                <Text strong>Tracking Number: </Text>
                                <Text>{shippingInfo.trackingNumber}</Text>
                            </Space>
                        </Paragraph>
                        <Paragraph>
                            <Space>
                                <EnvironmentOutlined
                                    style={{ fontSize: '16px' }}
                                />
                                <Text strong>Shipping Address: </Text>
                                <Text>{shippingInfo.shippingAddress}</Text>
                            </Space>
                        </Paragraph>
                        <Paragraph>
                            <Space>
                                <EnvironmentOutlined
                                    style={{ fontSize: '16px' }}
                                />
                                <Text strong>Billing Address: </Text>
                                <Text>{shippingInfo.billingAddress}</Text>
                            </Space>
                        </Paragraph>
                    </Card>
                </div>
            </div>
            <Card
                title={
                    <Space>
                        <TruckOutlined />
                        <Title
                            level={4}
                            style={{ margin: 0, color: '#022B4E' }}
                        >
                            Tracking Info
                        </Title>
                    </Space>
                }
                style={{
                    marginTop: '20px',
                    width: '100%',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                }}
                headStyle={{ color: '#022B4E' }}
            >
                <Steps
                    direction="vertical"
                    current={trackingInfo.length - 1}
                    progressDot
                    style={{ marginBottom: '20px' }}
                >
                    {transactionSteps}
                </Steps>
            </Card>
        </div>
    )

    // return (
    //     <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    //         <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
    //             <div style={{ flex: '1 1 60%', marginRight: '20px' }}>
    //                 <Card
    //                     title={
    //                         <Space>
    //                             <ShoppingCartOutlined />
    //                             <Title
    //                                 level={4}
    //                                 style={{ margin: 0, color: '#022B4E' }}
    //                             >
    //                                 Order Details
    //                             </Title>
    //                         </Space>
    //                     }
    //                     style={{
    //                         marginBottom: '20px',
    //                         boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    //                     }}
    //                     headStyle={{
    //                         color: '#022B4E',
    //                     }}
    //                 >
    //                     <Table
    //                         dataSource={products}
    //                         style={{
    //                             marginBottom: '20px',
    //                             borderRadius: '8px',
    //                         }}
    //                         columns={columns}
    //                         pagination={false}
    //                     />
    //                 </Card>
    //                 <Card
    //                     title={
    //                         <Space>
    //                             <UserOutlined />
    //                             <Title
    //                                 level={4}
    //                                 style={{ margin: 0, color: '#022B4E' }}
    //                             >
    //                                 Buyer Details
    //                             </Title>
    //                         </Space>
    //                     }
    //                     style={{
    //                         marginBottom: '20px',
    //                         boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    //                     }}
    //                     headStyle={{
    //                         color: '#022B4E',
    //                     }}
    //                 >
    //                     <Paragraph>
    //                         <Space>
    //                             <UserOutlined style={{ fontSize: '16px' }} />
    //                             <Text strong>Name: </Text>
    //                             <Text>{buyer.name}</Text>
    //                         </Space>
    //                     </Paragraph>
    //                     <Paragraph>
    //                         <Space>
    //                             <PhoneOutlined style={{ fontSize: '16px' }} />
    //                             <Text strong>Phone Number: </Text>
    //                             <Text>{buyer.phoneNumber}</Text>
    //                         </Space>
    //                     </Paragraph>
    //                     <Paragraph>
    //                         <Space>
    //                             <MailOutlined style={{ fontSize: '16px' }} />
    //                             <Text strong>Email: </Text>
    //                             <Text>{buyer.email}</Text>
    //                         </Space>
    //                     </Paragraph>
    //                 </Card>
    //             </div>
    //             <div style={{ flex: '1 1 35%' }}>
    //                 <Card
    //                     title={
    //                         <Space>
    //                             <CreditCardOutlined />
    //                             <Title
    //                                 level={4}
    //                                 style={{ margin: 0, color: '#022B4E' }}
    //                             >
    //                                 Payment Details
    //                             </Title>
    //                         </Space>
    //                     }
    //                     style={{
    //                         marginBottom: '20px',
    //                         boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    //                     }}
    //                     headStyle={{
    //                         color: '#022B4E',
    //                     }}
    //                 >
    //                     <Paragraph>
    //                         <Space>
    //                             <ShoppingCartOutlined
    //                                 style={{ fontSize: '16px' }}
    //                             />
    //                             <Text strong>Invoice: </Text>
    //                             <Text>{invoiceNumber}</Text>
    //                         </Space>
    //                     </Paragraph>
    //                     <Paragraph>
    //                         <Space>
    //                             <CalendarOutlined
    //                                 style={{ fontSize: '16px' }}
    //                             />
    //                             <Text strong>Purchase Date: </Text>
    //                             <Text>{purchaseDate}</Text>
    //                         </Space>
    //                     </Paragraph>
    //                     <Paragraph>
    //                         <Space>
    //                             <SyncOutlined style={{ fontSize: '16px' }} />
    //                             <Text strong>Transaction Status: </Text>
    //                             <Text
    //                                 style={{
    //                                     backgroundColor:
    //                                         transactionStatus === 'Completed'
    //                                             ? '#d9f7be'
    //                                             : '#ffcdd2',
    //                                     color:
    //                                         transactionStatus === 'Completed'
    //                                             ? '#52c41a'
    //                                             : '#cf1322',
    //                                     padding: '4px 8px',
    //                                     borderRadius: '4px',
    //                                 }}
    //                             >
    //                                 {transactionStatus}
    //                             </Text>
    //                             <Button
    //                                 varient="solid"
    //                                 size="sm"
    //                                 onClick={() =>
    //                                     handleTransactionStatusChange(
    //                                         'Completed'
    //                                     )
    //                                 }
    //                             >
    //                                 Change Status
    //                             </Button>
    //                         </Space>
    //                     </Paragraph>
    //                     <Paragraph>
    //                         <Space>
    //                             <CreditCardOutlined
    //                                 style={{ fontSize: '16px' }}
    //                             />
    //                             <Text strong>Payment Method: </Text>
    //                             <Text>{paymentDetails.paymentMethod}</Text>
    //                         </Space>
    //                     </Paragraph>
    //                     <Paragraph>
    //                         <Space>
    //                             <ShoppingCartOutlined
    //                                 style={{ fontSize: '16px' }}
    //                             />
    //                             <Text strong>Total Price: </Text>
    //                             <Text>
    //                                 ${paymentDetails.totalPrice.toFixed(2)}
    //                             </Text>
    //                         </Space>
    //                     </Paragraph>
    //                     <Paragraph>
    //                         <Space>
    //                             <TruckOutlined style={{ fontSize: '16px' }} />
    //                             <Text strong>Shipping Cost: </Text>
    //                             <Text>
    //                                 ${paymentDetails.shippingCost.toFixed(2)}
    //                             </Text>
    //                         </Space>
    //                     </Paragraph>
    //                     <Paragraph>
    //                         <Space>
    //                             <ShoppingCartOutlined
    //                                 style={{ fontSize: '16px' }}
    //                             />
    //                             <Text strong>Grand Total: </Text>
    //                             <Text>
    //                                 ${paymentDetails.grandTotal.toFixed(2)}
    //                             </Text>
    //                         </Space>
    //                     </Paragraph>
    //                 </Card>
    //                 <Card
    //                     title={
    //                         <Space>
    //                             <EnvironmentOutlined />
    //                             <Title
    //                                 level={4}
    //                                 style={{ margin: 0, color: '#022B4E' }}
    //                             >
    //                                 Shipping Information
    //                             </Title>
    //                         </Space>
    //                     }
    //                     style={{
    //                         marginBottom: '20px',
    //                         boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    //                     }}
    //                     headStyle={{
    //                         color: '#022B4E',
    //                     }}
    //                 >
    //                     <Paragraph>
    //                         <Space>
    //                             <TruckOutlined style={{ fontSize: '16px' }} />
    //                             <Text strong>Courier: </Text>
    //                             <Text>{shippingInfo.courier}</Text>
    //                         </Space>
    //                     </Paragraph>
    //                     <Paragraph>
    //                         <Space>
    //                             <TruckOutlined style={{ fontSize: '16px' }} />
    //                             <Text strong>Tracking Number: </Text>
    //                             <Text>{shippingInfo.trackingNumber}</Text>
    //                         </Space>
    //                     </Paragraph>
    //                     <Paragraph>
    //                         <Space>
    //                             <EnvironmentOutlined
    //                                 style={{ fontSize: '16px' }}
    //                             />
    //                             <Text strong>Shipping Address: </Text>
    //                             <Text>{shippingInfo.shippingAddress}</Text>
    //                         </Space>
    //                     </Paragraph>
    //                     <Paragraph>
    //                         <Space>
    //                             <EnvironmentOutlined
    //                                 style={{ fontSize: '16px' }}
    //                             />
    //                             <Text strong>Billing Address: </Text>
    //                             <Text>{shippingInfo.billingAddress}</Text>
    //                         </Space>
    //                     </Paragraph>
    //                 </Card>
    //             </div>
    //         </div>
    //         <Card
    //             title={
    //                 <Space>
    //                     <TruckOutlined />
    //                     <Title
    //                         level={4}
    //                         style={{ margin: 0, color: '#022B4E' }}
    //                     >
    //                         Tracking Info
    //                     </Title>
    //                 </Space>
    //             }
    //             style={{
    //                 marginTop: '20px',
    //                 width: '100%',
    //                 boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    //             }}
    //             headStyle={{ color: '#022B4E' }}
    //         >
    //             <Steps
    //                 direction="vertical"
    //                 current={trackingInfo.length - 1}
    //                 progressDot
    //                 style={{ marginBottom: '20px' }}
    //             >
    //                 {transactionSteps}
    //             </Steps>
    //         </Card>
    //         <Button
    //             style={{ marginTop: '18px' }}
    //             varient="solid"
    //             size="sm"
    //             onClick={handleRefresh}
    //         >
    //             Back to Order List
    //         </Button>
    //     </div>
    // )
}

export default OrderDetails
