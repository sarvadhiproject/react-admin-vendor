import authRoute from './authRoute'
import appsRoute from './appsRoute'
import uiComponentsRoute from './uiComponentsRoute'
import pagesRoute from './pagesRoute'
import authDemoRoute from './authDemoRoute'

export const publicRoutes = [...authRoute]

export const protectedRoutes = [
    ...appsRoute,
    ...uiComponentsRoute,
    ...pagesRoute,
    ...authDemoRoute,
]
