import ApiService from './ApiService'

export async function apiSignIn(data) {
    return ApiService.fetchData({
        // url: '/auth/admin-login',
        url: '/auth/vendor-login',
        method: 'post',
        data,
    })
}
export async function apiSignInAdmin(data) {
    return ApiService.fetchData({
        url: '/auth/admin-login',
        // url: '/auth/vendor-login',
        method: 'post',
        data,
    })
}

export async function apiSignUp(data) {
    return ApiService.fetchData({
        url: '/vendor/register',
        method: 'post',
        data,
    })
}

export async function apiForgotPassword(data) {
    return ApiService.fetchData({
        url: '/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data) {
    return ApiService.fetchData({
        url: '/reset-password',
        method: 'post',
        data,
    })
}
