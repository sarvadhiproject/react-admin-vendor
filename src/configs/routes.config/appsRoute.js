import React from 'react'
import { APP_PREFIX_PATH } from 'constants/route.constant'
import { ADMIN, USER, VENDOR } from 'constants/roles.constant'

const appsRoute = [
    {
        key: 'appsSales.dashboard',
        path: `${APP_PREFIX_PATH}/sales/dashboard`,
        component: React.lazy(() => import('views/sales/SalesDashboard')),
        authority: [ADMIN, USER, VENDOR],
    },
    {
        key: 'appsSales.categoryList',
        // path: `${APP_PREFIX_PATH}/sales/product-list`,
        path: `${APP_PREFIX_PATH}/sales/category-list`,
        component: React.lazy(() => import('views/sales/CategoryList')),
        authority: [ADMIN, USER],
    },
    // {
    //     key: 'appsSales.productEdit',
    //     path: `${APP_PREFIX_PATH}/sales/product-edit/:productId`,
    //     component: React.lazy(() => import('views/sales/ProductEdit')),
    //     authority: [ADMIN, USER],
    //     meta: {
    //         header: 'Edit Product',
    //     },
    // },
    {
        key: 'appsSales.productNew',
        path: `${APP_PREFIX_PATH}/sales/category-new`,
        component: React.lazy(() => import('views/sales/CategoryNew')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Add New Category',
        },
    },
    {
        key: 'appsSales.productList',
        path: `${APP_PREFIX_PATH}/sales/All-products`,
        component: React.lazy(() => import('views/sales/ListAllProducts')),
        authority: [ADMIN, USER],
    },
    {
        key: 'orderList',
        path: `${APP_PREFIX_PATH}/sales/order-list`,
        component: React.lazy(() => import('views/sales/OrderList')),
        authority: [ADMIN],
    },
    {
        key: 'appsSales.orderDetails',
        path: `${APP_PREFIX_PATH}/sales/order-details/:order_id`,
        component: React.lazy(() => import('views/sales/OrderDetails')),
        authority: [ADMIN, USER],
        // meta: {
        //     header: 'Order Details',
        // },
    },
    {
        key: 'appsAccount.settings',
        path: `${APP_PREFIX_PATH}/account/settings/:tab`,
        component: React.lazy(() => import('views/account/Settings')),
        authority: [USER, VENDOR, ADMIN],
        meta: {
            header: 'Settings',
            headerContainer: true,
        },
    },
    {
        key: 'appsAccount.invoice',
        path: `${APP_PREFIX_PATH}/account/invoice/:id`,
        component: React.lazy(() => import('views/account/Invoice')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAccount.activityLog',
        path: `${APP_PREFIX_PATH}/account/activity-log`,
        component: React.lazy(() => import('views/account/ActivityLog')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAccount.kycForm',
        path: `${APP_PREFIX_PATH}/account/kyc-form`,
        component: React.lazy(() => import('views/account/KycForm')),
        authority: [USER, VENDOR],
    },
    {
        key: 'apps.vendorManagement',
        path: `${APP_PREFIX_PATH}/vendor-management/VendorManagement`,
        component: React.lazy(() =>
            import('views/vendor-management/VendorManagement')
        ),
        authority: [ADMIN],
    },
    {
        key: 'apps.vendorOrderManagement',
        path: `${APP_PREFIX_PATH}/vendor-orders/OrderManagement`,
        component: React.lazy(() =>
            import('views/vendor-orders/OrderManagement')
        ),
        authority: [VENDOR],
    },
    {
        key: 'apps.vendorOrderManagement',
        path: `${APP_PREFIX_PATH}/vendor-orders/OrderManagement/OrderDetails/:order_id`,
        component: React.lazy(() =>
            import('views/vendor-orders/OrderManagement/OrderDetails')
        ),
        authority: [VENDOR],
    },
    // {
    //     key: 'vendorManagementActive',
    //     path: `${APP_PREFIX_PATH}/vendor-management/ActiveVendors`,
    //     component: React.lazy(() =>
    //         import('views/vendor-management/ActiveVendors')
    //     ),
    //     authority: [ADMIN],
    // },
    // {
    //     key: 'vendorManagementDeactivated',
    //     path: `${APP_PREFIX_PATH}/vendor-management/DeactivatedVendors`,
    //     component: React.lazy(() =>
    //         import('views/vendor-management/DeactivatedVendors')
    //     ),
    //     authority: [ADMIN],
    // },
    {
        key: 'apps.productAdd',
        path: `${APP_PREFIX_PATH}/product-management/AddJewellery`,
        component: React.lazy(() =>
            import('views/product-management/AddJewellery')
        ),
        authority: [VENDOR],
    },
    {
        key: 'apps.productList',
        path: `${APP_PREFIX_PATH}/product-management/ListJewellery`,
        component: React.lazy(() =>
            import('views/product-management/ListJewellery')
        ),
        authority: [VENDOR],
    },
]

export default appsRoute
