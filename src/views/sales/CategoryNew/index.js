import React from 'react'
import { toast, Notification } from 'components/ui'
import { useNavigate } from 'react-router-dom'
import { apiCreateSalesProduct } from 'services/SalesService'
import CategoryForm from 'views/sales/CategoryForm'
import { useDispatch } from 'react-redux'
import { getProducts } from '../CategoryList/store/dataSlice'

const CategoryNew = ({ onClose }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const fetchData = () => {
        dispatch(getProducts())
    }
    const addProduct = async (data) => {
        try {
            const response = await apiCreateSalesProduct(data)
            // console.log('response', response)
            // console.log('response', response.data)
            return response.data
        } catch (error) {
            console.error('Error:', error)
            return null
        }
    }

    const handleFormSubmit = async (values) => {
        try {
            const response = await addProduct(values)
            if (
                response &&
                response.message === 'Category created successfully'
            ) {
                fetchData()
                toast.push(
                    <Notification
                        title={'Successfully added'}
                        type="success"
                        duration={2500}
                    >
                        Category added successfully
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                // navigate('/app/sales/category-list')
            } else if (response && response.message) {
                toast.push(
                    <Notification
                        title={'Failed to add category'}
                        type="danger"
                        duration={2500}
                    >
                        {response.message} - Please try again later
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            } else {
                console.error('Unexpected response format:', response)
                toast.push(
                    <Notification
                        title={'Failed to add category'}
                        type="danger"
                        duration={2500}
                    >
                        Check your connection
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            console.error('Error:', error)
            toast.push(
                <Notification
                    title={'Failed to add category'}
                    type="danger"
                    duration={2500}
                >
                    {error.message} - Please try again later
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            onClose()
        }
    }

    const handleDiscard = () => {
        onClose()
    }

    return (
        <>
            <CategoryForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default CategoryNew
