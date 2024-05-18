import React, { useState, useEffect } from 'react'
import { Input, Button, FormItem, FormContainer, Alert } from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from 'utils/hooks/useAuth'
import { Modal } from 'antd'
import Select from 'react-select'
import './style.css'
import axios from 'axios'
import appConfig from 'configs/app.config'
import { useFormikContext } from 'formik'

const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    phone_no: Yup.string()
        .matches(/^[6789]\d{9}$/, 'Invalid phone number')
        .required('Phone no. is required'),
    company_name: Yup.string().required('Company name is required'),
    state_id: Yup.string().required('Select state'),
    city_id: Yup.string().required('Select city'),
    gstno: Yup.string().matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Valid GST format (e.g., 06BZAHM6385P6Z2)'
    ),
    address: Yup.string().required('Please enter your address'),
    email: Yup.string()
        .email('Valid email format (e.g., abc12@gmail.com)')
        .required('Please enter your email'),
    // password: Yup.string()
    //     .matches(
    //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //         'Valid password format (e.g., Abcd@1234)'
    //     )
    //     .required('Please enter your password'),
    // confirmPassword: Yup.string().oneOf(
    //     [Yup.ref('password'), null],
    //     'Your passwords do not match'
    // ),
})

const SignUpForm = (props) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [selectedState, setSelectedState] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])

    const { signUp } = useAuth()

    const [message, setMessage] = useTimeOutMessage()

    useEffect(() => {
        fetchStates()
    }, [])
    const fetchStates = async () => {
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/location/states`
            )
            setStateList(response.data)
        } catch (error) {
            console.error('Error fetching states:', error)
        }
    }

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption)
        setSelectedCity(null)
        const stateId = selectedOption.state_id
        fetchCities(stateId)
    }

    const fetchCities = async (stateId) => {
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/location/cities/${stateId}`
            )
            console.log(response.data)
            setCityList(response.data)
        } catch (error) {
            console.error('Error fetching cities:', error)
        }
    }

    const handleCloseDialog = () => {
        setShowSuccessDialog(false)
        window.location.href = 'http://192.168.2.103:3000/'
    }
    const onSignUp = async (values, setSubmitting) => {
        const {
            first_name,
            last_name,
            phone_no,
            company_name,
            state_id,
            city_id,
            gstno,
            address,
            // password,
            email,
        } = values
        setSubmitting(true)
        try {
            const result = await signUp({
                first_name,
                last_name,
                phone_no,
                company_name,
                state_id,
                city_id,
                gstno,
                address,
                // password,
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
                    phone_no: '',
                    company_name: '',
                    state_id: '',
                    city_id: '',
                    gstno: '',
                    address: '',
                    email: '',
                    // password: '',
                    // confirmPassword: '',
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
                                    className="w-2/3 mr-4"
                                    label="Phone Number"
                                    invalid={
                                        errors.phone_no && touched.phone_no
                                    }
                                    errorMessage={errors.phone_no}
                                >
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        name="phone_no"
                                        maxLength="10"
                                        placeholder="Phone Number"
                                        value={values.phone_no}
                                        onChange={(e) => {
                                            const re = /^[0-9\b]+$/
                                            if (
                                                e.target.value === '' ||
                                                re.test(e.target.value)
                                            ) {
                                                setFieldValue(
                                                    'phone_no',
                                                    e.target.value
                                                )
                                            }
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    className="w-2/3 mr-4"
                                    label="State"
                                    invalid={
                                        errors.state_id && touched.state_id
                                    }
                                    errorMessage={errors.state_id}
                                >
                                    <Field
                                        as="select"
                                        name="State"
                                        className={`select-wrapper ${
                                            errors.state_id && touched.state_id
                                                ? 'border-red-500'
                                                : 'border'
                                        }`}
                                        onChange={(e) => {
                                            setFieldValue(
                                                'state_id',
                                                e.target.value
                                            )
                                            const selectedState =
                                                stateList.find(
                                                    (state) =>
                                                        state.state_id ===
                                                        parseInt(e.target.value)
                                                )
                                            handleStateChange(selectedState)
                                        }}
                                    >
                                        <Select options={stateList} />
                                        <option value="">Select State</option>
                                        {stateList.map((state) => (
                                            <option
                                                key={state.state_id}
                                                value={state.state_id}
                                            >
                                                {state.state_name}
                                            </option>
                                        ))}
                                    </Field>
                                </FormItem>
                                <FormItem
                                    className="w-1/6"
                                    label="City"
                                    invalid={errors.city_id && touched.city_id}
                                    errorMessage={errors.city_id}
                                >
                                    <Field
                                        as="select"
                                        name="City"
                                        className={`select-wrapper ${
                                            errors.city_id && touched.city_id
                                                ? 'border-red-500'
                                                : 'border'
                                        }`}
                                        onChange={(e) =>
                                            setFieldValue(
                                                'city_id',
                                                e.target.value
                                            )
                                        }
                                    >
                                        <Select options={cityList} />
                                        <option value="">Select City</option>
                                        {cityList.map((city) => (
                                            <option
                                                key={city.city_id}
                                                value={city.city_id}
                                            >
                                                {city.city_name}
                                            </option>
                                        ))}
                                    </Field>
                                </FormItem>
                            </div>
                            <div className="flex">
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
                                        placeholder="GST No (e.g., 06BZAHM6385P6Z2)"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <FormItem
                                className="mt-4"
                                label="Address"
                                invalid={errors.address && touched.address}
                                errorMessage={errors.address}
                            >
                                <Field
                                    as="textarea"
                                    name="address"
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
                            {/* <div className="flex">
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
                            </div> */}
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
