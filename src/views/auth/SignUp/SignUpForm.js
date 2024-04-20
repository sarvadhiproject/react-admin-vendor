// import React, { useState } from 'react'
// import { Input, Button, FormItem, FormContainer, Alert } from 'components/ui'
// import { PasswordInput, ActionLink } from 'components/shared'
// import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
// import { Field, Form, Formik } from 'formik'
// import * as Yup from 'yup'
// import useAuth from 'utils/hooks/useAuth'
// import { Modal } from 'antd'
// import Select from 'react-select'
// import './style.css'

// const validationSchema = Yup.object().shape({
//     firstName: Yup.string().required('Please enter your first name'),
//     lastName: Yup.string().required('Please enter your last name'),
//     phoneNo: Yup.string()
//         .matches(/^[0-9]+$/, 'Please enter valid phone number')
//         .max(10, 'Phone number must be 10 digits')
//         .required('Phone no. is required'),
//     companyName: Yup.string().required('Please enter your company name'),
//     state: Yup.string().required('Select your state'),
//     gstNo: Yup.string().matches(
//         /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
//         'Valid GST format (e.g., 06BZAHM6385P6Z2)'
//     ),
//     address: Yup.string().required('Please enter your address'),
//     email: Yup.string()
//         .email('Valid email format (e.g., abc12@gmail.com)')
//         .required('Please enter your email'),
//     password: Yup.string()
//         .matches(
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//             'Valid password format (e.g., Abcd@1234)'
//         )
//         .required('Please enter your password'),
//     confirmPassword: Yup.string().oneOf(
//         [Yup.ref('password'), null],
//         'Your passwords do not match'
//     ),
// })

// const indianStates = [
//     'Andhra Pradesh',
//     'Arunachal Pradesh',
//     'Assam',
//     'Bihar',
//     'Chhattisgarh',
//     'Goa',
//     'Gujarat',
//     'Haryana',
//     'Himachal Pradesh',
//     'Jammu and Kashmir',
//     'Jharkhand',
//     'Karnataka',
//     'Kerala',
//     'Madhya Pradesh',
//     'Maharashtra',
//     'Manipur',
//     'Meghalaya',
//     'Mizoram',
//     'Nagaland',
//     'Odisha',
//     'Punjab',
//     'Rajasthan',
//     'Sikkim',
//     'Tamil Nadu',
//     'Telangana',
//     'Tripura',
//     'Uttar Pradesh',
//     'Uttarakhand',
//     'West Bengal',
// ]

// const SignUpForm = (props) => {
//     const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
//     const [showSuccessDialog, setShowSuccessDialog] = useState(false)

//     const { signUp } = useAuth()

//     const [message, setMessage] = useTimeOutMessage()
//     const handleCloseDialog = () => {
//         setShowSuccessDialog(false)
//     }
//     const onSignUp = async (values, setSubmitting, resetForm) => {
//         const {
//             firstName,
//             lastName,
//             phoneNo,
//             companyName,
//             state,
//             gstNo,
//             address,
//             password,
//             email,
//         } = values
//         setSubmitting(true)
//         try {
//             const result = await signUp({
//                 firstName,
//                 lastName,
//                 phoneNo,
//                 companyName,
//                 state,
//                 gstNo,
//                 address,
//                 password,
//                 email,
//             })

//             if (result.status === 'success') {
//                 setShowSuccessDialog(true)
//                 resetForm()
//             } else {
//                 setMessage(result.message)
//             }
//         } catch (error) {
//             setMessage('An error occurred : ' + error.message)
//             // resetForm()
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
//                     firstName: '',
//                     lastName: '',
//                     phoneNo: '',
//                     companyName: '',
//                     state: '',
//                     gstNo: '',
//                     address: '',
//                     email: '',
//                     password: '',
//                     confirmPassword: '',
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
//                                         errors.firstName && touched.firstName
//                                     }
//                                     errorMessage={errors.firstName}
//                                 >
//                                     <Field
//                                         type="text"
//                                         autoComplete="off"
//                                         name="firstName"
//                                         placeholder="First Name"
//                                         component={Input}
//                                     />
//                                 </FormItem>
//                                 <FormItem
//                                     className="w-1/2"
//                                     label="Last Name"
//                                     invalid={
//                                         errors.lastName && touched.lastName
//                                     }
//                                     errorMessage={errors.lastName}
//                                 >
//                                     <Field
//                                         type="text"
//                                         autoComplete="off"
//                                         name="lastName"
//                                         placeholder="Last Name"
//                                         component={Input}
//                                     />
//                                 </FormItem>
//                             </div>
//                             <div className="flex">
//                                 <FormItem
//                                     className="w-1/4 mr-4"
//                                     label="Phone Number"
//                                     invalid={errors.phoneNo && touched.phoneNo}
//                                     errorMessage={errors.phoneNo}
//                                 >
//                                     <Input
//                                         type="text"
//                                         autoComplete="off"
//                                         name="phoneNo"
//                                         maxLength="10"
//                                         placeholder="Phone Number"
//                                         value={values.phoneNo}
//                                         onChange={(e) => {
//                                             const re = /^[0-9\b]+$/
//                                             if (
//                                                 e.target.value === '' ||
//                                                 re.test(e.target.value)
//                                             ) {
//                                                 setFieldValue(
//                                                     'phoneNo',
//                                                     e.target.value
//                                                 )
//                                             }
//                                         }}
//                                     />
//                                 </FormItem>
//                                 <FormItem
//                                     className="w-1/2 mr-4"
//                                     label="Company Name"
//                                     invalid={
//                                         errors.companyName &&
//                                         touched.companyName
//                                     }
//                                     errorMessage={errors.companyName}
//                                 >
//                                     <Field
//                                         type="text"
//                                         autoComplete="off"
//                                         name="companyName"
//                                         placeholder="Company Name"
//                                         component={Input}
//                                     />
//                                 </FormItem>
//                                 <FormItem
//                                     className="w-1/4"
//                                     label="State"
//                                     invalid={errors.state && touched.state}
//                                     errorMessage={errors.state}
//                                 >
//                                     <Field
//                                         as="select"
//                                         name="state"
//                                         className={`select-wrapper ${
//                                             errors.state && touched.state
//                                                 ? 'border-red-500'
//                                                 : 'border'
//                                         }`}
//                                         onChange={(e) =>
//                                             setFieldValue(
//                                                 'state',
//                                                 e.target.value
//                                             )
//                                         }
//                                     >
//                                         <Select options={indianStates} />
//                                         <option value="">Select State</option>
//                                         {indianStates.map((state) => (
//                                             <option key={state} value={state}>
//                                                 {state}
//                                             </option>
//                                         ))}
//                                     </Field>
//                                 </FormItem>
//                             </div>

