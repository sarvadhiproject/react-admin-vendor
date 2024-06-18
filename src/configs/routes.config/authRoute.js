import { ADMIN, VENDOR } from 'constants/roles.constant'
import React from 'react'

const authRoute = [
    {
        key: 'signIn',
        path: `/sign-in`,
        component: React.lazy(() => import('views/auth/SignIn')),
        authority: [ADMIN, VENDOR],
    },
    {
        key: 'authentication.signInSimple',
        path: `/admin-login`,
        component: React.lazy(() =>
            import('views/auth-demo/SignIn/SignInSimple')
        ),
        authority: [ADMIN],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'signUp',
        path: `/sign-up`,
        component: React.lazy(() => import('views/auth/SignUp')),
        authority: [ADMIN, VENDOR],
    },
]

export default authRoute
