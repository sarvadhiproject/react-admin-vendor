import React, { useEffect, useMemo, useState } from 'react'
import { Table, Input, Button, Empty, Spin, Select } from 'antd'
import {
    EyeOutlined,
    ClockCircleOutlined,
    SyncOutlined,
    LoadingOutlined,
    ShoppingCartOutlined,
    DeliveredProcedureOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons'
import NumberFormat from 'react-number-format'
import moment from 'moment'
import axios from 'axios'
import appConfig from 'configs/app.config'
import { HiDownload } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { jwtDecode } from 'jwt-decode'
import { Notification, toast } from 'components/ui'

const { Option } = Select

const token = localStorage.getItem('admin')
const decodedToken = jwtDecode(token)
var vendor_id = decodedToken.id
// console.log(vendor_id)

const OrderManagement = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState('')
    const [statusFilter, setStatusFilter] = useState(null)
    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const handleDetailView = (record) => {
        navigate(
            `/app/vendor-orders/OrderManagement/OrderDetails/${record.order_id}`
        )
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(
                    `${appConfig.apiPrefix}/order/vendors/${vendor_id}/orders`
                )
                const ordersData = response?.data?.map((order) => ({
                    order_id: order.order_id,
                    order_date: order.order_date,
                    customer_name: `${order.user?.first_name} ${order.user?.last_name}`,
                    status: order.status,
                    payment_method: 'N/A', // Replace with actual payment method
                    total_amount: order.orderItems.reduce(
                        (sum, item) => sum + parseFloat(item.total_price),
                        0
                    ),
                }))
                setData(ordersData)
                // console.log(response.data.length)
            } catch (error) {
                // console.error('Error fetching orders:', error)
                toast.push(
                    <Notification
                        title="Failed to fetch orders"
                        type="danger"
                        duration={2500}
                    >
                        {error?.message} - Please try again later
                    </Notification>,
                    { placement: 'top-center' }
                )
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleGenerateInvoice = async (orderId) => {
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/invoice/${orderId}/${vendor_id}`,
                { responseType: 'blob' }
            )
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `invoice_${orderId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
        } catch (error) {
            console.error('Error generating invoice:', error)
            toast.push(
                <Notification
                    title="Failed to generate invoice"
                    type="danger"
                    duration={2500}
                >
                    {error?.message} - Please try again later
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    const indexStart = useMemo(() => {
        return (currentPage - 1) * pageSize
    }, [currentPage, pageSize])

    const handlePageSizeChange = (current, size) => {
        setPageSize(Number(size))
        setCurrentPage(1) // Reset to the first page when page size changes
    }

    const handleStatusChange = (value) => {
        setStatusFilter(value)
        setCurrentPage(1)
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'order_id',
            key: 'order_id',
            render: (text, record, index) => (
                <span style={{ color: '#666' }}>{indexStart + index + 1}</span>
            ),
        },
        {
            title: 'Order Id',
            dataIndex: 'order_id',
            key: 'order_id',
            render: (text) => (
                <Link
                    to={`/app/sales/order-details/${text}`}
                    onClick={(e) => {
                        e.preventDefault()
                        handleDetailView({ order_id: text })
                    }}
                    style={{ color: '#69B8FE' }}
                >
                    #{text}
                </Link>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'order_date',
            key: 'order_date',
            sorter: (a, b) => new Date(a.order_date) - new Date(b.order_date),
            render: (text) => (
                <div style={{ color: '#666' }}>
                    <span>{moment(text).format('DD/MM/YYYY')}</span>
                    <br />
                    <small>{moment(text).format('hh:mm A')}</small>
                </div>
            ),
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
            sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
            render: (text, record) => (
                <div style={{ color: '#666' }}>
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: 'Order Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status - b.status,
            render: (status) => {
                let color
                let icon
                let displayStatus

                switch (status) {
                    case 1:
                        displayStatus = 'Order Received'
                        color = 'orange'
                        icon = <ClockCircleOutlined />
                        break
                    case 2:
                        displayStatus = 'Processing'
                        color = 'blue'
                        icon = <SyncOutlined spin />
                        break
                    case 3:
                        displayStatus = 'Shipped'
                        color = 'purple'
                        icon = <ShoppingCartOutlined />
                        break
                    case 4:
                        displayStatus = 'Out for Delivery'
                        color = 'green'
                        icon = <DeliveredProcedureOutlined />
                        break
                    case 5:
                        displayStatus = 'Delivered'
                        color = '#00cc00'
                        icon = <DeliveredProcedureOutlined />
                        break
                    case 6:
                        displayStatus = 'Cancelled'
                        color = '#ff3333'
                        icon = <CloseCircleOutlined />
                        break
                    default:
                        displayStatus = 'Unknown'
                        color = 'default'
                        icon = null
                }

                return (
                    <span style={{ color, fontWeight: '500' }}>
                        {icon} {displayStatus}
                    </span>
                )
            },
        },
        // {
        //     title: 'Payment Method',
        //     dataIndex: 'payment_method',
        //     key: 'payment_method',
        //     sorter: (a, b) => a.payment_method.localeCompare(b.payment_method),
        //     render: (text) => <span style={{ color: '#666' }}>Card</span>,
        // },
        {
            title: 'Total',
            dataIndex: 'total_amount',
            key: 'total_amount',
            sorter: (a, b) => a - b,
            render: (total_amount) => (
                <NumberFormat
                    displayType="text"
                    value={(Math.round(total_amount * 100) / 100).toFixed(2)}
                    prefix={'₹'}
                    thousandSeparator={true}
                    renderText={(value) => (
                        <span style={{ color: '#666' }}>{value}</span>
                    )}
                />
            ),
        },
        {
            title: 'Invoice',
            key: 'invoice',
            render: (_, record) => (
                <button
                    style={{
                        border: 'none',
                        color: '#832729',
                        borderBottom: '1px solid #832729',
                        paddingBottom: '0px',
                        fontWeight: '600',
                    }}
                    onClick={(e) => {
                        e.preventDefault()
                        handleGenerateInvoice(record.order_id)
                    }}
                >
                    Invoice
                </button>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleDetailView(record)}
                        className="mr-4 hover:bg-blue-500 hover:text-white"
                        // style={{ backgroundColor: '#022b4e', color: 'white' }}
                        style={{ backgroundColor: '#832729', color: 'white' }}
                    >
                        View
                    </Button>
                </div>
            ),
        },
    ]

    const filteredData = data.filter((order) => {
        const matchesSearchText =
            order.order_id
                .toString()
                .replace('#', '')
                .toLowerCase()
                .includes(searchText.replace('#', '').toLowerCase().trim()) ||
            order.customer_name
                .toLowerCase()
                .includes(searchText.toLowerCase().trim())

        const matchesStatus = statusFilter
            ? order.status === statusFilter
            : true

        return matchesSearchText && matchesStatus
    })

    return (
        <>
            <div className="lg:flex items-center justify-between mb-4">
                {/* <h3 style={{ color: '#022B4E' }} className="mb-4 lg:mb-0">Orders</h3> */}
                <h3 style={{ color: '#832729' }} className="mb-4 lg:mb-0">
                    Orders
                </h3>
                <div className="flex items-center">
                    <Input.Search
                        placeholder="Search by order-id or customer"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ marginRight: '1rem' }}
                        size="large"
                    />
                    <Select
                        placeholder="Filter by status"
                        style={{ width: 200, marginRight: '1rem' }}
                        size="large"
                        onChange={handleStatusChange}
                        allowClear
                    >
                        <Option value={1}>Order Received</Option>
                        <Option value={2}>Processing</Option>
                        <Option value={3}>Shipped</Option>
                        <Option value={4}>Out for Delivery</Option>
                        <Option value={5}>Delivered</Option>
                    </Select>
                    <Button
                        icon={<HiDownload />}
                        className="mr-4"
                        style={{
                            height: '35px',
                            color: '#832729',
                            borderColor: '#832729',
                        }}
                    >
                        <CSVLink
                            data={data}
                            filename="orders.csv"
                            className="ant-btn ant-btn-primary"
                            style={{ marginRight: '1rem', color: '#832729' }}
                        >
                            Export
                        </CSVLink>
                    </Button>
                </div>
            </div>
            {loading ? (
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
            ) : filteredData.length > 0 ? (
                <Table
                    dataSource={filteredData}
                    style={{ overflowX: 'auto', overflowY: 'auto' }}
                    columns={columns}
                    rowKey="order_id"
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
            ) : searchText ? (
                <Empty
                    style={{ fontWeight: '350' }}
                    description={`No orders found for "${searchText}"`}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <Empty
                    style={{ fontWeight: '350' }}
                    description="No orders available"
                />
            )}
        </>
    )
}

export default OrderManagement
