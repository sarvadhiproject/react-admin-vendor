import React from 'react'
import { AUTH_PREFIX_PATH } from 'constants/route.constant'
import { ADMIN, USER } from 'constants/roles.constant'

const authDemoRoute = [
    {
        key: 'authentication.signInSimple',
        path: `${AUTH_PREFIX_PATH}/sign-in-simple`,
        component: React.lazy(() =>
            import('views/auth-demo/SignIn/SignInSimple')
        ),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signInSide',
        path: `${AUTH_PREFIX_PATH}/sign-in-side`,
        component: React.lazy(() =>
            import('views/auth-demo/SignIn/SignInSide')
        ),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signInCover',
        path: `${AUTH_PREFIX_PATH}/sign-in-cover`,
        component: React.lazy(() =>
            import('views/auth-demo/SignIn/SignInCover')
        ),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signUpSimple',
        path: `${AUTH_PREFIX_PATH}/sign-up-simple`,
        component: React.lazy(() =>
            import('views/auth-demo/SignUp/SignUpSimple')
        ),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signUpSide',
        path: `${AUTH_PREFIX_PATH}/sign-up-side`,
        component: React.lazy(() =>
            import('views/auth-demo/SignUp/SignUpSide')
        ),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signUpCover',
        path: `${AUTH_PREFIX_PATH}/sign-up-cover`,
        component: React.lazy(() =>
            import('views/auth-demo/SignUp/SignUpCover')
        ),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
]

export default authDemoRoute
