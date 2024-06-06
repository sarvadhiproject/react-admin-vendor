import React, { useState, useEffect, useMemo } from 'react'
import {
    Form,
    Input,
    Table,
    Tooltip,
    Modal,
    Spin,
    Checkbox,
    Upload,
    message,
    Col,
    Row,
} from 'antd'
import {
    EditOutlined,
    LoadingOutlined,
    UploadOutlined,
} from '@ant-design/icons'
import { HiOutlineTrash, HiPlusCircle } from 'react-icons/hi'
import { Button, Notification, toast } from 'components/ui'
import axios from 'axios'
import appConfig from 'configs/app.config'

const authData = JSON.parse(localStorage.getItem('admin')).auth
const authData1 = JSON.parse(authData)
const token = authData1.session.token

const Banner = () => {
    const [banners, setBanners] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddBannerOpen, setIsAddBannerOpen] = useState(false)
    const [isEditBannerOpen, setIsEditBannerOpen] = useState(false)
    const [editingBanner, setEditingBanner] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [form] = Form.useForm()
    const [fileList, setFileList] = useState([])

    useEffect(() => {
        fetchBanners()
    }, [])

    const fetchBanners = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${appConfig.apiPrefix}/banner`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setBanners(response.data.data)
        } catch (err) {
            setError('Failed to fetch banners')
            toast.push(
                <Notification
                    title={'Failed to fetch banners'}
                    type="danger"
                    duration={2500}
                >
                    {err.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddBanner = async () => {
        setIsSaving(true)
        try {
            const headers = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }

            const values = await form.validateFields()
            const data = new FormData()
            data.append('title', values.title)
            data.append('is_active', values.is_active ? 'true' : 'false')
            fileList.forEach((file) => {
                data.append('image_url', file.originFileObj)
            })

            await axios.post(`${appConfig.apiPrefix}/banner/add`, data, headers)
            toast.push(
                <Notification
                    title={'Successfully added'}
                    type="success"
                    duration={2500}
                >
                    Banner added successfully
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            fetchBanners()
            setIsAddBannerOpen(false)
            form.resetFields()
            setFileList([])
        } catch (error) {
            toast.push(
                <Notification
                    title={'Failed to add banner'}
                    type="danger"
                    duration={2500}
                >
                    Please try again later
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setIsSaving(false)
        }
    }

    const handleUpdateBanner = async () => {
        setIsSaving(true)
        try {
            const headers = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }

            const values = await form.validateFields()
            const data = new FormData()
            data.append('title', values.title)
            data.append('is_active', values.is_active ? 'true' : 'false')
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    data.append('image_url', file.originFileObj)
                }
            })

            await axios.put(
                `${appConfig.apiPrefix}/banner/update/${editingBanner.banner_id}`,
                data,
                headers
            )
            toast.push(
                <Notification
                    title={'Successfully updated'}
                    type="success"
                    duration={2500}
                >
                    Banner updated successfully
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            fetchBanners()
            setIsEditBannerOpen(false)
            setEditingBanner(null)
            form.resetFields()
            setFileList([])
        } catch (error) {
            toast.push(
                <Notification
                    title={'Failed to update banner'}
                    type="danger"
                    duration={2500}
                >
                    Please try again later
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteBanner = async (bannerId) => {
        const headers = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        Modal.confirm({
            title: 'Are you sure you want to delete this banner?',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await axios.delete(
                        `${appConfig.apiPrefix}/banner/delete/${bannerId}`,
                        headers
                    )
                    toast.push(
                        <Notification
                            title={'Successfully deleted'}
                            type="success"
                            duration={2500}
                        >
                            Banner deleted successfully
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                    fetchBanners()
                } catch (error) {
                    toast.push(
                        <Notification
                            title={'Failed to delete banner'}
                            type="danger"
                            duration={2500}
                        >
                            {error.message} - Please try again later
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                }
            },
        })
    }

    const filteredBanners = useMemo(() => {
        return banners.filter((banner) =>
            banner.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [banners, searchQuery])

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

    const handleUploadChange = (info) => {
        setFileList(info.fileList)
    }

    const handleImagePreview = (imageUrl) => {
        const newTab = window.open()
        newTab.document.write(`<img src="${imageUrl}" />`)
    }

    const indexStart = useMemo(() => {
        const pageSize = 10
        return (currentPage - 1) * pageSize
    }, [currentPage])

    const columns = [
        {
            title: '#',
            dataIndex: 'banner_id',
            key: 'banner_id',
            render: (text, record, index) => (
                <span style={{ color: '#666' }}>{indexStart + index + 1}</span>
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image_url',
            render: (text) => (
                <img
                    src={`${appConfig.imgPrefix}/${text}`}
                    alt="Banner"
                    style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        cursor: 'pointer',
                    }}
                    onClick={() =>
                        handleImagePreview(`${appConfig.imgPrefix}/${text}`)
                    }
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (text) => (
                <span style={{ color: '#666' }}>
                    {text ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex' }}>
                    <Tooltip title="Edit banner">
                        <EditOutlined
                            style={{
                                marginRight: '20px',
                                color: '#022B4E',
                                fontSize: '18px',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                setEditingBanner(record)
                                setIsEditBannerOpen(true)
                                form.setFieldsValue({
                                    ...record,
                                })
                                setFileList(
                                    record.image_url
                                        ? [
                                              {
                                                  uid: '-1',
                                                  name: 'image.jpg',
                                                  status: 'done',
                                                  url: `${appConfig.imgPrefix}/${record.image_url}`,
                                              },
                                          ]
                                        : []
                                )
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete banner">
                        <HiOutlineTrash
                            style={{
                                color: 'red',
                                fontSize: '18px',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleDeleteBanner(record.banner_id)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ]

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                {/* <h3 style={{ color: '#022B4E' }}>Banners</h3> */}
                <h3 style={{ color: '#832729' }}>Banners</h3>
                <div className="flex items-center">
                    <Input.Search
                        placeholder="Search banner.."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ marginRight: '1rem' }}
                        size="large"
                    />
                    <Button
                        onClick={() => {
                            setIsAddBannerOpen(true)
                            form.resetFields()
                            setFileList([]) // Reset file list when adding a new banner
                        }}
                        block
                        variant="solid"
                        size="sm"
                        style={{ width: '150px', backgroundColor: '#832729' }}
                        icon={<HiPlusCircle />}
                    >
                        Add Banner
                    </Button>
                </div>
            </div>
            {isLoading ? (
                <Spin
                    indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                />
            ) : (
                <Table
                    dataSource={filteredBanners.map((banner) => ({
                        ...banner,
                        key: banner.banner_id,
                    }))}
                    columns={columns}
                    rowKey="banner_id"
                    pagination={{
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                    }}
                />
            )}

            {/* Add Banner Modal */}
            <Modal
                title="Add Banner"
                visible={isAddBannerOpen}
                onCancel={() => {
                    setIsAddBannerOpen(false)
                    form.resetFields()
                    setFileList([]) // Reset file list when closing the modal
                }}
                onOk={handleAddBanner}
                okButtonProps={{
                    style: {
                        // backgroundColor: '#022B4E',
                        // borderColor: '#022B4E',
                        backgroundColor: '#832729',
                        borderColor: '#832729',
                    },
                    loading: isSaving,
                }}
                okText={isSaving ? 'Adding...' : 'Add'}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the banner title',
                            },
                        ]}
                    >
                        <Input style={{ width: '70%' }} placeholder="Title" />
                    </Form.Item>

                    <Form.Item
                        name="image_url"
                        label="Banner Image"
                        rules={[
                            {
                                required: true,
                                message: 'Please upload a banner image',
                            },
                        ]}
                    >
                        <Upload
                            maxCount={1}
                            listType="picture-card"
                            accept="image/*"
                            onPreview={handlePreview}
                            onChange={handleUploadChange}
                            fileList={fileList}
                            beforeUpload={() => false} // Return false to prevent default file upload behavior
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Row align="middle">
                        <Col>
                            <Form.Item
                                name="is_active"
                                valuePropName="checked"
                                style={{ marginBottom: 0 }}
                            >
                                <Checkbox />
                            </Form.Item>
                        </Col>
                        <Col>
                            <span style={{ marginLeft: '8px' }}>Active</span>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Edit Banner Modal */}
            <Modal
                title="Edit Banner"
                visible={isEditBannerOpen}
                onCancel={() => {
                    setIsEditBannerOpen(false)
                    setEditingBanner(null)
                    form.resetFields()
                    setFileList([]) // Reset file list when closing the modal
                }}
                onOk={handleUpdateBanner}
                okButtonProps={{
                    style: {
                        // backgroundColor: '#022B4E',
                        // borderColor: '#022B4E',
                        backgroundColor: '#832729',
                        borderColor: '#832729',
                    },
                    loading: isSaving,
                }}
                okText={isSaving ? 'Updating...' : 'Update'}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the banner title',
                            },
                        ]}
                    >
                        <Input style={{ width: '70%' }} placeholder="Title" />
                    </Form.Item>

                    <Form.Item
                        name="image_url"
                        label="Banner Image"
                        rules={[
                            {
                                required: true,
                                message: 'Please upload a banner image',
                            },
                        ]}
                    >
                        <Upload
                            maxCount={1}
                            listType="picture-card"
                            accept="image/*"
                            onChange={handleUploadChange}
                            fileList={fileList}
                            beforeUpload={() => false} // Return false to prevent default file upload behavior
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Row align="middle">
                        <Col>
                            <Form.Item
                                name="is_active"
                                valuePropName="checked"
                                style={{ marginBottom: 0 }}
                            >
                                <Checkbox />
                            </Form.Item>
                        </Col>
                        <Col>
                            <span style={{ marginLeft: '8px' }}>Active</span>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default Banner
