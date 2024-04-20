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
            console.log('response', response)
            console.log('response', response.data)
            return response.data
        } catch (error) {
            console.error('Error:', error)
            return null
        }
    }

    const handleFormSubmit = async (values) => {
        try {
            const response = await addProduct(values)
            if (response.status === 200) {
                fetchData()
                return response
                // navigate('/app/sales/category-list')
            }
        } catch (error) {
            console.log('catch err', error)
            return error.response
        } finally {
            onClose()
        }
    }

    const handleDiscard = () => {
        onClose()
        // navigate('/app/sales/category-list')
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
