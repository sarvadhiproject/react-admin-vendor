import React, { useState } from 'react'
import { Form, Upload, Button, message, Spin } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import appConfig from 'configs/app.config'
import { useForm } from 'antd/lib/form/Form'
import { Notification, toast } from 'components/ui'
import axios from 'axios'

const AddProductImages = ({ onPrev, formData, setFormData, onSubmit }) => {
    const [fileList, setFileList] = useState([])
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const handleUpload = ({ fileList }) => {
        setFileList(fileList)
        form.validateFields(['p_images'])
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
            setLoading(true)
            if (fileList.length < 3) {
                message.error('Please upload at least three images')
                setLoading(false)
                return
            }

            const formDataToSend = new FormData()
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key])
            })
            fileList.forEach((file) => {
                const fileObject = new File([file.originFileObj], file.name, {
                    type: file.type,
                })
                formDataToSend.append('p_images', fileObject)
            })

            const response = await axios.post(
                `${appConfig.apiPrefix}/products/add`,
                formDataToSend
            )

            if (response.status === 200) {
                toast.push(
                    <Notification
                        title={'Successfully added'}
                        type="success"
                        duration={2500}
                    >
                        Product added successfully
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                onSubmit()
            } else {
                // message.error(data.error || 'Failed to add product')
                toast.push(
                    <Notification
                        title={'Failed to add product'}
                        type="danger"
                        duration={2500}
                    >
                        {response.data.error}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
            setLoading(false)
        } catch (error) {
            toast.push(
                <Notification
                    title={'Failed to add product'}
                    type="danger"
                    duration={2500}
                >
                    {error.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            setLoading(false)
        }
    }
    return (
        <Form onFinish={handleSubmit}>
            <Form.Item
                label="Product Images"
                name="p_images"
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
                            // background: '#1890ff',
                            // borderColor: '#1890ff',
                            background: '#832729',
                            borderColor: '#832729',
                            borderRadius: '4px',
                            width: '80px',
                        }}
                    >
                        {loading ? (
                            <Spin
                                indicator={
                                    <LoadingOutlined
                                        style={{
                                            fontSize: 22,
                                            color: 'white',
                                        }}
                                        spin
                                    />
                                }
                            />
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </div>
            </Form.Item>
        </Form>
    )
}

export default AddProductImages
