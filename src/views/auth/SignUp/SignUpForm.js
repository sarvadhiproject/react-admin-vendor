// import React, { useState, useEffect } from 'react'
// import { Input, Button, FormItem, FormContainer, Alert } from 'components/ui'
// import { PasswordInput, ActionLink } from 'components/shared'
// import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
// import { Field, Form, Formik } from 'formik'
// import * as Yup from 'yup'
// import useAuth from 'utils/hooks/useAuth'
// import { Modal } from 'antd'
// import Select from 'react-select'
// import './style.css'
// import axios from 'axios'
// import appConfig from 'configs/app.config'
// import { useFormikContext } from 'formik'

// const validationSchema = Yup.object().shape({
//     first_name: Yup.string().required('First name is required'),
//     last_name: Yup.string().required('Last name is required'),
//     phone_no: Yup.string()
//         .matches(/^[6789]\d{9}$/, 'Invalid phone number')
//         .required('Phone no. is required'),
//     company_name: Yup.string().required('Company name is required'),
//     state_id: Yup.string().required('Select state'),
//     city_id: Yup.string().required('Select city'),
//     gstno: Yup.string().matches(
//         /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
//         'Valid GST format (e.g., 06BZAHM6385P6Z2)'
//     ),
//     address: Yup.string().required('Please enter your address'),
//     email: Yup.string()
//         .email('Valid email format (e.g., abc12@gmail.com)')
//         .required('Please enter your email'),
//     // password: Yup.string()
//     //     .matches(
//     //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//     //         'Valid password format (e.g., Abcd@1234)'
//     //     )
//     //     .required('Please enter your password'),
//     // confirmPassword: Yup.string().oneOf(
//     //     [Yup.ref('password'), null],
//     //     'Your passwords do not match'
//     // ),
// })

// const SignUpForm = (props) => {
//     const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
//     const [showSuccessDialog, setShowSuccessDialog] = useState(false)
//     const [selectedState, setSelectedState] = useState(null)
//     const [selectedCity, setSelectedCity] = useState(null)
//     const [stateList, setStateList] = useState([])
//     const [cityList, setCityList] = useState([])

//     const { signUp } = useAuth()

//     const [message, setMessage] = useTimeOutMessage()

//     useEffect(() => {
//         fetchStates()
//     }, [])
//     const fetchStates = async () => {
//         try {
//             const response = await axios.get(
//                 `${appConfig.apiPrefix}/location/states`
//             )
//             setStateList(response.data)
//         } catch (error) {
//             console.error('Error fetching states:', error)
//         }
//     }

//     const handleStateChange = (selectedOption) => {
//         setSelectedState(selectedOption)
//         setSelectedCity(null)
//         const stateId = selectedOption.state_id
//         fetchCities(stateId)
//     }

//     const fetchCities = async (stateId) => {
//         try {
//             const response = await axios.get(
//                 `${appConfig.apiPrefix}/location/cities/${stateId}`
//             )
//             console.log(response.data)
//             setCityList(response.data)
//         } catch (error) {
//             console.error('Error fetching cities:', error)
//         }
//     }

//     const handleCloseDialog = () => {
//         setShowSuccessDialog(false)
//         window.location.href = 'http://192.168.2.103:3000/'
//     }
//     const onSignUp = async (values, setSubmitting) => {
//         const {
//             first_name,
//             last_name,
//             phone_no,
//             company_name,
//             state_id,
//             city_id,
//             gstno,
//             address,
//             // password,
//             email,
//         } = values
//         setSubmitting(true)
//         try {
//             const result = await signUp({
//                 first_name,
//                 last_name,
//                 phone_no,
//                 company_name,
//                 state_id,
//                 city_id,
//                 gstno,
//                 address,
//                 // password,
//                 email,
//             })

//             if (result.status === 'success') {
//                 setShowSuccessDialog(true)
//             } else {
//                 setMessage(result.message)
//             }
//         } catch (error) {
//             setMessage('An error occurred : ' + error.message)
//         }
//         setSubmitting(false)
//     }

