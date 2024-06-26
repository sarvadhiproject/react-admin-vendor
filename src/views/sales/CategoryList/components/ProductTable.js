import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Avatar, Badge, Button, Notification, toast } from 'components/ui'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../store/dataSlice'
import axios from 'axios'

import {
    Table,
    Space,
    message,
    Modal,
    Form,
    Input,
    Upload,
    Tooltip,
    Card,
    Spin,
    Empty,
} from 'antd'
import appConfig from 'configs/app.config'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e
    }
    return e && e.fileList
}

const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        message.error('Image must be smaller than 2MB!')
        return Upload.LIST_IGNORE
    }
    return true
}
const uploadButton = (
    <div>
        <UploadOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </div>
)
const ProductTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [deleteCategoryId, setDeleteCategoryId] = useState(null)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [form] = Form.useForm()
    const [imageUrl, setImageUrl] = useState(null)
    const [fileList, setFileList] = useState([])
    const [isLoading, setIsLoading] = useState(false) // Add this line

    const dispatch = useDispatch()
    const data = useSelector((state) => state.salesProductList.data.productList)

    useEffect(() => {
        dispatch(getProducts())
    }, [dispatch])

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            return
        }
        if (info.file.status === 'done') {
            setImageUrl(info.file.response.url)
            setFileList(info.fileList)
        }
    }

    const handleEdit = (record) => {
        setEditingCategory(record)
        setImageUrl(`${appConfig.imgPrefix}/${record.category_image}`)
        form.setFieldsValue({
            category_name: record.category_name,
            category_image: [
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: `${appConfig.imgPrefix}/${record.category_image}`,
                },
            ],
        })
        setShowEditModal(true)
    }
    const fetchData = () => {
        dispatch(getProducts())
    }

    const handleEditSubmit = async (values) => {
        try {
            setIsLoading(true) // Set isLoading to true before making the API call
            const formData = new FormData()
            formData.append('category_name', values.category_name)
            formData.append(
                'category_image',
                values.category_image[0]?.originFileObj
            )
            const response = await axios.put(
                `${appConfig.apiPrefix}/categories/update-category/${editingCategory.category_id}`,
                formData
            )
            if (response.status !== 200) {
                throw new Error('Failed to update category')
            }

            toast.push(
                <Notification
                    title={'Successfully updated'}
                    type="success"
                    duration={2500}
                >
                    Category updated successfully
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            fetchData()
        } catch (error) {
            toast.push(
                <Notification
                    title={'Failed to update category'}
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
            setIsLoading(false) // Set isLoading to false after the API call is completed
            setShowEditModal(false)
        }
    }
    const indexStart = useMemo(() => {
        const pageSize = 10 // Adjust this to your desired page size
        return (currentPage - 1) * pageSize
    }, [currentPage])
    const columns = [
        {
            title: '#',
            dataIndex: 'category_id',
            key: 'category_id',
            // sorter: (a, b) => a.category_id - b.category_id,
            render: (text, record, index) => (
                <span style={{ color: '#666' }}>{indexStart + index + 1}</span>
            ),
        },
        {
            title: 'Image',
            dataIndex: 'category_image',
            key: 'category_image',
            render: (imageUrl) => (
                <a
                    href={`${appConfig.imgPrefix}/${imageUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={`${appConfig.imgPrefix}/${imageUrl}`}
                        alt="Category"
                        style={{ width: 60, height: 60, cursor: 'pointer' }}
                    />
                </a>
            ),
        },
        {
            title: 'Category Name',
            dataIndex: 'category_name',
            key: 'category_name',
            // sorter: (a, b) => a.category_name.localeCompare(b.category_name),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <span
                        className="action-icon"
                        onClick={() => handleEdit(record)}
                    >
                        <Tooltip title="Update Category">
                            <HiOutlinePencil
                                size={18}
                                style={{
                                    marginLeft: '20px',
                                    color: '#022B4E',
                                    cursor: 'pointer',
                                    marginRight: '10px',
                                }}
                            />
                        </Tooltip>
                    </span>
                    <span
                        className="action-icon"
                        onClick={() => handleDelete(record)}
                    >
                        <Tooltip title="Delete Category">
                            <HiOutlineTrash
                                size={18}
                                style={{ color: 'red', cursor: 'pointer' }}
                            />
                        </Tooltip>
                    </span>
                </Space>
            ),
        },
    ]

    const handleDelete = (record) => {
        // console.log('Delete:', record)
        setDeleteCategoryId(record.category_id)
        setShowConfirmation(true)
    }

    const handleDeleteConfirmation = async () => {
        try {
            const response = await axios.delete(
                `${appConfig.apiPrefix}/categories/delete-category/${deleteCategoryId}`
            )

            if (response.status !== 200) {
                throw new Error('Failed to delete category')
            }
            toast.push(
                <Notification
                    title={'Successfully deleted'}
                    type="success"
                    duration={2500}
                >
                    Category deleted successfully
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            fetchData()
        } catch (error) {
            toast.push(
                <Notification
                    title={'Unable to delete category'}
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
            setShowConfirmation(false)
        }
    }

    return (
        <>
            <Modal
                title={<h5 style={{ color: '#832729' }}>Update Category</h5>}
                open={showEditModal}
                onCancel={() => setShowEditModal(false)}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setShowEditModal(false)}
                        style={{ marginRight: '8px' }}
                    >
                        Cancel
                    </Button>,
                    isLoading ? ( // Conditionally render the button based on isLoading
                        <Button
                            key="submit"
                            type="primary"
                            disabled
                            loading
                            // style={{ backgroundColor: '#022B4E' }}
                            style={{
                                backgroundColor: '#832729',
                                color: 'white',
                            }}
                        >
                            Updating
                        </Button>
                    ) : (
                        <Button
                            key="submit"
                            type="primary"
                            onClick={() => form.submit()}
                            style={{
                                backgroundColor: '#832729',
                                color: 'white',
                            }}
                        >
                            Update
                        </Button>
                    ),
                ]}
            >
                <Card className="w-full max-w-md p-8">
                    <Form
                        form={form}
                        onFinish={handleEditSubmit}
                        initialValues={{
                            category_name: editingCategory?.category_name,
                            category_image: fileList,
                        }}
                    >
                        <Form.Item
                            label="Category Name"
                            name="category_name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter category name',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Category Image"
                            name="category_image"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                maxCount={1}
                                listType="picture-card"
                                showUploadList={{
                                    showPreviewIcon: true,
                                    showRemoveIcon: true,
                                }}
                                action={`${appConfig.apiPrefix}/update-category/${editingCategory?.category_id}`}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                {uploadButton}
                            </Upload>
                        </Form.Item>
                    </Form>
                </Card>
            </Modal>
            <Modal
                title={<h4>Confirm Deletion</h4>}
                open={showConfirmation}
                onOk={handleDeleteConfirmation}
                onCancel={() => setShowConfirmation(false)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{
                    style: {
                        backgroundColor: '#ff4d4f',
                        borderColor: '#ff4d4f',
                    },
                }}
                cancelButtonProps={{ style: { borderColor: '#1890ff' } }}
            >
                <p style={{ fontSize: '16px' }}>
                    Are you sure you want to delete this category? All products
                    related to this category will be deleted as well. This
                    action cannot be undone.
                </p>
            </Modal>
            {isLoading ? (
                <center>
                    <Spin
                        indicator={
                            <LoadingOutlined
                                style={{ fontSize: 28, color: '#832729' }}
                                spin
                            />
                        }
                    />
                </center>
            ) : data.length > 0 ? (
                <Table
                    // bordered={true}
                    // style={{marginRight:'20px'}}
                    rowKey="category_id"
                    size="small"
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                    }}
                />
            ) : (
                <Empty description="No categories found!" />
            )}
        </>
    )
}
export default ProductTable
