import React, { useState } from 'react'
import { Form, Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import appConfig from 'configs/app.config'
import { useForm } from 'antd/lib/form/Form'

const AddProductImages = ({ onPrev, formData, setFormData, onSubmit }) => {
    const [fileList, setFileList] = useState([])
    const [form] = Form.useForm()

    const handleUpload = ({ fileList }) => {
        setFileList(fileList)
        form.validateFields(['productImages'])
    }
    const handlePreview = (file) => {
        if (file.type && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = () => {
                const imageUrl = reader.result
                if (imageUrl) {
                    const newTab = window.open()
                    newTab.document.write(
                        `<img src="${imageUrl}" style="max-width: 100%; max-height: 100%;" />`
                    )
                } else {
                    message.error('Failed to generate preview')
                }
            }
            reader.readAsDataURL(file.originFileObj)
        } else {
            message.error('Only image files can be previewed')
        }
    }

    const handleSubmit = async () => {
        try {
            // Check if fileList is empty
            if (fileList.length === 0) {
                message.error('Please upload at least one image')
                return
            }

            const formDataToSend = new FormData()
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key])
            })
            fileList.forEach((file) => {
                formDataToSend.append('Images', file.originFileObj)
            })

            const response = await fetch(
                `${appConfig.apiPrefix}/add-product-cloudinary`,
                {
                    method: 'POST',
                    body: formDataToSend,
                }
            )

            if (response.ok) {
                message.success('Product added successfully')
                onSubmit()
            } else {
                const data = await response.json()
                message.error(data.error || 'Failed to add product')
            }
        } catch (error) {
            message.error('Failed to add product:', error)
        }
    }

    return (
        <Form onFinish={handleSubmit}>
            <Form.Item
                label="Product Images"
                name="productImages"
                // rules={[
                //     {
                //         validator: (_, value) => {
                //             if (value && value.length > 0) {
                //                 return Promise.resolve()
                //             }
                //             return Promise.reject(
                //                 new Error('Please upload at least one image')
                //             )
                //         },
                //     },
                // ]}
            >
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleUpload}
                    onPreview={handlePreview}
                    accept="image/*"
                    beforeUpload={() => false}
                >
                    <div>
                        <UploadOutlined style={{ fontSize: '20px' }} />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                </Upload>
            </Form.Item>
            <Form.Item>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '20px',
                        justifyContent: 'space-between',
                    }}
                >
                    <Button onClick={onPrev}>Previous</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            background: '#1890ff',
                            borderColor: '#1890ff',
                            borderRadius: '4px',
                            width: '80px',
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </Form.Item>
        </Form>
    )
}

export default AddProductImages
