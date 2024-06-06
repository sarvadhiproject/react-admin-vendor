import React, { forwardRef, useState } from 'react'
import { Form, Input, Upload, Card, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { Button, hooks } from 'components/ui'
import { getProducts } from '../CategoryList/store/dataSlice'
import { useDispatch } from 'react-redux'

const { useUniqueId } = hooks

const CategoryForm = forwardRef((props, ref) => {
    const { onFormSubmit } = props

    const newId = useUniqueId('product-')
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [fileList, setFileList] = useState([])
    const [imagePreview, setImagePreview] = useState('')
    const dispatch = useDispatch()

    const onFinish = async (values) => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('category_name', values.category_name)
            fileList.forEach((file) => {
                formData.append('category_image', file.originFileObj)
            })

            const response = await onFormSubmit(formData)

            if (response?.message === 'Category created successfully') {
                message.success('Category created successfully')
            } else if (response?.status === 400) {
                message.error('Failed to create category')
            }
        } catch (error) {
            message.error('An error occurred')
        } finally {
            form.resetFields()
            setLoading(false)
            dispatch(getProducts())
        }
    }

    const handleUploadChange = (info) => {
        setFileList(info.fileList)
    }

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )

    const handlePreview = (file) => {
        if (file.type?.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = () => {
                const imageUrl = reader.result
                if (imageUrl) {
                    const newTab = window.open()
                    newTab.document.write(`<img src="${imageUrl}" />`)
                } else {
                    message.error('Failed to generate preview')
                }
            }
            reader.readAsDataURL(file.originFileObj)
        } else {
            message.error('Only image files can be previewed')
        }
    }

    return (
        <div className="flex justify-center items-center">
            <Card className="w-full max-w-md p-8 rounded-lg">
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="category_name"
                        label="Category Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter category name',
                            },
                        ]}
                    >
                        <Input className="w-full" />
                    </Form.Item>

                    <Form.Item
                        name="category_image"
                        label="Category Image"
                        rules={[
                            {
                                required: true,
                                message: 'Please upload category image',
                            },
                        ]}
                    >
                        <Upload
                            maxCount={1}
                            listType="picture-card"
                            accept="image/*"
                            onPreview={handlePreview}
                            onChange={handleUploadChange}
                            beforeUpload={() => false}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="category"
                                    style={{ width: '100%' }}
                                />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <div className="flex justify-end">
                            <Button
                                htmlType="submit"
                                loading={loading}
                                style={{
                                    backgroundColor: '#832729',
                                    color: 'white',
                                }}
                            >
                                Submit
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
})

CategoryForm.defaultProps = {
    type: 'edit',
    initialData: {
        category_name: '',
        category_image: null,
    },
}

export default CategoryForm
