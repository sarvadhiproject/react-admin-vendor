// import React from 'react'
// import SignInForm from 'views/auth/SignIn/SignInForm'
// import Simple from 'components/layout/AuthLayout/Simple'

// const SignInSimple = (props) => {
//     return (
//         <Simple
//             content={
//                 <div className="mb-4">
//                     <h3 className="mb-1">Welcome back!</h3>
//                     {/* <p>Please enter your credentials to sign in!</p> */}
//                     <p className="mb-10">
//                         Please enter your credentials to sign in!
//                     </p>
//                 </div>
//             }
//         >
//             <SignInForm
//                 disableSubmit={false}
//                 AdminLogin={true}
//                 // signUpUrl="/auth/sign-up-simple"
//                 //forgotPasswordUrl="/auth/forgot-password-simple"
//                 {...props}
//             />
//         </Simple>
//     )
// }

// export default SignInSimple


import React from 'react'
import {
    Input,
    Button,
    Checkbox,
    FormItem,
    FormContainer,
    Alert,
} from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from 'utils/hooks/useAuth'
import Simple from 'components/layout/AuthLayout/Simple'

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Valid email format (e.g., abc12@gmail.com)')
        .required('Please enter your email'),
    password: Yup.string()
        // .matches(
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        //     'Valid password format (e.g., Abcd@1234)'
        // )
        .required('Please enter your password'),
    // rememberMe: Yup.bool(),
})

const SignInSimple = (props) => {
    const { disableSubmit = false, className } = props

    const [message, setMessage] = useTimeOutMessage()

    const { signInAdmin } = useAuth()

    const onSignIn = async (values, setSubmitting) => {
        const { email, password } = values
        setSubmitting(true)

        const result = await signInAdmin({ email, password })

        if (result.status === 'failed') {
            setMessage(result.message)
        }

        setSubmitting(false)
    }

    return (
        <>
            <Simple
                content={
                    <div className="mb-4">
                        <h3 className="mb-1">Welcome back!</h3>
                        {/* <p>Please enter your credentials to sign in!</p> */}
                        <p className="mb-10">
                            Please enter your credentials to sign in!
                        </p>
                    </div>
                }
            >
                <div className={className}>
                    {message && (
                        <Alert className="mb-4" type="danger" showIcon>
                            {message}
                        </Alert>
                    )}
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            if (!disableSubmit) {
                                onSignIn(values, setSubmitting)
                            } else {
                                setSubmitting(false)
                            }
                        }}
                    >
                        {({ touched, errors, isSubmitting }) => (
                            <Form>
                                <FormContainer>
                                    <FormItem
                                        label="Email"
                                        invalid={errors.email && touched.email}
                                        errorMessage={errors.email}
                                    >
                                        <Field
                                            type="email"
                                            autoComplete="off"
                                            name="email"
                                            placeholder="Email"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Password"
                                        invalid={
                                            errors.password && touched.password
                                        }
                                        errorMessage={errors.password}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="password"
                                            placeholder="Password"
                                            component={PasswordInput}
                                        />
                                    </FormItem>

                                    <Button
                                        block
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? 'Signing in...'
                                            : 'Sign In'}
                                    </Button>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Simple>
        </>
    )
}

export default SignInSimple
