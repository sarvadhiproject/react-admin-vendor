import { useSelector, useDispatch } from 'react-redux'
import { setUser, initialState } from 'store/auth/userSlice'
import {
    apiSignIn,
    apiSignInAdmin,
    apiSignOut,
    apiSignUp,
} from 'services/AuthService'
import { onSignInSuccess, onSignOutSuccess } from 'store/auth/sessionSlice'
import appConfig from 'configs/app.config'
import { REDIRECT_URL_KEY } from 'constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import { ADMIN } from 'constants/roles.constant'
import { jwtDecode } from 'jwt-decode'

function useAuth() {
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const query = useQuery()

    const { token, signedIn } = useSelector((state) => state.auth.session)

    const signIn = async (values) => {
        try {
            const resp = await apiSignIn(values)

            if (resp.data) {
                // console.log(resp)
                const { token } = resp.data

                const decodedToken = jwtDecode(token)
                // console.log(decodedToken);
                const userName = decodedToken.first_name
                const email = decodedToken.email
                const authority = decodedToken.authority
                dispatch(onSignInSuccess(token))

                if (resp.data) {
                    dispatch(
                        setUser({
                            avatar: '',
                            userName,
                            email,
                            authority,
                        })
                    )
                }

                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }
    const signInAdmin = async (values) => {
        try {
            const resp = await apiSignInAdmin(values)

            if (resp.data) {
                // console.log(resp)
                const { token } = resp.data

                const decodedToken = jwtDecode(token)
                // console.log(decodedToken);
                const userName = decodedToken.first_name
                const email = decodedToken.email
                const authority = decodedToken.authority
                dispatch(onSignInSuccess(token))

                if (resp.data) {
                    dispatch(
                        setUser({
                            avatar: '',
                            userName,
                            email,
                            authority,
                        })
                    )
                }

                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    // const signUp = async (values) => {
    //     const resp = await apiSignUp(values)
    //     try {
    //         if (resp.data) {
    //             const { token } = resp.data
    //             dispatch(onSignInSuccess(token))
    //             // if (resp.data.user) {
    //             //     dispatch(
    //             //         setUser(
    //             //             resp.data.user || {
    //             //                 avatar: '',
    //             //                 userName: 'Anonymous',
    //             //                 authority: ['USER'],
    //             //                 email: '',
    //             //             }
    //             //         )
    //             //     )
    //             // }
    //             if (resp.data) {
    //                 dispatch(setUser({}))
    //             }
    //             const redirectUrl = query.get(REDIRECT_URL_KEY)
    //             // navigate(
    //             //     redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
    //             // )
    //             return {
    //                 status: 'success',
    //                 message: '',
    //             }
    //         }
    //     } catch (errors) {
    //         if (
    //             errors.response &&
    //             errors.response.data &&
    //             errors.response.data.message
    //         ) {
    //             // Handle the case where the server returns a JSON response with a message
    //             return {
    //                 status: 'failed',
    //                 message: errors.response.data.message,
    //             }
    //         } else {
    //             // Handle other error cases
    //             return {
    //                 status: 'failed',
    //                 message: errors.response.data.message,
    //             }
    //         }
    //     }
    // }
    const signUp = async (values) => {
        try {
            const resp = await apiSignUp(values)

            if (resp.status === 200 && resp.data) {
                const { token } = resp.data
                dispatch(onSignInSuccess(token))
                dispatch(setUser({}))

                return {
                    status: 'success',
                    message: '',
                }
            } else {
                // Handle other status codes
                return {
                    status: 'failed',
                    message: 'Request failed with status code: ' + resp.status,
                }
            }
        } catch (errors) {
            if (
                errors.response &&
                errors.response.data &&
                errors.response.data.message
            ) {
                // Handle the case where the server returns a JSON response with a message
                return {
                    status: 'failed',
                    message: errors.response.data.message,
                }
            } else {
                // Handle other error cases
                return { status: 'failed', message: errors.toString() }
            }
        }
    }

    const handleSignOut = () => {
        dispatch(onSignOutSuccess())
        dispatch(setUser(initialState))
        const decodedToken = jwtDecode(token)
        const authority = decodedToken.authority
        console.log(authority)
        if (authority === 'admin') {
            navigate(appConfig.unAuthenticatedAdminEntryPath)
        } else {
            navigate(appConfig.unAuthenticatedEntryPath)
        }
    }

    const signOut = async () => {
        // await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signInAdmin,
        signUp,
        signOut,
    }
}

export default useAuth
