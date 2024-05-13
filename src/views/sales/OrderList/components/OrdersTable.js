// import React, { useEffect, useCallback, useMemo, useRef } from 'react'
// import { Badge, Tooltip } from 'components/ui'
// import { DataTable } from 'components/shared'
// import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi'
// import NumberFormat from 'react-number-format'
// import { useDispatch, useSelector } from 'react-redux'
// import { getOrders, setTableData } from '../store/dataSlice'
// import {
//     setSelectedRows,
//     addRowItem,
//     removeRowItem,
//     setDeleteMode,
//     setSelectedRow,
// } from '../store/stateSlice'
// import useThemeClass from 'utils/hooks/useThemeClass'
// import { useNavigate } from 'react-router-dom'
// import cloneDeep from 'lodash/cloneDeep'
// import dayjs from 'dayjs'

// const orderStatusColor = {
//     0: {
//         label: 'Paid',
//         dotClass: 'bg-emerald-500',
//         textClass: 'text-emerald-500',
//     },
//     1: {
//         label: 'Pending',
//         dotClass: 'bg-amber-500',
//         textClass: 'text-amber-500',
//     },
//     2: { label: 'Failed', dotClass: 'bg-red-500', textClass: 'text-red-500' },
// }

// const PaymentMethodImage = ({ paymentMehod, className }) => {
//     switch (paymentMehod) {
//         case 'visa':
//             return (
//                 <img
//                     className={className}
//                     src="/img/others/img-8.png"
//                     alt={paymentMehod}
//                 />
//             )
//         case 'master':
//             return (
//                 <img
//                     className={className}
//                     src="/img/others/img-9.png"
//                     alt={paymentMehod}
//                 />
//             )
//         case 'paypal':
//             return (
//                 <img
//                     className={className}
//                     src="/img/others/img-10.png"
//                     alt={paymentMehod}
//                 />
//             )
//         default:
//             return <></>
//     }
// }

// const dummyData = [
//     {
//         id: 1,
//         date: 1682892000, // Unix timestamp
//         customer: 'John Doe',
//         status: 0,
//         paymentMehod: 'visa',
//         paymentIdendifier: '****1234',
//         totalAmount: 99.99,
//     },
//     {
//         id: 2,
//         date: 1682978400, // Unix timestamp
//         customer: 'Jane Smith',
//         status: 1,
//         paymentMehod: 'master',
//         paymentIdendifier: '****5678',
//         totalAmount: 149.99,
//     },
// ]

// const OrderColumn = ({ row }) => {
//     const { textTheme } = useThemeClass()
//     const navigate = useNavigate()

//     const onView = useCallback(() => {
//         navigate(`/app/sales/order-details/${row.id}`)
//     }, [navigate, row])

//     return (
//         <span
//             className={`cursor-pointer select-none font-semibold hover:${textTheme}`}
//             onClick={onView}
//         >
//             #{row.id}
//         </span>
//     )
// }

// const ActionColumn = ({ row }) => {
//     const dispatch = useDispatch()
//     const { textTheme } = useThemeClass()
//     const navigate = useNavigate()

//     const onDelete = () => {
//         dispatch(setDeleteMode('single'))
//         dispatch(setSelectedRow([row.id]))
//     }

//     const onView = useCallback(() => {
//         navigate(`/app/sales/order-details/${row.id}`)
//     }, [navigate, row])

//     return (
//         <div className="flex justify-end text-lg">
//             <Tooltip title="View">
//                 <span
//                     className={`cursor-pointer p-2 hover:${textTheme}`}
//                     onClick={onView}
//                 >
//                     <HiOutlineEye />
//                 </span>
//             </Tooltip>
//             <Tooltip title="Delete">
//                 <span
//                     className="cursor-pointer p-2 hover:text-red-500"
//                     onClick={onDelete}
//                 >
//                     <HiOutlineTrash />
//                 </span>
//             </Tooltip>
//         </div>
//     )
// }

// const OrdersTable = () => {
//     const tableRef = useRef(null)

//     const dispatch = useDispatch()

//     const { pageIndex, pageSize, sort, query, total } = useSelector(
//         (state) => state.salesOrderList.data.tableData
//     )
//     const loading = useSelector((state) => state.salesOrderList.data.loading)

//     // const data = useSelector((state) => state.salesOrderList.data.orderList)
//     const data = dummyData

//     const fetchData = useCallback(() => {
//         dispatch(getOrders({ pageIndex, pageSize, sort, query }))
//     }, [dispatch, pageIndex, pageSize, sort, query])

//     useEffect(() => {
//         dispatch(setSelectedRows([]))
//         fetchData()
//     }, [dispatch, fetchData, pageIndex, pageSize, sort])

