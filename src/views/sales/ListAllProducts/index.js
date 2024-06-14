import React, { useState, useEffect, useMemo } from 'react'
import { Table, Modal, Row, Col, Tooltip, Input, Empty, Spin } from 'antd'
import {
    InfoCircleTwoTone,
    LeftOutlined,
    StopOutlined,
    RightOutlined,
    LoadingOutlined,
} from '@ant-design/icons'
import appConfig from 'configs/app.config'
import axios from 'axios'
import { Notification, toast } from 'components/ui'
import NumberFormat from 'react-number-format'
import styled from 'styled-components'

const TableContainer = styled.div`
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const ProductList = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState({})
    const [vendors, setVendors] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [pageSize, setPageSize] = useState(10)

    useEffect(() => {
        axios
            .get(`${appConfig.apiPrefix}/products`)
            .then((response) => {
                if (response.data.data) {
                    setProducts(response.data.data)
                } else {
                    console.error('Invalid response format:', response.data)
                }
            })
            .catch((error) => {
                console.error('Error fetching products:', error)
                toast.push(
                    <Notification
                        title={'Failed to fetch products'}
                        type="danger"
                        duration={2500}
                    >
                        {error.message} - Please try again later
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            })
            .finally(() => setIsLoading(false))

        axios
            .get(`${appConfig.apiPrefix}/categories/get-categories`)
            .then((response) => {
                const categoriesMap = {}
                response.data.forEach((category) => {
                    categoriesMap[category.category_id] = category.category_name
                })
                setCategories(categoriesMap)
            })
            .catch((error) => {
                console.error('Error fetching categories:', error)
                toast.push(
                    <Notification
                        title={'Failed to fetch categories'}
                        type="danger"
                        duration={2500}
                    >
                        {error.message} - Please try again later
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            })

        axios
            .get(`${appConfig.apiPrefix}/vendor/active`)
            .then((response) => {
                if (
                    response.data.success &&
                    Array.isArray(response.data.activeVendors)
                ) {
                    const vendorsMap = {}
                    response.data.activeVendors.forEach((vendor) => {
                        vendorsMap[
                            vendor.vendor_id
                        ] = `${vendor.first_name} ${vendor.last_name}`
                    })
                    setVendors(vendorsMap)
                } else {
                    console.error(
                        'Error fetching active vendors:',
                        response.data
                    )
                }
            })
            .catch((error) => {
                console.error('Error fetching active vendors:', error)
                toast.push(
                    <Notification
                        title={'Failed to fetch active vendors'}
                        type="danger"
                        duration={2500}
                    >
                        {error.message} - Please try again later
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            })
    }, [])

    const handleDetailView = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const fetchProducts = () => {
        setIsLoading(true)
        axios
            .get(`${appConfig.apiPrefix}/products`)
            .then((response) => {
                if (Array.isArray(response.data.data)) {
                    setProducts(response.data.data)
                } else {
                    console.error('Invalid response format:', response.data)
                }
            })
            .catch((error) => {
                console.error('Error:', error)
                toast.push(
                    <Notification
                        title={'Failed to fetch products'}
                        type="danger"
                        duration={2500}
                    >
                        {error.message} - Please try again later
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            })
            .finally(() => setIsLoading(false))
    }

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) {
            return []
        }

        const lowercaseQuery = searchQuery.toLowerCase()
        return products.filter(
            (product) =>
                (vendors[product.vendor_id] || '')
                    .toLowerCase()
                    .includes(lowercaseQuery) ||
                product.product_name.toLowerCase().includes(lowercaseQuery)
        )
    }, [products, searchQuery, vendors])

    const handleDelete = (record) => {
        setProductToDelete(record.product_id)
        setShowConfirmModal(true)
    }

    const handlePageSizeChange = (current, size) => {
        setPageSize(Number(size))
        setCurrentPage(1) // Reset to the first page when page size changes
    }

    const handleConfirmDelete = () => {
        setIsDeleting(true)
        axios
            .delete(
                `${appConfig.apiPrefix}/products/deactivate/${productToDelete}`
            )
            .then((response) => {
                if (response.status === 200) {
                    setIsDeleting(false)
                    setShowConfirmModal(false)
                    fetchProducts()
                    toast.push(
                        <Notification
                            title={'Successfully deactivated'}
                            type="success"
                            duration={2500}
                        >
                            Product deactivated successfully
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                } else {
                    throw new Error('Failed to deactivate product')
                }
            })
            .catch((error) => {
                setIsDeleting(false)
                setShowConfirmModal(false)
                toast.push(
                    <Notification
                        title={'Unable to deactivate product'}
                        type="danger"
                        duration={2500}
                    >
                        {error.message} - Please try again later
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                console.error('Error:', error)
            })
    }

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0
                ? selectedProduct.p_images.length - 1
                : prevIndex - 1
        )
    }

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === selectedProduct.p_images.length - 1
                ? 0
                : prevIndex + 1
        )
    }

    const indexStart = useMemo(() => {
        return (currentPage - 1) * pageSize
    }, [currentPage, pageSize])

    const columns = [
        {
            title: '#',
            dataIndex: 'product_id',
            key: 'product_id',
            sorter: (a, b) => a.product_id - b.product_id,
            render: (text, record, index) => (
                <span style={{ color: '#666' }}>{indexStart + index + 1}</span>
            ),
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Category',
            dataIndex: 'category_id',
            key: 'category_id',
            render: (categoryId) => (
                <span style={{ color: '#666' }}>{categories[categoryId]}</span>
            ),
            sorter: (a, b) =>
                categories[a.category_id].localeCompare(
                    categories[b.category_id]
                ),
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor_id',
            key: 'vendor_id',
            render: (vendorId) => (
                <span style={{ color: '#666' }}>{vendors[vendorId]}</span>
            ),
            sorter: (a, b) =>
                vendors[a.vendor_id].localeCompare(vendors[b.vendor_id]),
        },
        {
            title: 'Purity',
            dataIndex: 'purity',
            key: 'purity',
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
            sorter: (a, b) => {
                const purityValues = ['24k', '22k', '18k', '14k', '10k']
                return (
                    purityValues.indexOf(a.purity) -
                    purityValues.indexOf(b.purity)
                )
            },
        },
        {
            title: 'MRP (Rs.)',
            dataIndex: 'mrp',
            key: 'mrp',
            sorter: (a, b) => a.mrp - b.mrp,
            render: (text) => (
                <NumberFormat
                    displayType="text"
                    value={(Math.round(text * 100) / 100).toFixed(2)}
                    prefix={'₹'}
                    thousandSeparator={true}
                    renderText={(value) => (
                        <span style={{ color: '#666' }}>{value}</span>
                    )}
                />
            ),
        },
        {
            title: 'Selling Price (Rs.)',
            dataIndex: 'selling_price',
            key: 'selling_price',
            sorter: (a, b) => a.selling_price - b.selling_price,
            render: (text) => (
                <NumberFormat
                    displayType="text"
                    value={(Math.round(text * 100) / 100).toFixed(2)}
                    prefix={'₹'}
                    thousandSeparator={true}
                    renderText={(value) => (
                        <span style={{ color: '#666' }}>{value}</span>
                    )}
                />
            ),
        },
        {
            title: 'Vendor Price (Rs.)',
            dataIndex: 'vendor_price',
            key: 'vendor_price',
            sorter: (a, b) => a.vendor_price - b.vendor_price,
            render: (text) => (
                <NumberFormat
                    displayType="text"
                    value={(Math.round(text * 100) / 100).toFixed(2)}
                    prefix={'₹'}
                    thousandSeparator={true}
                    renderText={(value) => (
                        <span style={{ color: '#666' }}>{value}</span>
                    )}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex' }}>
                    <Tooltip title="Detailed View">
                        <InfoCircleTwoTone
                            onClick={() => handleDetailView(record)}
                            style={{ marginRight: '20px' }}
                        />
                    </Tooltip>

                    <Tooltip title="Deactivate product">
                        <StopOutlined
                            style={{ color: 'red' }}
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ]

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                }}
            >
                {/* <h3 style={{ color: '#022B4E' }}>Manage Products</h3> */}
                <h3 style={{ color: '#832729' }}>Manage Products</h3>
                <div>
                    <Input.Search
                        placeholder="Search by vendor or product"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: 272 }}
                        size="large"
                    />
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
            ) : filteredProducts.length > 0 ? (
                <Table
                    dataSource={filteredProducts}
                    columns={columns}
                    rowKey="product_id"
                    size="small"
                    pagination={{
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                    }}
                />
            ) : products.length === 0 ? (
                <Empty description="">No products found!</Empty>
            ) : (
                <Empty description="" image={Empty.PRESENTED_IMAGE_SIMPLE}>
                    No product found for '{searchQuery}'
                </Empty>
            )}
            <Modal
                title={<h4>Confirm Deactivation</h4>}
                open={showConfirmModal}
                onOk={handleConfirmDelete}
                onCancel={() => setShowConfirmModal(false)}
                okText="Deactivate"
                cancelText="Cancel"
                okButtonProps={{
                    loading: isDeleting,
                    style: {
                        backgroundColor: 'red',
                        borderColor: 'red',
                        color: 'white',
                    },
                }}
                cancelButtonProps={{ style: { borderColor: '#1890ff' } }}
            >
                <p>
                    Are you sure you want to deactivate this product? The
                    product will no longer be visible to users. This action
                    cannot be undone.
                </p>
            </Modal>
            <Modal
                title={<h4 style={{ color: '#832729' }}>Product Details</h4>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
            >
                {selectedProduct && (
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={`${appConfig.imgPrefix}/${selectedProduct.p_images[currentImageIndex]}`}
                                    alt="Product Image"
                                    style={{ maxWidth: '100%' }}
                                />
                                <div
                                    onClick={handlePrevImage}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '10px',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.5)',
                                        borderRadius: '50%',
                                        padding: '8px',
                                        fontSize: '24px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <LeftOutlined />
                                </div>
                                <div
                                    onClick={handleNextImage}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '10px',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.5)',
                                        borderRadius: '50%',
                                        padding: '8px',
                                        fontSize: '24px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <RightOutlined />
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Product Name :{' '}
                                </span>
                                {selectedProduct.product_name}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Category :
                                </span>{' '}
                                {categories[selectedProduct.category_id]}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Vendor :{' '}
                                </span>
                                {vendors[selectedProduct.vendor_id]}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Gold type :{' '}
                                </span>
                                {selectedProduct.gold_type}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Purity :{' '}
                                </span>
                                {selectedProduct.purity}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Size :{' '}
                                </span>
                                {selectedProduct.size}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Weight :{' '}
                                </span>
                                {selectedProduct.weight}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Clasp type :{' '}
                                </span>
                                {selectedProduct.clasp_type}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    No of gems :{' '}
                                </span>
                                {selectedProduct.no_of_gems}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Gem type :{' '}
                                </span>
                                {selectedProduct.gem_type}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Gem color :{' '}
                                </span>
                                {selectedProduct.gem_color}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    MRP (Rs.) :{' '}
                                </span>
                                {selectedProduct.mrp}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Selling Price (Rs.) :{' '}
                                </span>
                                {selectedProduct.selling_price}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Vendor Price (Rs.) :{' '}
                                </span>
                                {selectedProduct.vendor_price}
                            </p>
                            <p>
                                <span style={{ fontWeight: '600' }}>
                                    Occasion :{' '}
                                </span>
                                {selectedProduct.occasion_type}
                            </p>
                        </Col>
                    </Row>
                )}
            </Modal>
        </>
    )
}

export default ProductList
