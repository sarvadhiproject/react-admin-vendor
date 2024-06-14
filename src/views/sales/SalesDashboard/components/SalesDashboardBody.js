import { APP_PREFIX_PATH } from 'constants/route.constant'
import React, { useEffect, useState } from 'react'
import {
    FaShoppingCart,
    FaUsers,
    FaStore,
    FaBoxOpen,
    FaTags,
} from 'react-icons/fa'
import { LoadingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import axios from 'axios' // Import Axios
import appConfig from 'configs/app.config'
import { jwtDecode } from 'jwt-decode'
import { Notification, toast } from 'components/ui'
import { Spin } from 'antd'

const token = localStorage.getItem('admin')
const decodedToken = token ? jwtDecode(token) : {}
const authority = decodedToken?.authority
const vendorId = decodedToken?.id

const SalesDashboardBody = () => {
    const [counts, setCounts] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                setLoading(true)
                let response
                if (authority === 'admin') {
                    response = await axios.get(
                        `${appConfig.apiPrefix}/count/admin`
                    )
                } else if (authority === 'vendor') {
                    response = await axios.post(
                        `${appConfig.apiPrefix}/count/vendor`,
                        {
                            vendor_id: vendorId,
                        }
                    )
                }

                setCounts(response.data)
            } catch (error) {
                console.error('Error fetching counts:', error)
                toast.push(
                    <Notification
                        title={'Failed to fetch data'}
                        type="danger"
                        duration={2500}
                    >
                        {error.message} - Please try again later
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            } finally {
                setLoading(false)
            }
        }

        fetchCounts()
    }, [authority, vendorId])

    const renderCards = () => {
        const cardData =
            authority === 'admin'
                ? [
                      {
                          title: 'Total Orders',
                          count: counts.orders,
                          icon: <FaShoppingCart size={30} />,
                          bgColor: 'bg-blue-100',
                          textColor: 'text-blue-500',
                          to: `${APP_PREFIX_PATH}/sales/order-list`,
                      },
                      {
                          title: 'Total Customers',
                          count: counts.users,
                          icon: <FaUsers size={30} />,
                          bgColor: 'bg-green-100',
                          textColor: 'text-green-500',
                          to: `${APP_PREFIX_PATH}/sales/AllCustomers`,
                      },
                      {
                          title: 'Active Vendors',
                          count: counts.activeVendors,
                          icon: <FaStore size={30} />,
                          bgColor: 'bg-yellow-100',
                          textColor: 'text-yellow-500',
                          to: `${APP_PREFIX_PATH}/vendor-management/VendorManagement`,
                      },
                      {
                          title: 'Total Products',
                          count: counts.products,
                          icon: <FaBoxOpen size={30} />,
                          bgColor: 'bg-red-100',
                          textColor: 'text-red-500',
                          to: `${APP_PREFIX_PATH}/sales/All-products`,
                      },
                      {
                          title: 'Total Categories',
                          count: counts.categories,
                          icon: <FaTags size={30} />,
                          bgColor: 'bg-purple-100',
                          textColor: 'text-purple-500',
                          to: `${APP_PREFIX_PATH}/sales/category-list`,
                      },
                  ]
                : [
                      {
                          title: 'Total Products',
                          count: counts.totalProducts,
                          icon: <FaBoxOpen size={30} />,
                          bgColor: 'bg-red-100',
                          textColor: 'text-red-500',
                          to: `${APP_PREFIX_PATH}/product-management/ListJewellery`,
                      },
                      {
                          title: 'Total Coupons',
                          count: counts.totalCoupons,
                          icon: <FaTags size={30} />,
                          bgColor: 'bg-purple-100',
                          textColor: 'text-purple-500',
                          to: `${APP_PREFIX_PATH}/manage-coupons`,
                      },
                      {
                          title: 'Total Customers',
                          count: counts.totalUsers,
                          icon: <FaUsers size={30} />,
                          bgColor: 'bg-green-100',
                          textColor: 'text-green-500',
                          to: `${APP_PREFIX_PATH}/vendor-customers`,
                      },
                      {
                          title: 'Total Orders',
                          count: counts.totalOrders,
                          icon: <FaShoppingCart size={30} />,
                          bgColor: 'bg-blue-100',
                          textColor: 'text-blue-500',
                          to: `${APP_PREFIX_PATH}/vendor-orders/OrderManagement`,
                      },
                  ]

        return cardData.map((card, index) => (
            <Link key={index} to={card?.to}>
                <Card
                    title={card.title}
                    count={card.count}
                    icon={card.icon}
                    bgColor={card.bgColor}
                    textColor={card.textColor}
                />
            </Link>
        ))
    }

    return (
        <div className="p-4">
            {loading ? (
                <div className="flex justify-center items-center">
                    <Spin
                        indicator={
                            <LoadingOutlined
                                style={{ fontSize: 28, color: '#832729' }}
                                spin
                            />
                        }
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {renderCards()}
                </div>
            )}
        </div>
    )
}

const Card = ({ title, count, icon, bgColor, textColor }) => (
    <div
        className={`flex items-center p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${bgColor}`}
    >
        <div className={`p-3 rounded-full ${textColor}`}>{icon}</div>
        <div className="ml-4">
            <div className="text-xl font-semibold">{title}</div>
            <div className="text-2xl font-bold">{count}</div>
        </div>
    </div>
)


export default SalesDashboardBody