//     useEffect(() => {
//         if (tableRef) {
//             tableRef.current?.resetSelected()
//         }
//     }, [data])

//     const tableData = useMemo(
//         () => ({ pageIndex, pageSize, sort, query, total }),
//         [pageIndex, pageSize, sort, query, total]
//     )

//     const columns = useMemo(
//         () => [
//             {
//                 header: 'Order',
//                 accessorKey: 'id',
//                 cell: (props) => <OrderColumn row={props.row.original} />,
//             },
//             {
//                 header: 'Date',
//                 accessorKey: 'date',
//                 cell: (props) => {
//                     const row = props.row.original
//                     return (
//                         <span>{dayjs.unix(row.date).format('DD/MM/YYYY')}</span>
//                     )
//                 },
//             },
//             {
//                 header: 'Customer',
//                 accessorKey: 'customer',
//             },
//             {
//                 header: 'Status',
//                 accessorKey: 'status',
//                 cell: (props) => {
//                     const { status } = props.row.original
//                     return (
//                         <div className="flex items-center">
//                             <Badge
//                                 className={orderStatusColor[status].dotClass}
//                             />
//                             <span
//                                 className={`ml-2 rtl:mr-2 capitalize font-semibold ${orderStatusColor[status].textClass}`}
//                             >
//                                 {orderStatusColor[status].label}
//                             </span>
//                         </div>
//                     )
//                 },
//             },
//             {
//                 header: 'Payment Method',
//                 accessorKey: 'paymentMehod',
//                 cell: (props) => {
//                     const { paymentMehod, paymentIdendifier } =
//                         props.row.original
//                     return (
//                         <span className="flex items-center">
//                             <PaymentMethodImage
//                                 className="max-h-[20px]"
//                                 paymentMehod={paymentMehod}
//                             />
//                             <span className="ltr:ml-2 rtl:mr-2">
//                                 {paymentIdendifier}
//                             </span>
//                         </span>
//                     )
//                 },
//             },
//             {
//                 header: 'Total',
//                 accessorKey: 'totalAmount',
//                 cell: (props) => {
//                     const { totalAmount } = props.row.original
//                     return (
//                         <NumberFormat
//                             displayType="text"
//                             value={(
//                                 Math.round(totalAmount * 100) / 100
//                             ).toFixed(2)}
//                             prefix={'$'}
//                             thousandSeparator={true}
//                         />
//                     )
//                 },
//             },
//             {
//                 header: '',
//                 id: 'action',
//                 cell: (props) => <ActionColumn row={props.row.original} />,
//             },
//         ],
//         []
//     )

//     const onPaginationChange = (page) => {
//         const newTableData = cloneDeep(tableData)
//         newTableData.pageIndex = page
//         dispatch(setTableData(newTableData))
//     }

//     const onSelectChange = (value) => {
//         const newTableData = cloneDeep(tableData)
//         newTableData.pageSize = Number(value)
//         newTableData.pageIndex = 1
//         dispatch(setTableData(newTableData))
//     }

//     const onSort = (sort) => {
//         const newTableData = cloneDeep(tableData)
//         newTableData.sort = sort
//         dispatch(setTableData(newTableData))
//     }

//     const onRowSelect = (checked, row) => {
//         if (checked) {
//             dispatch(addRowItem([row.id]))
//         } else {
//             dispatch(removeRowItem(row.id))
//         }
//     }

//     const onAllRowSelect = useCallback(
//         (checked, rows) => {
//             if (checked) {
//                 const originalRows = rows.map((row) => row.original)
//                 const selectedIds = []
//                 originalRows.forEach((row) => {
//                     selectedIds.push(row.id)
//                 })
//                 dispatch(setSelectedRows(selectedIds))
//             } else {
//                 dispatch(setSelectedRows([]))
//             }
//         },
//         [dispatch]
//     )

//     return (
//         <DataTable
//             ref={tableRef}
//             columns={columns}
//             data={data}
//             // loading={loading}
//             pagingData={tableData}
//             onPaginationChange={onPaginationChange}
//             onSelectChange={onSelectChange}
//             onSort={onSort}
//             onCheckBoxChange={onRowSelect}
//             onIndeterminateCheckBoxChange={onAllRowSelect}
//             selectable
//         />
//     )
// }

// export default OrdersTable

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

const OrdersTable = () => {
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
                const response = await axios.get(
                    `${appConfig.apiPrefix}/order-details`
                )
                const ordersData = response.data.map((order) => ({
                    ordertracking_id: order.ordertracking_id,
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
            dataIndex: 'ordertracking_id',
            key: 'ordertracking_id',
            sorter: (a, b) => a.ordertracking_id - b.ordertracking_id,
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
                    case 'Delivered':
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
            order.ordertracking_id.toString().includes(searchText) ||
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

export default OrdersTable