//     return (
//         <div className={`p-4 ${className}`}>
//             {message && (
//                 <Alert className="mb-4" type="danger" showIcon>
//                     {message}
//                 </Alert>
//             )}
//             <Formik
//                 initialValues={{
//                     first_name: '',
//                     last_name: '',
//                     phone_no: '',
//                     company_name: '',
//                     state_id: '',
//                     city_id: '',
//                     gstno: '',
//                     address: '',
//                     email: '',
//                     // password: '',
//                     // confirmPassword: '',
//                 }}
//                 validationSchema={validationSchema}
//                 onSubmit={(values, { setSubmitting }) => {
//                     if (!disableSubmit) {
//                         onSignUp(values, setSubmitting)
//                     } else {
//                         setSubmitting(false)
//                     }
//                 }}
//             >
//                 {({ touched, errors, isSubmitting, setFieldValue, values }) => (
//                     <Form>
//                         <FormContainer>
//                             <div className="flex">
//                                 <FormItem
//                                     className="w-1/2 mr-4"
//                                     label="First Name"
//                                     invalid={
//                                         errors.first_name && touched.first_name
//                                     }
//                                     errorMessage={errors.first_name}
//                                 >
//                                     <Field
//                                         type="text"
//                                         autoComplete="off"
//                                         name="first_name"
//                                         placeholder="First Name"
//                                         component={Input}
//                                     />
//                                 </FormItem>
//                                 <FormItem
//                                     className="w-1/2"
//                                     label="Last Name"
//                                     invalid={
//                                         errors.last_name && touched.last_name
//                                     }
//                                     errorMessage={errors.last_name}
//                                 >
//                                     <Field
//                                         type="text"
//                                         autoComplete="off"
//                                         name="last_name"
//                                         placeholder="Last Name"
//                                         component={Input}
//                                     />
//                                 </FormItem>
//                             </div>
//                             <div className="flex">
//                                 <FormItem
//                                     className="w-2/3 mr-4"
//                                     label="Phone Number"
//                                     invalid={
//                                         errors.phone_no && touched.phone_no
//                                     }
//                                     errorMessage={errors.phone_no}
//                                 >
//                                     <Input
//                                         type="text"
//                                         autoComplete="off"
//                                         name="phone_no"
//                                         maxLength="10"
//                                         placeholder="Phone Number"
//                                         value={values.phone_no}
//                                         onChange={(e) => {
//                                             const re = /^[0-9\b]+$/
//                                             if (
//                                                 e.target.value === '' ||
//                                                 re.test(e.target.value)
//                                             ) {
//                                                 setFieldValue(
//                                                     'phone_no',
//                                                     e.target.value
//                                                 )
//                                             }
//                                         }}
//                                     />
//                                 </FormItem>
//                                 <FormItem
//                                     className="w-2/3 mr-4"
//                                     label="State"
//                                     invalid={
//                                         errors.state_id && touched.state_id
//                                     }
//                                     errorMessage={errors.state_id}
//                                 >
//                                     <Field
//                                         as="select"
//                                         name="State"
//                                         className={`select-wrapper ${
//                                             errors.state_id && touched.state_id
//                                                 ? 'border-red-500'
//                                                 : 'border'
//                                         }`}
//                                         onChange={(e) => {
//                                             setFieldValue(
//                                                 'state_id',
//                                                 e.target.value
//                                             )
//                                             const selectedState =
//                                                 stateList.find(
//                                                     (state) =>
//                                                         state.state_id ===
//                                                         parseInt(e.target.value)
//                                                 )
//                                             handleStateChange(selectedState)
//                                         }}
//                                     >
//                                         <Select options={stateList} />
//                                         <option value="">Select State</option>
//                                         {stateList.map((state) => (
//                                             <option
//                                                 key={state.state_id}
//                                                 value={state.state_id}
//                                             >
//                                                 {state.state_name}
//                                             </option>
//                                         ))}
//                                     </Field>
//                                 </FormItem>
//                                 <FormItem
//                                     className="w-1/6"
//                                     label="City"
//                                     invalid={errors.city_id && touched.city_id}
//                                     errorMessage={errors.city_id}
//                                 >
//                                     <Field
//                                         as="select"
//                                         name="City"
//                                         className={`select-wrapper ${
//                                             errors.city_id && touched.city_id
//                                                 ? 'border-red-500'
//                                                 : 'border'
//                                         }`}
//                                         onChange={(e) =>
//                                             setFieldValue(
//                                                 'city_id',
//                                                 e.target.value
//                                             )
//                                         }
//                                     >
//                                         <Select options={cityList} />
//                                         <option value="">Select City</option>
//                                         {cityList.map((city) => (
//                                             <option
//                                                 key={city.city_id}
//                                                 value={city.city_id}
//                                             >
//                                                 {city.city_name}
//                                             </option>
//                                         ))}
//                                     </Field>
//                                 </FormItem>
//                             </div>
//                             <div className="flex">
//                                 <FormItem
//                                     className="w-1/2 mr-4"
//                                     label="Company Name"
//                                     invalid={
//                                         errors.company_name &&
//                                         touched.company_name
//                                     }
//                                     errorMessage={errors.company_name}
//                                 >
//                                     <Field
//                                         type="text"
//                                         autoComplete="off"
//                                         name="company_name"
//                                         placeholder="Company Name"
//                                         component={Input}
//                                     />
//                                 </FormItem>
//                                 <FormItem
//                                     className="w-1/2"
//                                     label="GST Number"
//                                     invalid={errors.gstno && touched.gstno}
//                                     errorMessage={errors.gstno}
//                                 >
//                                     <Field
//                                         type="text"
//                                         autoComplete="off"
//                                         name="gstno"
//                                         maxLength="15"
//                                         placeholder="GST No (e.g., 06BZAHM6385P6Z2)"
//                                         component={Input}
//                                     />
//                                 </FormItem>
//                             </div>
//                             <FormItem
//                                 className="mt-4"
//                                 label="Address"
//                                 invalid={errors.address && touched.address}
//                                 errorMessage={errors.address}
//                             >
//                                 <Field
//                                     as="textarea"
//                                     name="address"
//                                     rows={3}
//                                     className={`resize-none w-full ${
//                                         errors.address && touched.address
//                                             ? 'border-red-500'
//                                             : 'border'
//                                     }`}
//                                 />
//                             </FormItem>

