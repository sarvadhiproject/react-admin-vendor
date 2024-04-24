import React, { useEffect, useState, useRef } from 'react'
import { Avatar, Badge, Button, Notification, toast } from 'components/ui'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../store/dataSlice'
import { Table, Space, message, Modal, Form, Input, Upload } from 'antd'
import appConfig from 'configs/app.config'
import { UploadOutlined } from '@ant-design/icons'

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
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [deleteCategoryId, setDeleteCategoryId] = useState(null)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [form] = Form.useForm()
    const [imageUrl, setImageUrl] = useState(null)
    const [fileList, setFileList] = useState([])

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
            //
            const formData = new FormData()
            formData.append('category_name', values.category_name)
            formData.append(
                'category_image',
                values.category_image[0]?.originFileObj
            )
            //
            const response = await fetch(
                `${appConfig.apiPrefix}/update-category/${editingCategory.category_id}`,
                {
                    method: 'PUT',
                    body: formData,
                }
            )
            if (!response.ok) {
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
            setShowEditModal(false)
            fetchData()
        } catch (error) {
            toast.push(
                <Notification
                    title={'Failed to update category'}
                    type="danger"
                    duration={2500}
                >
                    {error.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }
    const columns = [
        {
            // title: 'Category ID',
            title: '#',
            dataIndex: 'category_id',
            key: 'category_id',
            // sorter: (a, b) => a.category_id - b.category_id,
            render: (text, record, index) => index + 1,
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
                        <HiOutlinePencil
                            size={20}
                            style={{
                                marginLeft: '20px',
                                color: 'blue',
                                cursor: 'pointer',
                                marginRight: '10px',
                            }}
                        />
                    </span>
                    <span
                        className="action-icon"
                        onClick={() => handleDelete(record)}
                    >
                        <HiOutlineTrash
                            size={20}
                            style={{ color: 'red', cursor: 'pointer' }}
                        />
                    </span>
                </Space>
            ),
        },
    ]

    const handleDelete = (record) => {
        console.log('Delete:', record)
        setDeleteCategoryId(record.category_id)
        setShowConfirmation(true)
    }

    const handleDeleteConfirmation = async () => {
        try {
            const response = await fetch(
                `${appConfig.apiPrefix}/delete-category/${deleteCategoryId}`,
                {
                    method: 'DELETE',
                }
            )
            if (!response.ok) {
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
            setShowConfirmation(false)
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
        }
    }

    return (
        <>
            <Modal
                title="Edit Category"
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
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => form.submit()}
                        style={{ backgroundColor: 'blue', color: 'white' }}
                    >
                        Save
                    </Button>,
                ]}
            >
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
            </Modal>
            <Modal
                title="Confirm Deletion"
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
                    Are you sure you want to delete this category? All record
                    related to this category will be deleted as well. This
                    action cannot be undone.
                </p>
            </Modal>

            <Table
                // bordered={true}
                // style={{marginRight:'20px'}}
                rowKey="category_id"
                size="small"
                columns={columns}
                dataSource={data}
                pagination={true}
            />
        </>
    )
}
export default ProductTable
