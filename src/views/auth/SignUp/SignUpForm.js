import React, { useState } from 'react'
import { Input, Button, FormItem, FormContainer, Alert } from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from 'utils/hooks/useAuth'
import { Modal } from 'antd'
import Select from 'react-select'
import './style.css'

const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('Please enter your first name'),
    last_name: Yup.string().required('Please enter your last name'),
    phoneno: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phno. must be 10 digits')
        .required('Phone no. is required'),
    company_name: Yup.string().required('Please enter your company name'),
    state: Yup.string().required('Select your state'),
    gstno: Yup.string().matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Valid GST format (e.g., 06BZAHM6385P6Z2)'
    ),
    address: Yup.string().required('Please enter your address'),
    email: Yup.string()
        .email('Valid email format (e.g., abc12@gmail.com)')
        .required('Please enter your email'),
    password: Yup.string()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Valid password format (e.g., Abcd@1234)'
        )
        .required('Please enter your password'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Your passwords do not match'
    ),
})

const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
]

const SignUpForm = (props) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)

    const { signUp } = useAuth()

    const [message, setMessage] = useTimeOutMessage()
    const handleCloseDialog = () => {
        setShowSuccessDialog(false)
    }
    const onSignUp = async (values, setSubmitting) => {
        const {
            first_name,
            last_name,
            phoneno,
            company_name,
            state,
            gstno,
            address,
            password,
            email,
        } = values
        setSubmitting(true)
        try {
            const result = await signUp({
                first_name,
                last_name,
                phoneno,
                company_name,
                state,
                gstno,
                address,
                password,
                email,
            })

            if (result.status === 'success') {
                setShowSuccessDialog(true)
            } else {
                setMessage(result.message)
            }
        } catch (error) {
            setMessage('An error occurred : ' + error.message)
        }
        setSubmitting(false)
    }

    return (
        <div className={`p-4 ${className}`}>
            {message && (
                <Alert className="mb-4" type="danger" showIcon>
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    first_name: '',
                    last_name: '',
                    phoneno: '',
                    company_name: '',
                    state: '',
                    gstno: '',
                    address: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignUp(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting, setFieldValue, values }) => (
                    <Form>
                        <FormContainer>
                            <div className="flex">
                                <FormItem
                                    className="w-1/2 mr-4"
                                    label="First Name"
                                    invalid={
                                        errors.first_name && touched.first_name
                                    }
                                    errorMessage={errors.first_name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="first_name"
                                        placeholder="First Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    className="w-1/2"
                                    label="Last Name"
                                    invalid={
                                        errors.last_name && touched.last_name
                                    }
                                    errorMessage={errors.last_name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="last_name"
                                        placeholder="Last Name"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <div className="flex">
                                <FormItem
                                    className="w-1/4 mr-4"
                                    label="Phone Number"
                                    invalid={errors.phoneno && touched.phoneno}
                                    errorMessage={errors.phoneno}
                                >
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        name="phoneno"
                                        maxLength="10"
                                        placeholder="Phone Number"
                                        value={values.phoneno}
                                        onChange={(e) => {
                                            const re = /^[0-9\b]+$/
                                            if (
                                                e.target.value === '' ||
                                                re.test(e.target.value)
                                            ) {
                                                setFieldValue(
                                                    'phoneno',
                                                    e.target.value
                                                )
                                            }
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    className="w-1/2 mr-4"
                                    label="Company Name"
                                    invalid={
                                        errors.company_name &&
                                        touched.company_name
                                    }
                                    errorMessage={errors.company_name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="company_name"
                                        placeholder="Company Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    className="w-1/4"
                                    label="State"
                                    invalid={errors.state && touched.state}
                                    errorMessage={errors.state}
                                >
                                    <Field
                                        as="select"
                                        name="State"
                                        className={`select-wrapper ${
                                            errors.state && touched.state
                                                ? 'border-red-500'
                                                : 'border'
                                        }`}
                                        onChange={(e) =>
                                            setFieldValue(
                                                'state',
                                                e.target.value
                                            )
                                        }
                                    >
                                        <Select options={indianStates} />
                                        <option value="">Select State</option>
                                        {indianStates.map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </Field>
                                </FormItem>
                            </div>

                            <FormItem
                                className="w-1/2"
                                label="GST Number"
                                invalid={errors.gstno && touched.gstno}
                                errorMessage={errors.gstno}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="gstno"
                                    maxLength="15"
                                    placeholder="GST Number (e.g., 06BZAHM6385P6Z2)"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                className="mt-4"
                                label="address"
                                invalid={errors.address && touched.address}
                                errorMessage={errors.address}
                            >
                                <Field
                                    as="textarea"
                                    name="address"
                                    placeholder="address"
                                    rows={3}
                                    className={`resize-none w-full ${
                                        errors.address && touched.address
                                            ? 'border-red-500'
                                            : 'border'
                                    }`}
                                />
                            </FormItem>

                            <FormItem
                                label="Email"
                                className="mr-40"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="xyz@gmail.com"
                                    component={Input}
                                />
                            </FormItem>
                            <div className="flex">
                                <FormItem
                                    label="Password"
                                    className="w-1/2 mr-4"
                                    invalid={
                                        errors.password && touched.password
                                    }
                                    errorMessage={errors.password}
                                >
                                    <Field
                                        autoComplete="off"
                                        name="password"
                                        placeholder="Password (e.g., Abcd@1234)"
                                        component={PasswordInput}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Confirm Password"
                                    className="w-1/2"
                                    invalid={
                                        errors.confirmPassword &&
                                        touched.confirmPassword
                                    }
                                    errorMessage={errors.confirmPassword}
                                >
                                    <Field
                                        autoComplete="off"
                                        name="confirmPassword"
                                        placeholder="Confirm Password (e.g., Abcd@1234)"
                                        component={PasswordInput}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting
                                    ? 'Creating Account...'
                                    : 'Sign Up'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Already have an account? </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
            <Modal
                title={<h4>Thank you for registering!</h4>}
                centered
                open={showSuccessDialog}
                onCancel={handleCloseDialog}
                footer={[
                    <Button
                        style={{ backgroundColor: 'blue', color: 'white' }}
                        key="ok"
                        onClick={handleCloseDialog}
                    >
                        OK
                    </Button>,
                ]}
            >
                <p>Your registration was successful!</p>
                <br />
                <p>
                    Once your registration is approved by the admin, you will
                    receive an email with your login credentials and further
                    instructions on how to access the dashboard. Please check
                    your email regularly. Thank you!
                </p>
            </Modal>
        </div>
    )
}

export default SignUpForm
