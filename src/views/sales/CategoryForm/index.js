import React, { forwardRef, useState } from 'react'
import { Form, Input, Upload, Card, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Notification, hooks, toast } from 'components/ui'
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
    // const [imageUrl, setImageUrl] = useState(null)
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

            if (
                response &&
                response.message === 'Category created successfully'
            ) {
                // toast.push(
                //     <Notification
                //         title={'Successfully added'}
                //         type="success"
                //         duration={2500}
                //     >
                //         Category added successfully
                //     </Notification>,
                //     {
                //         placement: 'top-center',
                //     }
                // )
            } else if (response && response.status === 400) {
                // toast.push(
                //     <Notification
                //         title={'Failed to add category'}
                //         type="danger"
                //         duration={2500}
                //     >
                //         {response.data.message}
                //     </Notification>,
                //     {
                //         placement: 'top-center',
                //     }
                // )
            }
            // else if (response && response.status === 500) {
            //     throw new Error('Internal Server Error')
            // } else {
            // throw new Error(response?.data?.message || 'Unknown error')
            // }
        } catch (error) {
            // toast.push(
            //     <Notification
            //         title={'Successfully added'}
            //         type="success"
            //         duration={2500}
            //     >
            //         Category added successfully
            //     </Notification>,
            //     {
            //         placement: 'top-center',
            //     }
            // )
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
        if (file.type && file.type.startsWith('image/')) {
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
        <div className="flex items-center">
            <Card className="w-full max-w-md p-8">
                <Form form={form} onFinish={onFinish}>
                    <Form.Item
                        name="category_name"
                        label="Category Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter category name',
                            },
                        ]}
                        className="mb-4"
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

                    <Button
                        htmltype="submit"
                        loading={loading}
                        style={{ backgroundColor: 'blue', color: 'white' }}
                    >
                        Submit
                    </Button>
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