//                             <FormItem
//                                 label="Email"
//                                 className="mr-40"
//                                 invalid={errors.email && touched.email}
//                                 errorMessage={errors.email}
//                             >
//                                 <Field
//                                     type="email"
//                                     autoComplete="off"
//                                     name="email"
//                                     placeholder="xyz@gmail.com"
//                                     component={Input}
//                                 />
//                             </FormItem>
//                             {/* <div className="flex">
//                                 <FormItem
//                                     label="Password"
//                                     className="w-1/2 mr-4"
//                                     invalid={
//                                         errors.password && touched.password
//                                     }
//                                     errorMessage={errors.password}
//                                 >
//                                     <Field
//                                         autoComplete="off"
//                                         name="password"
//                                         placeholder="Password (e.g., Abcd@1234)"
//                                         component={PasswordInput}
//                                     />
//                                 </FormItem>

//                                 <FormItem
//                                     label="Confirm Password"
//                                     className="w-1/2"
//                                     invalid={
//                                         errors.confirmPassword &&
//                                         touched.confirmPassword
//                                     }
//                                     errorMessage={errors.confirmPassword}
//                                 >
//                                     <Field
//                                         autoComplete="off"
//                                         name="confirmPassword"
//                                         placeholder="Confirm Password (e.g., Abcd@1234)"
//                                         component={PasswordInput}
//                                     />
//                                 </FormItem>
//                             </div> */}
//                             <Button
//                                 block
//                                 loading={isSubmitting}
//                                 variant="solid"
//                                 type="submit"
//                             >
//                                 {isSubmitting
//                                     ? 'Creating Account...'
//                                     : 'Sign Up'}
//                             </Button>
//                             <div className="mt-4 text-center">
//                                 <span>Already have an account? </span>
//                                 <ActionLink to={signInUrl}>Sign in</ActionLink>
//                             </div>
//                         </FormContainer>
//                     </Form>
//                 )}
//             </Formik>
//             <Modal
//                 title={<h4>Thank you for registering!</h4>}
//                 centered
//                 open={showSuccessDialog}
//                 onCancel={handleCloseDialog}
//                 footer={[
//                     <Button
//                         style={{ backgroundColor: 'blue', color: 'white' }}
//                         key="ok"
//                         onClick={handleCloseDialog}
//                     >
//                         OK
//                     </Button>,
//                 ]}
//             >
//                 <p>Your registration was successful!</p>
//                 <br />
//                 <p>
//                     Once your registration is approved by the admin, you will
//                     receive an email with your login credentials and further
//                     instructions on how to access the dashboard. Please check
//                     your email regularly. Thank you!
//                 </p>
//             </Modal>
//         </div>
//     )
// }

