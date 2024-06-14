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
    Select,
    message,
    Col,
    Row,
    Empty,
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
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchCategory, setSearchCategory] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
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
            const response = await axios.get(
                `${appConfig.apiPrefix}/banner/all-banners`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setBanners(response.data.data)
        } catch (err) {
            toast.push(
                <Notification
                    title={'Failed to fetch banners'}
                    type="danger"
                    duration={2500}
                >
                    {err.message} - Please try again later
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
                Authorization: `Bearer ${token}`,
            }
            const values = await form.validateFields()
            const data = new FormData()
            data.append('title', values.title)
            data.append('category', values.category)
            data.append('is_active', values.is_active ? 'true' : 'false')
            fileList.forEach((file) => {
                data.append('image_url', file.originFileObj)
            })
            await axios.post(`${appConfig.apiPrefix}/banner/add`, data, {
                headers,
            })
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
                Authorization: `Bearer ${token}`,
            }
            const values = await form.validateFields()
            const data = new FormData()
            data.append('title', values.title)
            data.append('category', values.category)
            data.append('is_active', values.is_active ? 'true' : 'false')
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    data.append('image_url', file.originFileObj)
                }
            })
            await axios.put(
                `${appConfig.apiPrefix}/banner/update/${editingBanner?.banner_id}`,
                data,
                { headers }
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
            Authorization: `Bearer ${token}`,
        }
        Modal.confirm({
            title: 'Are you sure you want to delete this banner?',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await axios.delete(
                        `${appConfig.apiPrefix}/banner/delete/${bannerId}`,
                        { headers }
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
        return banners.filter((banner) => {
            const titleMatch = banner.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            const categoryMatch = searchCategory
                ? banner.category === searchCategory
                : true
            const statusMatch = searchStatus
                ? searchStatus === 'active'
                    ? banner.is_active
                    : !banner.is_active
                : true
            return titleMatch && categoryMatch && statusMatch
        })
    }, [banners, searchQuery, searchCategory, searchStatus])

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
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: (a, b) => a.category.localeCompare(b.category),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image_url',
            render: (text) => (
                <img
                    src={`${text}`}
                    alt="Banner"
                    style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleImagePreview(`${text}`)}
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value, record) => record.is_active === value,
            render: (text) => (
                <span style={{ color: '#666' }}>
                    {text ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            title: 'Created Date/Time',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (text) => (
                <span style={{ color: '#666' }}>
                    {new Date(text).toLocaleString('en-GB')}
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
                                form.setFieldsValue({ ...record })
                                setFileList(
                                    record.image_url
                                        ? [
                                              {
                                                  uid: '-1',
                                                  name: 'image.jpg',
                                                  status: 'done',
                                                  url: `${record.image_url}`,
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
                <h3 style={{ color: '#832729' }}>Banners</h3>
                <div className="flex items-center">
                    <Input.Search
                        placeholder="Search by title.."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ marginRight: '1rem' }}
                        size="large"
                    />
                    <Select
                        placeholder="Select Category"
                        value={searchCategory}
                        onChange={setSearchCategory}
                        style={{ marginRight: '1rem', width: '200px' }}
                        size="large"
                    >
                        <Select.Option value="">All Categories</Select.Option>
                        <Select.Option value="general">General</Select.Option>
                        <Select.Option value="ring">Ring</Select.Option>
                        <Select.Option value="earring">Earring</Select.Option>
                        <Select.Option value="bracelet">Bracelet</Select.Option>
                        <Select.Option value="chain">Chain</Select.Option>
                        <Select.Option value="pendant">Pendant</Select.Option>
                        <Select.Option value="bangles">Bangles</Select.Option>
                        <Select.Option value="necklace">Necklace</Select.Option>
                    </Select>
                    <Select
                        placeholder="Select Status"
                        value={searchStatus}
                        onChange={setSearchStatus}
                        style={{ marginRight: '1rem', width: '200px' }}
                        size="large"
                    >
                        <Select.Option value="">All Statuses</Select.Option>
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="inactive">Inactive</Select.Option>
                    </Select>
                    <Button
                        onClick={() => {
                            setIsAddBannerOpen(true)
                            form.resetFields()
                            setFileList([])
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
                        <LoadingOutlined
                            style={{ fontSize: 28, color: '#832729' }}
                            spin
                        />
                    }
                />
            ) : filteredBanners.length === 0 ? (
                searchQuery ? (
                    <Empty
                        description={`No banners found for "${searchQuery}"`}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <Empty description="No banners available" />
                )
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

            <Modal
                title="Add Banner"
                visible={isAddBannerOpen}
                onCancel={() => {
                    setIsAddBannerOpen(false)
                    form.resetFields()
                    setFileList([])
                }}
                onOk={handleAddBanner}
                okButtonProps={{
                    style: {
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
                        name="category"
                        label="Category"
                        rules={[
                            {
                                required: true,
                                message: 'Please select the banner category',
                            },
                        ]}
                    >
                        <Select
                            style={{ width: '70%' }}
                            placeholder="Select Category"
                        >
                            <Select.Option value="general">
                                General
                            </Select.Option>
                            <Select.Option value="ring">Ring</Select.Option>
                            <Select.Option value="earring">
                                Earring
                            </Select.Option>
                            <Select.Option value="bracelet">
                                Bracelet
                            </Select.Option>
                            <Select.Option value="chain">Chain</Select.Option>
                            <Select.Option value="pendant">
                                Pendant
                            </Select.Option>
                            <Select.Option value="bangles">
                                Bangles
                            </Select.Option>
                            <Select.Option value="necklace">
                                Necklace
                            </Select.Option>
                        </Select>
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
                            beforeUpload={() => false}
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

            <Modal
                title={<h5 style={{ color: '#832729' }}>Update Banner</h5>}
                visible={isEditBannerOpen}
                onCancel={() => {
                    setIsEditBannerOpen(false)
                    setEditingBanner(null)
                    form.resetFields()
                    setFileList([])
                }}
                onOk={handleUpdateBanner}
                okButtonProps={{
                    style: {
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
                        name="category"
                        label="Category"
                        rules={[
                            {
                                required: true,
                                message: 'Please select the banner category',
                            },
                        ]}
                    >
                        <Select
                            style={{ width: '70%' }}
                            placeholder="Select Category"
                        >
                            <Select.Option value="general">
                                General
                            </Select.Option>
                            <Select.Option value="ring">Ring</Select.Option>
                            <Select.Option value="earring">
                                Earring
                            </Select.Option>
                            <Select.Option value="bracelet">
                                Bracelet
                            </Select.Option>
                            <Select.Option value="chain">Chain</Select.Option>
                            <Select.Option value="pendant">
                                Pendant
                            </Select.Option>
                            <Select.Option value="bangles">
                                Bangles
                            </Select.Option>
                            <Select.Option value="necklace">
                                Necklace
                            </Select.Option>
                        </Select>
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
                            beforeUpload={() => false}
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

// import React, { useState, useEffect, useMemo } from 'react'
// import {
//     Form,
//     Input,
//     Table,
//     Tooltip,
//     Modal,
//     Spin,
//     Checkbox,
//     Upload,
//     Select,
//     message,
//     Col,
//     Row,
//     Empty,
// } from 'antd'
// import {
//     EditOutlined,
//     LoadingOutlined,
//     UploadOutlined,
// } from '@ant-design/icons'
// import { HiOutlineTrash, HiPlusCircle } from 'react-icons/hi'
// import { Button, Notification, toast } from 'components/ui'
// import axios from 'axios'
// import appConfig from 'configs/app.config'

// const authData = JSON.parse(localStorage.getItem('admin')).auth
// const authData1 = JSON.parse(authData)
// const token = authData1.session.token

// const Banner = () => {
//     const [banners, setBanners] = useState([])
//     const [isLoading, setIsLoading] = useState(true)
//     const [currentPage, setCurrentPage] = useState(1)
//     const [searchQuery, setSearchQuery] = useState('')
//     const [isAddBannerOpen, setIsAddBannerOpen] = useState(false)
//     const [isEditBannerOpen, setIsEditBannerOpen] = useState(false)
//     const [editingBanner, setEditingBanner] = useState(null)
//     const [isSaving, setIsSaving] = useState(false)
//     const [form] = Form.useForm()
//     const [fileList, setFileList] = useState([])

//     useEffect(() => {
//         fetchBanners()
//     }, [])

//     const fetchBanners = async () => {
//         setIsLoading(true)
//         try {
//             const response = await axios.get(`${appConfig.apiPrefix}/banner/all-banners`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             })
//             setBanners(response.data.data)
//         } catch (err) {
//             toast.push(
//                 <Notification
//                     title={'Failed to fetch banners'}
//                     type="danger"
//                     duration={2500}
//                 >
//                     {err.message}
//                 </Notification>,
//                 {
//                     placement: 'top-center',
//                 }
//             )
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     const handleAddBanner = async () => {
//         setIsSaving(true)
//         try {
//             const headers = {
//                 Authorization: `Bearer ${token}`,
//             }
//             const values = await form.validateFields()
//             const data = new FormData()
//             data.append('title', values.title)
//             data.append('category', values.category)
//             data.append('is_active', values.is_active ? 'true' : 'false')
//             fileList.forEach((file) => {
//                 data.append('image_url', file.originFileObj)
//             })
//             await axios.post(`${appConfig.apiPrefix}/banner/add`, data, {
//                 headers,
//             })
//             toast.push(
//                 <Notification
//                     title={'Successfully added'}
//                     type="success"
//                     duration={2500}
//                 >
//                     Banner added successfully
//                 </Notification>,
//                 {
//                     placement: 'top-center',
//                 }
//             )
//             fetchBanners()
//             setIsAddBannerOpen(false)
//             form.resetFields()
//             setFileList([])
//         } catch (error) {
//             toast.push(
//                 <Notification
//                     title={'Failed to add banner'}
//                     type="danger"
//                     duration={2500}
//                 >
//                     Please try again later
//                 </Notification>,
//                 {
//                     placement: 'top-center',
//                 }
//             )
//         } finally {
//             setIsSaving(false)
//         }
//     }

//     const handleUpdateBanner = async () => {
//         setIsSaving(true)
//         try {
//             const headers = {
//                 Authorization: `Bearer ${token}`,
//             }
//             const values = await form.validateFields()
//             const data = new FormData()
//             data.append('title', values.title)
//             data.append('category', values.category)
//             data.append('is_active', values.is_active ? 'true' : 'false')
//             fileList.forEach((file) => {
//                 if (file.originFileObj) {
//                     data.append('image_url', file.originFileObj)
//                 }
//             })
//             await axios.put(
//                 `${appConfig.apiPrefix}/banner/update/${editingBanner?.banner_id}`,
//                 data,
//                 { headers }
//             )
//             toast.push(
//                 <Notification
//                     title={'Successfully updated'}
//                     type="success"
//                     duration={2500}
//                 >
//                     Banner updated successfully
//                 </Notification>,
//                 {
//                     placement: 'top-center',
//                 }
//             )
//             fetchBanners()
//             setIsEditBannerOpen(false)
//             setEditingBanner(null)
//             form.resetFields()
//             setFileList([])
//         } catch (error) {
//             toast.push(
//                 <Notification
//                     title={'Failed to update banner'}
//                     type="danger"
//                     duration={2500}
//                 >
//                     Please try again later
//                 </Notification>,
//                 {
//                     placement: 'top-center',
//                 }
//             )
//         } finally {
//             setIsSaving(false)
//         }
//     }

//     const handleDeleteBanner = async (bannerId) => {
//         const headers = {
//             Authorization: `Bearer ${token}`,
//         }
//         Modal.confirm({
//             title: 'Are you sure you want to delete this banner?',
//             okText: 'Delete',
//             okType: 'danger',
//             onOk: async () => {
//                 try {
//                     await axios.delete(
//                         `${appConfig.apiPrefix}/banner/delete/${bannerId}`,
//                         { headers }
//                     )
//                     toast.push(
//                         <Notification
//                             title={'Successfully deleted'}
//                             type="success"
//                             duration={2500}
//                         >
//                             Banner deleted successfully
//                         </Notification>,
//                         {
//                             placement: 'top-center',
//                         }
//                     )
//                     fetchBanners()
//                 } catch (error) {
//                     toast.push(
//                         <Notification
//                             title={'Failed to delete banner'}
//                             type="danger"
//                             duration={2500}
//                         >
//                             {error.message} - Please try again later
//                         </Notification>,
//                         {
//                             placement: 'top-center',
//                         }
//                     )
//                 }
//             },
//         })
//     }

//     const filteredBanners = useMemo(() => {
//         return banners.filter((banner) =>
//             banner.title.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//     }, [banners, searchQuery])

//     const handlePreview = (file) => {
//         if (file.type?.startsWith('image/')) {
//             const reader = new FileReader()
//             reader.onload = () => {
//                 const imageUrl = reader.result
//                 if (imageUrl) {
//                     const newTab = window.open()
//                     newTab.document.write(`<img src="${imageUrl}" />`)
//                 } else {
//                     message.error('Failed to generate preview')
//                 }
//             }
//             reader.readAsDataURL(file.originFileObj)
//         } else {
//             message.error('Only image files can be previewed')
//         }
//     }

//     const handleUploadChange = (info) => {
//         setFileList(info.fileList)
//     }

//     const handleImagePreview = (imageUrl) => {
//         const newTab = window.open()
//         newTab.document.write(`<img src="${imageUrl}" />`)
//     }

//     const indexStart = useMemo(() => {
//         const pageSize = 10
//         return (currentPage - 1) * pageSize
//     }, [currentPage])

//     const columns = [
//         {
//             title: '#',
//             dataIndex: 'banner_id',
//             key: 'banner_id',
//             render: (text, record, index) => (
//                 <span style={{ color: '#666' }}>{indexStart + index + 1}</span>
//             ),
//         },
//         {
//             title: 'Title',
//             dataIndex: 'title',
//             key: 'title',
//             render: (text) => <span style={{ color: '#666' }}>{text}</span>,
//         },
//         {
//             title: 'Category',
//             dataIndex: 'category',
//             key: 'category',
//             render: (text) => <span style={{ color: '#666' }}>{text}</span>,
//         },
//         {
//             title: 'Image',
//             dataIndex: 'image_url',
//             key: 'image_url',
//             render: (text) => (
//                 <img
//                     src={`${text}`}
//                     alt="Banner"
//                     style={{
//                         maxWidth: '200px',
//                         maxHeight: '200px',
//                         cursor: 'pointer',
//                     }}
//                     onClick={() =>
//                         handleImagePreview(`${text}`)
//                     }
//                 />
//             ),
//         },
//         {
//             title: 'Status',
//             dataIndex: 'is_active',
//             key: 'is_active',
//             render: (text) => (
//                 <span style={{ color: '#666' }}>
//                     {text ? 'Active' : 'Inactive'}
//                 </span>
//             ),
//         },
//         {
//             title: 'Created Date/Time',
//             dataIndex: 'createdAt',
//             render: (text) => (
//                 <span style={{ color: '#666' }}>
//                     {new Date(text).toLocaleString('en-GB')}
//                 </span>
//             ),
//             sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
//         },
//         {
//             title: 'Action',
//             key: 'action',
//             render: (_, record) => (
//                 <div style={{ display: 'flex' }}>
//                     <Tooltip title="Edit banner">
//                         <EditOutlined
//                             style={{
//                                 marginRight: '20px',
//                                 color: '#022B4E',
//                                 fontSize: '18px',
//                                 cursor: 'pointer',
//                             }}
//                             onClick={() => {
//                                 setEditingBanner(record)
//                                 setIsEditBannerOpen(true)
//                                 form.setFieldsValue({ ...record })
//                                 setFileList(
//                                     record.image_url
//                                         ? [
//                                               {
//                                                   uid: '-1',
//                                                   name: 'image.jpg',
//                                                   status: 'done',
//                                                   url: `${record.image_url}`,
//                                               },
//                                           ]
//                                         : []
//                                 )
//                             }}
//                         />
//                     </Tooltip>
//                     <Tooltip title="Delete banner">
//                         <HiOutlineTrash
//                             style={{
//                                 color: 'red',
//                                 fontSize: '18px',
//                                 cursor: 'pointer',
//                             }}
//                             onClick={() => handleDeleteBanner(record.banner_id)}
//                         />
//                     </Tooltip>
//                 </div>
//             ),
//         },
//     ]

//     const uploadButton = (
//         <div>
//             <UploadOutlined />
//             <div style={{ marginTop: 8 }}>Upload</div>
//         </div>
//     )

//     return (
//         <>
//             <div className="flex justify-between items-center mb-6">
//                 {/* <h3 style={{ color: '#022B4E' }}>Banners</h3> */}
//                 <h3 style={{ color: '#832729' }}>Banners</h3>
//                 <div className="flex items-center">
//                     <Input.Search
//                         placeholder="Search banner.."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         style={{ marginRight: '1rem' }}
//                         size="large"
//                     />
//                     <Button
//                         onClick={() => {
//                             setIsAddBannerOpen(true)
//                             form.resetFields()
//                             setFileList([])
//                         }}
//                         block
//                         variant="solid"
//                         size="sm"
//                         style={{ width: '150px', backgroundColor: '#832729' }}
//                         icon={<HiPlusCircle />}
//                     >
//                         Add Banner
//                     </Button>
//                 </div>
//             </div>
//             {isLoading ? (
//                 <Spin
//                     indicator={
//                         <LoadingOutlined
//                             style={{ fontSize: 28, color: '#832729' }}
//                             spin
//                         />
//                     }
//                 />
//             ) : filteredBanners.length === 0 ? (
//                 searchQuery ? (
//                     <Empty
//                         description={`No banners found for "${searchQuery}"`}
//                         image={Empty.PRESENTED_IMAGE_SIMPLE}
//                     />
//                 ) : (
//                     <Empty description="No banners available" />
//                 )
//             ) : (
//                 <Table
//                     dataSource={filteredBanners.map((banner) => ({
//                         ...banner,
//                         key: banner.banner_id,
//                     }))}
//                     columns={columns}
//                     rowKey="banner_id"
//                     pagination={{
//                         current: currentPage,
//                         onChange: (page) => setCurrentPage(page),
//                     }}
//                 />
//             )}

//             <Modal
//                 title="Add Banner"
//                 visible={isAddBannerOpen}
//                 onCancel={() => {
//                     setIsAddBannerOpen(false)
//                     form.resetFields()
//                     setFileList([])
//                 }}
//                 onOk={handleAddBanner}
//                 okButtonProps={{
//                     style: {
//                         backgroundColor: '#832729',
//                         borderColor: '#832729',
//                     },
//                     loading: isSaving,
//                 }}
//                 okText={isSaving ? 'Adding...' : 'Add'}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         name="title"
//                         label="Title"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: 'Please enter the banner title',
//                             },
//                         ]}
//                     >
//                         <Input style={{ width: '70%' }} placeholder="Title" />
//                     </Form.Item>
//                     <Form.Item
//                         name="category"
//                         label="Category"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: 'Please select the banner category',
//                             },
//                         ]}
//                     >
//                         <Select
//                             style={{ width: '70%' }}
//                             placeholder="Select Category"
//                         >
//                             <Select.Option value="general">General</Select.Option>
//                             <Select.Option value="ring">Ring</Select.Option>
//                             <Select.Option value="earring">Earring</Select.Option>
//                             <Select.Option value="bracelet">Bracelet</Select.Option>
//                             <Select.Option value="chain">Chain</Select.Option>
//                             <Select.Option value="pendant">Pendant</Select.Option>
//                             <Select.Option value="bangles">Bangles</Select.Option>
//                             <Select.Option value="necklace">Necklace</Select.Option>
//                         </Select>
//                     </Form.Item>
//                     <Form.Item
//                         name="image_url"
//                         label="Banner Image"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: 'Please upload a banner image',
//                             },
//                         ]}
//                     >
//                         <Upload
//                             maxCount={1}
//                             listType="picture-card"
//                             accept="image/*"
//                             onPreview={handlePreview}
//                             onChange={handleUploadChange}
//                             fileList={fileList}
//                             beforeUpload={() => false}
//                         >
//                             {fileList.length >= 1 ? null : uploadButton}
//                         </Upload>
//                     </Form.Item>
//                     <Row align="middle">
//                         <Col>
//                             <Form.Item
//                                 name="is_active"
//                                 valuePropName="checked"
//                                 style={{ marginBottom: 0 }}
//                             >
//                                 <Checkbox />
//                             </Form.Item>
//                         </Col>
//                         <Col>
//                             <span style={{ marginLeft: '8px' }}>Active</span>
//                         </Col>
//                     </Row>
//                 </Form>
//             </Modal>

//             <Modal
//                 title={<h5 style={{ color: '#832729' }}>Update Banner</h5>}
//                 visible={isEditBannerOpen}
//                 onCancel={() => {
//                     setIsEditBannerOpen(false)
//                     setEditingBanner(null)
//                     form.resetFields()
//                     setFileList([])
//                 }}
//                 onOk={handleUpdateBanner}
//                 okButtonProps={{
//                     style: {
//                         backgroundColor: '#832729',
//                         borderColor: '#832729',
//                     },
//                     loading: isSaving,
//                 }}
//                 okText={isSaving ? 'Updating...' : 'Update'}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         name="title"
//                         label="Title"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: 'Please enter the banner title',
//                             },
//                         ]}
//                     >
//                         <Input style={{ width: '70%' }} placeholder="Title" />
//                     </Form.Item>
//                     <Form.Item
//                         name="category"
//                         label="Category"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: 'Please select the banner category',
//                             },
//                         ]}
//                     >
//                         <Select
//                             style={{ width: '70%' }}
//                             placeholder="Select Category"
//                         >
//                             <Select.Option value="general">General</Select.Option>
//                             <Select.Option value="ring">Ring</Select.Option>
//                             <Select.Option value="earring">Earring</Select.Option>
//                             <Select.Option value="bracelet">Bracelet</Select.Option>
//                             <Select.Option value="chain">Chain</Select.Option>
//                             <Select.Option value="pendant">Pendant</Select.Option>
//                             <Select.Option value="bangles">Bangles</Select.Option>
//                             <Select.Option value="necklace">Necklace</Select.Option>
//                         </Select>
//                     </Form.Item>
//                     <Form.Item
//                         name="image_url"
//                         label="Banner Image"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: 'Please upload a banner image',
//                             },
//                         ]}
//                     >
//                         <Upload
//                             maxCount={1}
//                             listType="picture-card"
//                             accept="image/*"
//                             onChange={handleUploadChange}
//                             fileList={fileList}
//                             beforeUpload={() => false}
//                         >
//                             {fileList.length >= 1 ? null : uploadButton}
//                         </Upload>
//                     </Form.Item>
//                     <Row align="middle">
//                         <Col>
//                             <Form.Item
//                                 name="is_active"
//                                 valuePropName="checked"
//                                 style={{ marginBottom: 0 }}
//                             >
//                                 <Checkbox />
//                             </Form.Item>
//                         </Col>
//                         <Col>
//                             <span style={{ marginLeft: '8px' }}>Active</span>
//                         </Col>
//                     </Row>
//                 </Form>
//             </Modal>
//         </>
//     )
// }

// export default Banner
