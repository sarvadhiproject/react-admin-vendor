import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Button } from 'antd'
import appConfig from 'configs/app.config'

const { Option } = Select

const EditProductMetadata = ({ onNext, formData, setFormData }) => {
    const [categories, setCategories] = useState([])
    const [initialValues, setInitialValues] = useState({
        product_name: formData?.product_name ? formData?.product_name : '',
        basic_description: formData?.basic_description
            ? formData?.basic_description
            : '',
        main_description: formData?.main_description
            ? formData?.main_description
            : '',
        category_id: formData?.category_id ? formData?.category_id : '',
    })
    console.log(initialValues, 'initialValues')
    console.log('setFormData', formData)
    useEffect(() => {
        fetchCategories()
    }, [])

    console.log(formData, 'formData')

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${appConfig.apiPrefix}/categories/get-categories`
            )
            const data = await response.json()
            setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleSubmit = (values) => {
        setFormData({ ...formData, ...values })
        onNext()
    }

    const handleCategoryChange = (category_id) => {
        setFormData({ ...formData, category_id })
    }
    console.log(formData, 'formData')

    return (
        <Form onFinish={handleSubmit} initialValues={initialValues}>
            {console.log(initialValues, '=======')}
            <Form.Item
                name="product_name"
                label="Title"
                rules={[{ required: true }]}
            >
                <Input style={{ width: '300px', height: '35px' }} />
            </Form.Item>
            <Form.Item
                name="basic_description"
                label="Basic Description"
                rules={[{ required: true }]}
            >
                <Input.TextArea style={{ width: '350px', height: '101px' }} />
            </Form.Item>
            <Form.Item
                name="main_description"
                label="Main Description"
                rules={[{ required: true }]}
            >
                <Input.TextArea style={{ width: '500px', height: '101px' }} />
            </Form.Item>
            <Form.Item
                label="Category"
                name="category_id"
                rules={[{ required: true, message: 'Please select category' }]}
            >
                <Select
                    style={{ width: '300px', height: '35px' }}
                    onChange={handleCategoryChange}
                    placeholder="Select a category"
                    value={formData.category_id || undefined}
                >
                    {categories.map((category) => (
                        <Option
                            key={category.category_id}
                            value={category.category_id}
                        >
                            {category.category_name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end', // Aligns the button to the right
                    }}
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            // background: '#1890ff',
                            // borderColor: '#1890ff',
                            background: '#832729',
                            borderRadius: '4px',
                            marginTop: '10px',
                            width: '80px',
                        }}
                    >
                        Next
                    </Button>
                </div>
            </Form.Item>
        </Form>
    )
}

export default EditProductMetadata