// export default SignUpForm

import React, { useState, useEffect } from 'react'
import { Input, Button, FormItem, FormContainer, Alert } from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from 'utils/hooks/useAuth'
import { Modal, Steps } from 'antd'
import Select from 'react-select'
import './style.css'
import axios from 'axios'
import appConfig from 'configs/app.config'

const { Step } = Steps

const validationSchemaStep1 = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    phone_no: Yup.string()
        .matches(/^[6789]\d{9}$/, 'Invalid phone number')
        .required('Phone no. is required'),
    state_id: Yup.string().required('Select state'),
    city_id: Yup.string().required('Select city'),

    address: Yup.string().required('Please enter your address'),
    email: Yup.string()
        .email('Valid email format (e.g., abc12@gmail.com)')
        .required('Please enter your email'),
})
const validationSchemaStep2 = Yup.object().shape({
    business_reg_no: Yup.string().required(
        'Business Registration Number is required'
    ),
    pan_no: Yup.string()
        .matches(
            /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            'Must be a valid format (e.g., ABCDE1234F)'
        )
        .required('PAN Number is required'),
    aadhar_no: Yup.string()
        .matches(
            /^[2-9]{1}[0-9]{11}$/,
            'Aadhar Number must be a valid 12-digit number'
        )
        .required('Aadhar Number is required'),
    add_prof: Yup.mixed().required('Address Proof is required'),
    bank_acc_no: Yup.string()
        .matches(
            /^[0-9]{9,18}$/,
            // 'Bank Account Number must be between 9 and 18 digits'
            'Must be between 9 to 18 digits'
        )
        .required('Bank Account No. is required'),
    bank_name: Yup.string().required('Bank Name is required'),
    ifsc_code: Yup.string()
        .matches(
            /^[A-Z]{4}0[A-Z0-9]{6}$/,
            // 'IFSC Code must be a valid format (e.g., ABCD0123456)'
            'Valid format (ABCD0123456)'
        )
        .required('IFSC Code is required'),
    aadhar_copy: Yup.mixed().required('Aadhar Copy is required'),
    pan_copy: Yup.mixed().required('PAN Copy is required'),
    gstno: Yup.string().matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Valid GST format (e.g., 06BZAHM6385P6Z2)'
    ),
    company_name: Yup.string().required('Company name is required'),
    acceptTerms: Yup.boolean().required(
        'You must agree to the terms and conditions'
    ),
})

