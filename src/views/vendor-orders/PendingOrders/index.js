import React, { useEffect, useState } from 'react'
import { Table, Tooltip, Input, Button } from 'antd'
import {
    EyeOutlined,
    InfoCircleTwoTone,
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
import { useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { jwtDecode } from 'jwt-decode'

const token = localStorage.getItem('admin')
const decodedToken = jwtDecode(token)
var vendor_id = decodedToken.id
console.log(vendor_id)
const PendingOrders = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState('')
    const navigate = useNavigate()

    const handleDetailView = (record) => {
        navigate(`/app/sales/order-details/${record.order_id}`)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                // const requestBody = {
                //     vendor_id: vendor_id,
                // }

                const response = await axios.get(
                    `${appConfig.apiPrefix}/pending-orders/${vendor_id}`
                )
                const ordersData = response.data.map((order) => ({
                    order_id: order.order_id,
                    order_date: order.order_date,
                    customer_name: order.customer_name,
                    total_products: order.total_products,
                    status: order.status,
                    payment_method: order.payment_method,
                    total_amount: order.total_amount,
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

    const columns = [
        {
            title: 'Order',
            dataIndex: 'order_id',
            key: 'order_id',
            sorter: (a, b) => a.order_id - b.order_id,
            render: (text) => <span style={{ color: '#666' }}>#{text}</span>,
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
                    <br />
                    <small
                        style={{
                            fontSize: '12px',
                            fontFamily: 'sans-serif',
                        }}
                    >
                        Products purchased: {record.total_products}
                    </small>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (text) => {
                const status = text.charAt(0).toUpperCase() + text.slice(1)
                let color
                let icon

                switch (status) {
                    case 'Pending':
                        color = 'orange'
                        icon = <ClockCircleOutlined />
                        break
                    case 'Processing':
                        color = 'blue'
                        icon = <SyncOutlined spin />
                        break
                    case 'Shipped':
                        color = 'purple'
                        icon = <ShoppingCartOutlined />
                        break
                    case 'Out of Delivery':
                        color = 'green'
                        icon = <DeliveredProcedureOutlined />
                        break
                    case 'Order placed':
                        color = '#00cc00'
                        icon = <DeliveredProcedureOutlined />
                        break
                    case 'Cancelled':
                        color = '#ff3333'
                        icon = <CloseCircleOutlined />
                        break
                    default:
                        color = 'default'
                        icon = null
                }

                return (
                    <span style={{ color, fontWeight: '500' }}>
                        {icon} {status}
                    </span>
                )
            },
        },
        {
            title: 'Payment Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
            sorter: (a, b) => a.payment_method.localeCompare(b.payment_method),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Total',
            dataIndex: 'total_amount',
            key: 'total_amount',
            sorter: (a, b) => a.total_amount - b.total_amount,
            render: (text) => (
                <NumberFormat
                    displayType="text"
                    value={(Math.round(text * 100) / 100).toFixed(2)}
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
                <div style={{ display: 'flex' }}>
                    <Tooltip title="View">
                        <InfoCircleTwoTone
                            onClick={() => handleDetailView(record)}
                            size={17}
                            style={{ marginRight: '20px', cursor: 'pointer' }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <HiOutlineTrash
                            size={17}
                            style={{ color: 'red', cursor: 'pointer' }}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ]

    const filteredData = data.filter(
        (order) =>
            order.order_id.toString().includes(searchText) ||
            order.customer_name.toLowerCase().includes(searchText.toLowerCase())
    )

    return (
        <>
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Orders</h3>
                <div className="flex items-center">
                    <Button icon={<HiDownload />} className="mr-4">
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
                rowKey="order_id"
            />
        </>
    )
}

export default PendingOrders
