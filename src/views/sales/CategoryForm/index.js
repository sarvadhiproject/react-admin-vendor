import React, { forwardRef, useState } from 'react'
import { Form, Input, Upload, Card } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Notification, hooks, toast } from 'components/ui'

const { useUniqueId } = hooks

const CategoryForm = forwardRef((props, ref) => {
    const { onFormSubmit } = props

    const newId = useUniqueId('product-')
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [fileList, setFileList] = useState([])
    const [imagePreview, setImagePreview] = useState('')
    // const [imageUrl, setImageUrl] = useState(null)

    const onFinish = async (values) => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('categoryName', values.categoryName)
            fileList.forEach((file) => {
                formData.append('category_image', file.originFileObj)
            })

            const response = await onFormSubmit(formData)
            // console.log('response in form', response)
            if (response) {
                if (response.status === 200) {
                    // form.resetFields()
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
                } else if (response.status === 400) {
                    toast.push(
                        <Notification
                            title={'Failed to add category'}
                            type="danger"
                            duration={2500}
                        >
                            {response.data.message}
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                } else if (response.status === 500) {
                    throw new Error('Internal Server Error')
                } else {
                    throw new Error(response.data.message || 'Unknown error')
                }
            } else {
                throw new Error('Caught unknown error')
            }
        } catch (error) {
            console.error('Error:', error)
            toast.push(
                <Notification
                    title={'Failed to add category'}
                    type="danger"
                    duration={2500}
                >
                    {error.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            form.resetFields()
            // setImageUrl(null)
            setLoading(false)
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

    return (
        <div className="flex items-center">
            <Card className="w-full max-w-md p-8 border border-gray-300">
                <Form
                    form={form}
                    onFinish={onFinish}
                    className="w-full max-w-md"
                >
                    <Form.Item
                        name="categoryName"
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

                    <Form.Item name="category_image" label="Category Image">
                        <Upload
                            maxCount={1}
                            listType="picture-card"
                            accept="image/*"
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
                        htmlType="submit"
                        size="sm"
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
        categoryName: '',
        category_image: null,
    },
}

export default CategoryForm