const SignUpForm = (props) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
    const [currentStep, setCurrentStep] = useState(0)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [selectedState, setSelectedState] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [showTermsModal, setShowTermsModal] = useState(false)
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
            setCityList(response.data)
        } catch (error) {
            console.error('Error fetching cities:', error)
        }
    }
    const validateAcceptTerms = (value) => {
        let error
        if (!value) {
            error = 'You must agree to the terms and conditions'
        }
        return error
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
            email,
            business_reg_no,
            pan_no,
            aadhar_no,
            add_prof,
            bank_acc_no,
            bank_name,
            ifsc_code,
            aadhar_copy,
            pan_copy,
        } = values

        setSubmitting(true)

        const formData = new FormData()
        formData.append('first_name', first_name)
        formData.append('last_name', last_name)
        formData.append('phone_no', phone_no)
        formData.append('company_name', company_name)
        formData.append('state_id', state_id)
        formData.append('city_id', city_id)
        formData.append('gstno', gstno)
        formData.append('address', address)
        formData.append('email', email)
        formData.append('business_reg_no', business_reg_no)
        formData.append('pan_no', pan_no)
        formData.append('aadhar_no', aadhar_no)
        formData.append('bank_acc_no', bank_acc_no)
        formData.append('bank_name', bank_name)
        formData.append('ifsc_code', ifsc_code)

        if (add_prof) {
            formData.append('add_prof', add_prof)
        }

        if (aadhar_copy) {
            formData.append('aadhar_copy', aadhar_copy)
        }

        if (pan_copy) {
            formData.append('pan_copy', pan_copy)
        }

        try {
            const result = await axios.post(
                `${appConfig.apiPrefix}/vendor/register`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            if (result.status === 200) {
                setShowSuccessDialog(true)
            } else {
                setMessage(result.message)
            }
        } catch (error) {
            setMessage('An error occurred: ' + error.message)
        }
        setSubmitting(false)
    }

    const handleNext = (setFieldTouched, validateForm) => {
        setFieldTouched('first_name')
        setFieldTouched('last_name')
        setFieldTouched('phone_no')
        setFieldTouched('company_name')
        setFieldTouched('state_id')
        setFieldTouched('city_id')
        setFieldTouched('gstno')
        setFieldTouched('address')
        setFieldTouched('email')

        validateForm().then((errors) => {
            if (Object.keys(errors).length === 0) {
                setCurrentStep(currentStep + 1)
            }
        })
    }

    const handlePrev = () => {
        setCurrentStep(currentStep - 1)
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
                    business_reg_no: '',
                    pan_no: '',
                    aadhar_no: '',
                    add_prof: null,
                    bank_acc_no: '',
                    bank_name: '',
                    ifsc_code: '',
                    aadhar_copy: null,
                    pan_copy: null,
                }}
                validationSchema={
                    currentStep === 0
                        ? validationSchemaStep1
                        : validationSchemaStep2
                }
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignUp(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({
                    touched,
                    errors,
                    isSubmitting,
                    setFieldValue,
                    setFieldTouched,
                    validateForm,
                    values,
                }) => (
                    <Form>
                        {/* <Steps current={currentStep}>
                            <Step title="Basic Details" />
                            <Step title="KYC" />
                        </Steps> */}

                        <div className="steps-content">
                            {currentStep === 0 && (
                                <FormContainer>
                                    <div className="flex">
                                        <FormItem
                                            className="w-1/2 mr-4"
                                            label="First Name"
                                            invalid={
                                                errors.first_name &&
                                                touched.first_name
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
                                                errors.last_name &&
                                                touched.last_name
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
                                                errors.phone_no &&
                                                touched.phone_no
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
                                                errors.state_id &&
                                                touched.state_id
                                            }
                                            errorMessage={errors.state_id}
                                        >
                                            <Field
                                                as="select"
                                                name="State"
                                                className={`select-wrapper ${
                                                    errors.state_id &&
                                                    touched.state_id
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
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                )
                                                        )
                                                    handleStateChange(
                                                        selectedState
                                                    )
                                                }}
                                            >
                                                <Select options={stateList} />
                                                <option value="">
                                                    Select State
                                                </option>
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
                                            invalid={
                                                errors.city_id &&
                                                touched.city_id
                                            }
                                            errorMessage={errors.city_id}
                                        >
                                            <Field
                                                as="select"
                                                name="City"
                                                className={`select-wrapper ${
                                                    errors.city_id &&
                                                    touched.city_id
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
                                                <option value="">
                                                    Select City
                                                </option>
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
                                    <FormItem
                                        className="mt-4"
                                        label="Address"
                                        invalid={
                                            errors.address && touched.address
                                        }
                                        errorMessage={errors.address}
                                    >
                                        <Field
                                            as="textarea"
                                            name="address"
                                            rows={3}
                                            className={`resize-none w-full ${
                                                errors.address &&
                                                touched.address
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

                                    <Button
                                        onClick={() =>
                                            handleNext(
                                                setFieldTouched,
                                                validateForm
                                            )
                                        }
                                        block
                                        variant="solid"
                                        type="button"
                                    >
                                        Next
                                    </Button>
                                </FormContainer>
                            )}

                            {currentStep === 1 && (
                                <FormContainer>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormItem
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
                                            label="Business Registration Number"
                                            invalid={
                                                errors.business_reg_no &&
                                                touched.business_reg_no
                                            }
                                            errorMessage={
                                                errors.business_reg_no
                                            }
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="business_reg_no"
                                                placeholder="Business Registration Number"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="GST Number"
                                            invalid={
                                                errors.gstno && touched.gstno
                                            }
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
                                        <FormItem
                                            label="Address Proof"
                                            invalid={
                                                errors.add_prof &&
                                                touched.add_prof
                                            }
                                            errorMessage={errors.add_prof}
                                        >
                                            {/* <span className="text-gray-500 italic">
                                                (e.g., Aadhar card, Voter ID,
                                                etc.)
                                            </span> */}
                                            <input
                                                type="file"
                                                name="add_prof"
                                                onChange={(e) => {
                                                    const file =
                                                        e.currentTarget.files[0]
                                                    if (
                                                        file &&
                                                        file.size > 300 * 1024
                                                    ) {
                                                        // setErrors({
                                                        //     add_prof:
                                                        //         'File size should not exceed 300KB',
                                                        // })
                                                    } else {
                                                        setFieldValue(
                                                            'add_prof',
                                                            file
                                                        )
                                                    }
                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="PAN Number"
                                            invalid={
                                                errors.pan_no && touched.pan_no
                                            }
                                            errorMessage={errors.pan_no}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="pan_no"
                                                placeholder="PAN Number"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="PAN Copy"
                                            invalid={
                                                errors.pan_copy &&
                                                touched.pan_copy
                                            }
                                            errorMessage={errors.pan_copy}
                                        >
                                            <input
                                                type="file"
                                                name="pan_copy"
                                                onChange={(e) => {
                                                    const file =
                                                        e.currentTarget.files[0]
                                                    if (
                                                        file &&
                                                        file.size > 300 * 1024
                                                    ) {
                                                        // setErrors({
                                                        //     pan_copy:
                                                        //         'File size should not exceed 300KB',
                                                        // })
                                                    } else {
                                                        setFieldValue(
                                                            'pan_copy',
                                                            file
                                                        )
                                                    }
                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Aadhar Number"
                                            invalid={
                                                errors.aadhar_no &&
                                                touched.aadhar_no
                                            }
                                            errorMessage={errors.aadhar_no}
                                        >
                                            <Field
                                                type="text"
                                                maxLength="12"
                                                autoComplete="off"
                                                name="aadhar_no"
                                                placeholder="Aadhar Number"
                                                component={Input}
                                                onChange={(e) => {
                                                    const re = /^[0-9\b]+$/
                                                    if (
                                                        e.target.value === '' ||
                                                        re.test(e.target.value)
                                                    ) {
                                                        setFieldValue(
                                                            'aadhar_no',
                                                            e.target.value
                                                        )
                                                    }
                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Aadhar Copy"
                                            invalid={
                                                errors.aadhar_copy &&
                                                touched.aadhar_copy
                                            }
                                            errorMessage={errors.aadhar_copy}
                                        >
                                            <input
                                                type="file"
                                                name="aadhar_copy"
                                                onChange={(e) => {
                                                    const file =
                                                        e.currentTarget.files[0]
                                                    if (
                                                        file &&
                                                        file.size > 300 * 1024
                                                    ) {
                                                        // setErrors({
                                                        //     aadhar_copy:
                                                        //         'File size should not exceed 300KB',
                                                        // })
                                                    } else {
                                                        setFieldValue(
                                                            'aadhar_copy',
                                                            file
                                                        )
                                                    }
                                                }}
                                            />
                                        </FormItem>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <FormItem
                                            label="Bank Account Number"
                                            invalid={
                                                errors.bank_acc_no &&
                                                touched.bank_acc_no
                                            }
                                            errorMessage={errors.bank_acc_no}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                maxLength={18}
                                                name="bank_acc_no"
                                                placeholder="Bank Account Number"
                                                component={Input}
                                            />
                                        </FormItem>

                                        <FormItem
                                            label="Bank Name"
                                            invalid={
                                                errors.bank_name &&
                                                touched.bank_name
                                            }
                                            errorMessage={errors.bank_name}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="bank_name"
                                                placeholder="Bank Name"
                                                component={Input}
                                            />
                                        </FormItem>

                                        <FormItem
                                            label="IFSC Code"
                                            invalid={
                                                errors.ifsc_code &&
                                                touched.ifsc_code
                                            }
                                            errorMessage={errors.ifsc_code}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="ifsc_code"
                                                placeholder="IFSC Code"
                                                component={Input}
                                            />
                                        </FormItem>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormItem>
                                            <Field
                                                type="checkbox"
                                                name="acceptTerms"
                                                validate={validateAcceptTerms}
                                            />
                                            <label
                                                htmlFor="acceptTerms"
                                                className="ml-2"
                                            >
                                                I agree to the{' '}
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setShowTermsModal(true)
                                                    }}
                                                >
                                                    Terms and Conditions
                                                </a>
                                            </label>
                                        </FormItem>
                                    </div>

                                    <div className="flex justify-between mb-4">
                                        <Button
                                            onClick={handlePrev}
                                            variant="solid"
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            block
                                            loading={isSubmitting}
                                            variant="solid"
                                            type="submit"
                                            className="ml-4"
                                        >
                                            {isSubmitting
                                                ? 'Creating Account...'
                                                : 'Register'}
                                        </Button>
                                    </div>
                                </FormContainer>
                            )}
                        </div>

                        <div className="mt-4 text-center">
                            <span>Already have an account? </span>
                            <ActionLink to={signInUrl}>Sign in</ActionLink>
                        </div>
                    </Form>
                )}
            </Formik>
            <Modal
                title="Terms and Conditions"
                open={showTermsModal}
                onCancel={() => setShowTermsModal(false)}
                footer={[
                    <Button key="ok" onClick={() => setShowTermsModal(false)}>
                        OK
                    </Button>,
                ]}
            >
                <p>
                    Please read the following terms and conditions carefully
                    before uploading any KYC documents or submitting your
                    registration:
                </p>
                <ol className="list-decimal ml-4">
                    <li>
                        All KYC documents, including Aadhar card, PAN card, and
                        address proof, must be valid and up-to-date.
                    </li>
                    <li>
                        Any attempt to submit forged or fraudulent documents
                        will result in immediate rejection of your registration
                        and potential legal action.
                    </li>
                    <li>
                        The uploaded documents will be used solely for the
                        purpose of identity verification and will be handled in
                        strict compliance with our privacy policy.
                    </li>
                    <li>
                        Violation of any of our policies or terms and conditions
                        may lead to account suspension or termination.
                    </li>
                    <li>
                        By agreeing to these terms and conditions, you
                        acknowledge that you are registering as a vendor for our
                        website and will abide by all applicable laws and
                        regulations related to the sale of jewellery items.
                    </li>
                </ol>
            </Modal>
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
