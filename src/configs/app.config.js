const appConfig = {
    // apiPrefix: 'http://192.168.29.15:4000',
    apiPrefix: 'http://localhost:4000',
    imgPrefix: 'https://res.cloudinary.com/dyjgvi4ma/image/upload',
    authenticatedEntryPath: '/app/sales/category-list',
    authenticatedEntryPathVendor: '/app/product-management/ListJewellery',
    unAuthenticatedEntryPath: '/sign-in',
    unAuthenticatedAdminEntryPath: '/admin-login',
    tourPath: '/app/account/kyc-form',
    locale: 'en',
    enableMock: true,
}

export default appConfig
