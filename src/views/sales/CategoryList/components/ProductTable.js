import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Badge, Button, Notification, toast } from 'components/ui'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts, setTableData } from '../store/dataSlice'
// import { setSelectedProduct } from '../store/stateSlice'
// import { toggleDeleteConfirmation } from '../store/stateSlice'
// import useThemeClass from 'utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import { Table, Space, message, Modal, Form, Input, Upload } from 'antd'
import appConfig from 'configs/app.config'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { UploadOutlined } from '@ant-design/icons'

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e
    }
    return e && e.fileList
}

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        message.error('Image must be smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
}
const ProductTable = () => {
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [deleteCategoryId, setDeleteCategoryId] = useState(null)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [form] = Form.useForm()
    const [imageUrl, setImageUrl] = useState(null)
    const [loading, setLoading] = useState(false)

    const tableRef = useRef(null)

    const dispatch = useDispatch()
    // const loading = useSelector((state) => state.salesProductList.data.loading)
    const data = useSelector((state) => state.salesProductList.data.productList)
    // console.log(data)
    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = () => {
        dispatch(getProducts())
    }
    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            setImageUrl(`${appConfig.apiPrefix}` + info.file.response.url)
            setLoading(false)
        }
    }

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )

    const handleEdit = (record) => {
        setEditingCategory(record)
        setImageUrl(`${appConfig.apiPrefix}/` + record.category_image) // Display previous image
        setShowEditModal(true)
        form.setFieldsValue({
            categoryName: record.categoryName,
        })
    }

    const handleEditSubmit = async (values) => {
        try {
            //
            const formData = new FormData()
            formData.append('categoryName', values.categoryName)
            formData.append(
                'category_image',
                values.category_image[0]?.originFileObj
            )
            //
            const response = await fetch(
                `${appConfig.apiPrefix}/update-category/${editingCategory.categoryID}`,
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
            dataIndex: 'categoryID',
            key: 'categoryID',
            // sorter: (a, b) => a.categoryID - b.categoryID,
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
            dataIndex: 'categoryName',
            key: 'categoryName',
            // sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
        },
        // {
        //     title: 'Image',
        //     dataIndex: 'category_image',
        //     key: 'category_image',
        //     render: (imageUrl) => (
        //         <a
        //             href={`${appConfig.imgPrefix}/${imageUrl}`}
        //             target="_blank"
        //             rel="noopener noreferrer"
        //             style={{ color: 'blue' }}
        //         >
        //             View Image
        //         </a>
        //     ),
        // },
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
        setDeleteCategoryId(record.categoryID)
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
                footer={null}
            >
                <Form form={form} onFinish={handleEditSubmit} layout="vertical">
                    <Form.Item
                        label="Category Name"
                        name="categoryName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input category name',
                            },
                        ]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        label="Category Image"
                        name="category_image"
                        // valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            maxCount={1}
                            name="category_image"
                            // listType="picture-card"
                            // className="avatar-uploader"
                            listType="picture-card"
                            accept="image/*"
                            showUploadList={true}
                            // action={`${appConfig.apiPrefix}/upload-category-image`}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {imageUrl ? (
                                uploadButton
                            ) : (
                                <img
                                    // src={imageUrl}
                                    // alt="avatar"
                                    style={{ width: '100%' }}
                                />
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            className="mr-2 mb-2"
                            variant="solid"
                            color="green-600"
                            // loading={loading}
                            htmlType="submit"
                        >
                            Save
                        </Button>
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
                bordered={true}
                // style={{marginRight:'20px'}}
                size="small"
                columns={columns}
                dataSource={data}
                pagination={true} // Remove this line if you want pagination
            />
        </>
    )
}

export default ProductTable
