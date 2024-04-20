import { useSelector, useDispatch } from 'react-redux'
import { setUser, initialState } from 'store/auth/userSlice'
import { apiSignIn, apiSignOut, apiSignUp } from 'services/AuthService'
import { onSignInSuccess, onSignOutSuccess } from 'store/auth/sessionSlice'
import appConfig from 'configs/app.config'
import { REDIRECT_URL_KEY } from 'constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import { ADMIN } from 'constants/roles.constant'

function useAuth() {
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const query = useQuery()

    const { token, signedIn } = useSelector((state) => state.auth.session)

    const signIn = async (values) => {
        try {
            const resp = await apiSignIn(values)
            if (resp.data) {
                console.log(resp)
                const { token } = resp.data
                dispatch(onSignInSuccess(token))
                if (resp.data) {
                    dispatch(
                        setUser({
                            avatar: '',
                            userName: resp.data.firstName,
                            // email: resp.data.email,
                            email: values.email,
                            authority: [resp.data.role],
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

    const signUp = async (values) => {
        const resp = await apiSignUp(values)
        try {
            if (resp.data) {
                const { token } = resp.data
                dispatch(onSignInSuccess(token))
                // if (resp.data.user) {
                //     dispatch(
                //         setUser(
                //             resp.data.user || {
                //                 avatar: '',
                //                 userName: 'Anonymous',
                //                 authority: ['USER'],
                //                 email: '',
                //             }
                //         )
                //     )
                // }
                if (resp.data) {
                    dispatch(setUser({}))
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                // navigate(
                //     redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                // )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors) {
            return {
                status: 'failed',
                // message: errors?.response?.data?.message || errors.toString(),
                message: resp.data.message,
            }
        }
    }

    const handleSignOut = () => {
        dispatch(onSignOutSuccess())
        dispatch(setUser(initialState))
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        // await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth
