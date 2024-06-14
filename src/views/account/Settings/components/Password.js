import React, { useState } from 'react'
import {
    Input,
    Button,
    Notification,
    toast,
    FormContainer,
} from 'components/ui'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import appConfig from 'configs/app.config'
import { Modal } from 'antd'
import { jwtDecode } from 'jwt-decode'

const token = localStorage.getItem('admin')
const decodedToken = jwtDecode(token)
const vendorID = decodedToken.id

const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
        .required('Enter your new password')
        .min(8, 'Too Short!')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Valid password format (e.g., Abcd@1234)'
        ),
    oldPassword: Yup.string().required('Current password Required'),
    confirmNewPassword: Yup.string().oneOf(
        [Yup.ref('newPassword'), null],
        'Password not match'
    ),
})

const Password = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const onFormSubmit = (values, setSubmitting, resetForm) => {
        toast.push(<Notification title={'Password updated'} type="success" />, {
            placement: 'top-center',
        })
        setSubmitting(false)
        resetForm()
    }

    const handleChangePassword = async (values, setSubmitting, resetForm) => {
        const { oldPassword, newPassword } = values
        if (oldPassword === newPassword) {
            toast.push(
                <Notification
                    title={'Current and new passwords cannot be the same'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
            setSubmitting(false)
            return
        }
        try {
            // Make the API request to change the password
            const response = await axios.put(
                `${appConfig.apiPrefix}/vendor/update-password/${vendorID}`,
                {
                    oldPassword,
                    newPassword,
                }
            )

            // Handle the successful response
            if (response.data.success) {
                onFormSubmit(values, setSubmitting, resetForm)
            } else {
                // Handle the error response
                const errorMessage = response.data.data.error
                if (errorMessage === 'Invalid old password') {
                    toast.push(
                        <Notification
                            title={'Invalid old password'}
                            type="danger"
                        />,
                        {
                            placement: 'top-center',
                        }
                    )
                } else {
                    toast.push(
                        <Notification
                            title={'Error changing password ' + errorMessage}
                            type="danger"
                        />,
                        {
                            placement: 'top-center',
                        }
                    )
                }
                setSubmitting(false)
            }
        } catch (error) {
            // Handle the network or other errors
            console.error('Error changing password:', error)
            toast.push(
                <Notification
                    title={error.response.data.error}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
            setSubmitting(false)
        }
    }

    const showModal = () => {
        Modal.confirm({
            title: 'Are you sure you want to delete your account?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: handleOk,
        })
    }

    const handleOk = async () => {
        try {
            const response = await axios.delete(
                `${appConfig.apiPrefix}/vendor/delete-account/${vendorID}`
            )
            if (response.data.success) {
                toast.push(
                    <Notification
                        title={'Account deleted successfully'}
                        type="success"
                        duration={2500}
                    >
                        Account deleted successfully
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                // Additional actions after account deletion, e.g., redirect to login
            } else {
                toast.push(
                    <Notification
                        title={'Error deleting account'}
                        type="danger"
                        duration={2500}
                    >
                        Error deleting account - Please try again later
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            console.error('Error deleting account:', error)
            toast.push(
                <Notification
                    title={'Failed to delete account'}
                    type="danger"
                    duration={2500}
                >
                    {error.message} - Please try again later
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    return (
        <>
            <Formik
                initialValues={{
                    oldPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true)
                    handleChangePassword(values, setSubmitting, resetForm)
                }}
            >
                {({ values, touched, errors, isSubmitting, resetForm }) => {
                    const validatorProps = { touched, errors }
                    return (
                        <Form>
                            <FormContainer>
                                <FormDesription
                                    title={
                                        <span
                                            style={{
                                                color: '#832729',
                                            }}
                                        >
                                            Password
                                        </span>
                                    }
                                    desc="Enter your current & new password to reset your password"
                                />
                                <FormRow
                                    name="password"
                                    label="Current Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="oldPassword"
                                        placeholder="Current Password"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="newPassword"
                                    label="New Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="newPassword"
                                        placeholder="New Password"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="confirmNewPassword"
                                    label="Confirm Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="confirmNewPassword"
                                        placeholder="Confirm Password"
                                        component={Input}
                                    />
                                </FormRow>
                                <div className="mt-4 flex justify-between">
                                    <Button
                                        variant="solid"
                                        type="button"
                                        onClick={showModal}
                                        style={{
                                            backgroundColor: '#d9534f',
                                            borderColor: '#d43f3a',
                                            color: '#fff',
                                        }}
                                    >
                                        <i className="fas fa-trash-alt"></i>{' '}
                                        Delete Account
                                    </Button>
                                    <div>
                                        <Button
                                            className="ltr:mr-2 rtl:ml-2"
                                            type="button"
                                            onClick={resetForm}
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            variant="solid"
                                            loading={isSubmitting}
                                            style={{
                                                backgroundColor: '#832729',
                                            }}
                                            type="submit"
                                        >
                                            {isSubmitting
                                                ? 'Updating'
                                                : 'Update Password'}
                                        </Button>
                                    </div>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
}

export default Password