//                             <FormItem
//                                 className="w-1/2"
//                                 label="GST Number"
//                                 invalid={errors.gstNo && touched.gstNo}
//                                 errorMessage={errors.gstNo}
//                             >
//                                 <Field
//                                     type="text"
//                                     autoComplete="off"
//                                     name="gstNo"
//                                     maxLength="15"
//                                     placeholder="GST Number (e.g., 06BZAHM6385P6Z2)"
//                                     component={Input}
//                                 />
//                             </FormItem>

//                             <FormItem
//                                 className="mt-4"
//                                 label="Address"
//                                 invalid={errors.address && touched.address}
//                                 errorMessage={errors.address}
//                             >
//                                 <Field
//                                     as="textarea"
//                                     name="address"
//                                     placeholder="Address"
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
//                             <div className="flex">
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
//                             </div>
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
    firstName: Yup.string().required('Please enter your first name'),
    lastName: Yup.string().required('Please enter your last name'),
    phoneNo: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phno. must be 10 digits')
        .required('Phone no. is required'),
    CompanyName: Yup.string().required('Please enter your company name'),
    State: Yup.string().required('Select your state'),
    GSTNo: Yup.string().matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Valid GST format (e.g., 06BZAHM6385P6Z2)'
    ),
    Address: Yup.string().required('Please enter your Address'),
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
            firstName,
            lastName,
            phoneNo,
            CompanyName,
            State,
            GSTNo,
            Address,
            password,
            email,
        } = values
        setSubmitting(true)
        try {
            const result = await signUp({
                firstName,
                lastName,
                phoneNo,
                CompanyName,
                State,
                GSTNo,
                Address,
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
                    firstName: '',
                    lastName: '',
                    phoneNo: '',
                    CompanyName: '',
                    State: '',
                    GSTNo: '',
                    Address: '',
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
                                        errors.firstName && touched.firstName
                                    }
                                    errorMessage={errors.firstName}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="firstName"
                                        placeholder="First Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    className="w-1/2"
                                    label="Last Name"
                                    invalid={
                                        errors.lastName && touched.lastName
                                    }
                                    errorMessage={errors.lastName}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="lastName"
                                        placeholder="Last Name"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <div className="flex">
                                <FormItem
                                    className="w-1/4 mr-4"
                                    label="Phone Number"
                                    invalid={errors.phoneNo && touched.phoneNo}
                                    errorMessage={errors.phoneNo}
                                >
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        name="phoneNo"
                                        maxLength="10"
                                        placeholder="Phone Number"
                                        value={values.phoneNo}
                                        onChange={(e) => {
                                            const re = /^[0-9\b]+$/
                                            if (
                                                e.target.value === '' ||
                                                re.test(e.target.value)
                                            ) {
                                                setFieldValue(
                                                    'phoneNo',
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
                                        errors.CompanyName &&
                                        touched.CompanyName
                                    }
                                    errorMessage={errors.CompanyName}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="CompanyName"
                                        placeholder="Company Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    className="w-1/4"
                                    label="State"
                                    invalid={errors.State && touched.State}
                                    errorMessage={errors.State}
                                >
                                    <Field
                                        as="select"
                                        name="State"
                                        className={`select-wrapper ${
                                            errors.State && touched.State
                                                ? 'border-red-500'
                                                : 'border'
                                        }`}
                                        onChange={(e) =>
                                            setFieldValue(
                                                'State',
                                                e.target.value
                                            )
                                        }
                                    >
                                        <Select options={indianStates} />
                                        <option value="">Select State</option>
                                        {indianStates.map((State) => (
                                            <option key={State} value={State}>
                                                {State}
                                            </option>
                                        ))}
                                    </Field>
                                </FormItem>
                            </div>

                            <FormItem
                                className="w-1/2"
                                label="GST Number"
                                invalid={errors.GSTNo && touched.GSTNo}
                                errorMessage={errors.GSTNo}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="GSTNo"
                                    maxLength="15"
                                    placeholder="GST Number (e.g., 06BZAHM6385P6Z2)"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                className="mt-4"
                                label="Address"
                                invalid={errors.Address && touched.Address}
                                errorMessage={errors.Address}
                            >
                                <Field
                                    as="textarea"
                                    name="Address"
                                    placeholder="Address"
                                    rows={3}
                                    className={`resize-none w-full ${
                                        errors.Address && touched.Address
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
