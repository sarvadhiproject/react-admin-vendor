// import React, { useEffect } from 'react'

// const SalesDashboardBody = () => {
//     return (
//         <div>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"></div>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"></div>
//         </div>
//     )
// }

// export default SalesDashboardBody

import Cookies from 'js-cookie'
import React from 'react'
import {
    FaShoppingCart,
    FaUsers,
    FaStore,
    FaBoxOpen,
    FaTags,
} from 'react-icons/fa'
import { jwtDecode } from 'jwt-decode'

const token = localStorage.getItem('admin')
const decodedToken = jwtDecode(token)
const authority = decodedToken.authority

const SalesDashboardBody = () => {
    const totalCategories = Cookies.get('totalCategories')
    const totalProducts = Cookies.get('totalProducts')
    const totalOrders = Cookies.get('totalOrders')
    const totalActiveVendors = Cookies.get('totalActiveVendors')
    const totalCustomers = Cookies.get('totalCustomers')

    const totalVendorProducts = Cookies.get('totalVendorProducts')
    const totalVendorOrders = Cookies.get('totalVendorOrders')
    const totalVendorCustomers = Cookies.get('totalVendorCustomers')
    const totalVendorCoupons = Cookies.get('totalVendorCoupons')
    const renderCards = () => {
        if (authority === 'admin') {
            return (
                <>
                    <Card
                        title="Total Orders"
                        count={totalOrders}
                        icon={<FaShoppingCart size={30} />}
                        bgColor="bg-blue-100"
                        textColor="text-blue-500"
                    />
                    <Card
                        title="Total Customers"
                        count={totalCustomers}
                        icon={<FaUsers size={30} />}
                        bgColor="bg-green-100"
                        textColor="text-green-500"
                    />
                    <Card
                        title="Active Vendors"
                        count={totalActiveVendors}
                        icon={<FaStore size={30} />}
                        bgColor="bg-yellow-100"
                        textColor="text-yellow-500"
                    />
                    <Card
                        title="Total Products"
                        count={totalProducts}
                        icon={<FaBoxOpen size={30} />}
                        bgColor="bg-red-100"
                        textColor="text-red-500"
                    />
                    <Card
                        title="Total Categories"
                        count={totalCategories}
                        icon={<FaTags size={30} />}
                        bgColor="bg-purple-100"
                        textColor="text-purple-500"
                    />
                </>
            )
        } else if (authority === 'vendor') {
            return (
                <>
                    <Card
                        title="Total Products"
                        count={totalVendorProducts}
                        icon={<FaBoxOpen size={30} />}
                        bgColor="bg-red-100"
                        textColor="text-red-500"
                    />
                    <Card
                        title="Total Coupons"
                        count={totalVendorCoupons}
                        icon={<FaTags size={30} />}
                        bgColor="bg-purple-100"
                        textColor="text-purple-500"
                    />
                    <Card
                        title="Total Customers"
                        count={totalVendorCustomers}
                        icon={<FaUsers size={30} />}
                        bgColor="bg-green-100"
                        textColor="text-green-500"
                    />
                    <Card
                        title="Total Orders"
                        count={totalVendorOrders}
                        icon={<FaShoppingCart size={30} />}
                        bgColor="bg-blue-100"
                        textColor="text-blue-500"
                    />
                </>
            )
        }
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {renderCards()}
            </div>
        </div>
    )
}

const Card = ({ title, count, icon, bgColor, textColor }) => {
    return (
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
}

export default SalesDashboardBody
