import React, { useEffect, useMemo, useState } from 'react'
import { Table, Tooltip, Input, Button } from 'antd'
import {
    EyeOutlined,
    DeleteOutlined,
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
import { HiOutlineTrash, HiDownload } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { jwtDecode } from 'jwt-decode'

const token = localStorage.getItem('admin')
const decodedToken = jwtDecode(token)
var vendor_id = decodedToken.id
console.log(vendor_id)

const OrderManagement = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState('')
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
            try {
                setLoading(true)
                const response = await axios.get(
                    `${appConfig.apiPrefix}/order/vendors/${vendor_id}/orders`
                )
                const ordersData = response.data.map((order) => ({
                    order_id: order.order_id,
                    // orderItems: order.orderItems,
                    order_date: order.order_date,
                    customer_name: `${order.user.first_name} ${order.user.last_name}`,
                    // total_products: order.total_products,
                    status: order.status,
                    payment_method: 'N/A', // Replace with actual payment method
                    total_amount: order.orderItems.reduce(
                        (sum, item) => sum + parseFloat(item.total_price),
                        0
                    ),
                }))
                setData(ordersData)
            } catch (error) {
                console.error('Error fetching orders:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const indexStart = useMemo(() => {
        return (currentPage - 1) * pageSize
    }, [currentPage, pageSize])

    const handlePageSizeChange = (current, size) => {
        setPageSize(Number(size))
        setCurrentPage(1) // Reset to the first page when page size changes
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
        {
            title: 'Payment Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
            sorter: (a, b) => a.payment_method.localeCompare(b.payment_method),
            render: (text) => <span style={{ color: '#666' }}>Card</span>,
        },
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
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleDetailView(record)}
                        className="mr-4 hover:bg-blue-500 hover:text-white"
                        style={{ backgroundColor: '#022b4e', color: 'white' }}
                    >
                        View
                    </Button>
                </div>
            ),
        },
    ]

    const filteredData = data.filter(
        (order) =>
            order.order_id
                .toString()
                .replace('#', '')
                .toLowerCase()
                .includes(searchText.replace('#', '').toLowerCase().trim()) ||
            order.customer_name
                .toLowerCase()
                .includes(searchText.toLowerCase().trim())
    )

    return (
        <>
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Orders</h3>
                <div className="flex items-center">
                    <Button
                        icon={<HiDownload />}
                        className="mr-4"
                        style={{ height: '35px' }}
                    >
                        <CSVLink
                            data={data}
                            filename="orders.csv"
                            className="ant-btn ant-btn-primary"
                            style={{ marginRight: '1rem' }}
                        >
                            Export
                        </CSVLink>
                    </Button>
                    <Input.Search
                        placeholder="Search by order or customer"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 270 }}
                        size="large"
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                loading={{
                    spinning: loading,
                    indicator: (
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                    ),
                }}
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
                rowKey="order_id"
            />
        </>
    )
}

export default OrderManagement
