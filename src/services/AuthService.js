import ApiService from './ApiService'

export async function apiSignIn(data, AdminLogin) {
    if (AdminLogin) {
        // If AdminLogin prop is provided, use that API
        return ApiService.fetchData({
            url: '/admin-login',
            method: 'post',
            data,
        })
    } else {
        // If AdminLogin prop is not provided, use the default API
        return ApiService.fetchData({
            url: '/login',
            method: 'post',
            data,
        })
    }
}

export async function apiSignUp(data) {
    return ApiService.fetchData({
        url: '/add-vendor',
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
