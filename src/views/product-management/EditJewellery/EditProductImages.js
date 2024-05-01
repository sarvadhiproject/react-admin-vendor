import React, { useState, useEffect } from 'react'
import { Form, Upload, Button, message, Spin } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import appConfig from 'configs/app.config'
import { Notification, toast } from 'components/ui'

const EditProductImages = ({
    onPrev,
    formData,
    setFormData,
    onSubmit,
    productId,
}) => {
    const [fileList, setFileList] = useState([])
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchExistingImages(productId)
    }, [productId])

    const fetchExistingImages = async (productId) => {
        try {
            const response = await fetch(
                `${appConfig.apiPrefix}/product-details/${productId}`
            )
            const data = await response.json()
            const existingImages = data.p_images.map((image) => ({
                uid: image,
                name: image,
                status: 'done',
                url: `${appConfig.imgPrefix}/${image}`,
            }))
            setFileList(existingImages)
        } catch (error) {
            console.error('Error fetching existing images:', error)
        }
    }
    const handleUpload = ({ fileList }) => {
        setFileList(fileList)
        form.validateFields(['p_images'])
    }

    const handlePreview = (file) => {
        if (file.type && file.type.startsWith('image/')) {
            // Handle preview for local file objects
            const reader = new FileReader()
            reader.onload = () => {
                const imageUrl = reader.result
                if (imageUrl) {
                    const newTab = window.open(imageUrl)
                    if (newTab) {
                        newTab.focus()
                    } else {
                        message.error(
                            'Unable to open a new tab. Please check your browser settings.'
                        )
                    }
                } else {
                    message.error('Failed to generate preview')
                }
            }
            reader.readAsDataURL(file.originFileObj)
        } else if (file.url) {
            // Handle preview for existing images from the server
            const newTab = window.open(file.url)
            if (newTab) {
                newTab.focus()
            } else {
                message.error(
                    'Unable to open a new tab. Please check your browser settings.'
                )
            }
        } else {
            message.error('Only image files can be previewed')
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const formDataToSend = new FormData()
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key])
            })

            const newFilesToUpload = fileList.filter((file) => !file.url)
            newFilesToUpload.forEach((file) => {
                const fileObject = new File([file.originFileObj], file.name, {
                    type: file.type,
                })
                formDataToSend.append('p_images', fileObject)
            })

            const existingImageNames = fileList
                .filter((file) => file.url)
                .map((file) => file.name)

            formDataToSend.append(
                'existingImages',
                JSON.stringify(existingImageNames)
            ) // Send existing image names to backend

            const response = await fetch(
                `${appConfig.apiPrefix}/update-product/${productId}`,
                {
                    method: 'PUT',
                    body: formDataToSend,
                }
            )

            if (response.ok) {
                // message.success('Product updated successfully')
                toast.push(
                    <Notification
                        title={'Successfully updated'}
                        type="success"
                        duration={2500}
                    >
                        Product updated successfully
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                onSubmit()
            } else {
                const data = await response.json()
                // message.error(data.error || 'Failed to update product')
                toast.push(
                    <Notification
                        title={'Failed to update product'}
                        type="danger"
                        duration={2500}
                    >
                        {data.error}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
            setLoading(false)
        } catch (error) {
            // message.error('Failed to update product:', error)
            toast.push(
                <Notification
                    title={'Failed to update product'}
                    type="danger"
                    duration={2500}
                >
                    We are experiencing some technical difficulties. Please wait
                    or try reloading the page.
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
            <Form.Item label="Product Images" name="p_images">
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleUpload}
                    onPreview={handlePreview}
                    accept="image/*"
                    beforeUpload={() => false}
                    onRemove={(file) => {
                        setFileList((prevList) =>
                            prevList.filter((item) => item.uid !== file.uid)
                        )
                    }}
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

export default EditProductImages
