import React from 'react'
import { ADMIN, USER } from 'constants/roles.constant'

const pagesRoute = [
    {
        key: 'pages.accessDenied',
        path: '/access-denied',
        component: React.lazy(() => import('views/pages/AccessDenied')),
        authority: [ADMIN, USER],
    },
]

export default pagesRoute
