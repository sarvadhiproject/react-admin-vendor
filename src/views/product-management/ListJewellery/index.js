import React, { useState, useEffect, useMemo } from 'react'
import { Table, Modal, message, Row, Col, Tooltip, Empty } from 'antd'
import {
    InfoCircleTwoTone,
    LeftOutlined,
    EditOutlined,
    LoadingOutlined,
    RightOutlined,
} from '@ant-design/icons'
import appConfig from 'configs/app.config'
import { HiOutlineTrash, HiPlusCircle } from 'react-icons/hi'
import { Spin, Input } from 'antd'
import { Button, Notification, toast } from 'components/ui'
import { jwtDecode } from 'jwt-decode'
import EditJewellery from '../EditJewellery'
import AddJewellery from '../AddJewellery'
import NumberFormat from 'react-number-format'

const token = localStorage.getItem('admin')
const decodedToken = jwtDecode(token)
var vendorID = decodedToken.id

const ListJewellery = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState(null)
    const [allData, setAllData] = useState({})
    const [isAddJewelleryOpen, setIsAddJewelleryOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        setIsLoading(true)
        // Fetch product data
        fetch(`${appConfig.apiPrefix}/products-by-vendor/${vendorID}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data)
                } else if (
                    data.message === 'No products found for this vendor'
                ) {
                    setProducts([])
                } else {
                    console.error('Unexpected response from the server:', data)
                }
            })
            .catch((error) => console.error('Error:', error))
            .finally(() => setIsLoading(false))

        fetch(`${appConfig.apiPrefix}/all-categories`)
            .then((res) => res.json())
            .then((data) => {
                const categoriesMap = {}
                data.forEach((category) => {
                    categoriesMap[category.category_id] = category.category_name
                })
                setCategories(categoriesMap)
            })
    }, [])

    const handleDetailView = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }
    const fetchProducts = () => {
        fetch(`${appConfig.apiPrefix}/products-by-vendor/${vendorID}`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error('Error:', error))
    }

    const handleDelete = (record) => {
        setProductToDelete(record.product_id)
        setShowConfirmModal(true)
    }
    const handleConfirmDelete = () => {
        setIsDeleting(true)
        fetch(
            `${appConfig.apiPrefix}/delete-product/${vendorID}/${productToDelete}`,
            {
                method: 'DELETE',
            }
        )
            .then((res) => {
                if (res.ok) {
                    setIsDeleting(false)
                    setShowConfirmModal(false)
                    fetchProducts()
                    toast.push(
                        <Notification
                            title={'Successfully deleted'}
                            type="success"
                            duration={2500}
                        >
                            Product deleted successfully
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                } else {
                    throw new Error('Failed to delete product')
                }
            })
            .catch((error) => {
                setIsDeleting(false)
                setShowConfirmModal(false)
                toast.push(
                    <Notification
                        title={'Unable to delete product'}
                        type="danger"
                        duration={2500}
                    >
                        {error.message}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                console.error('Error:', error)
            })
    }
    const handleCloseAddJewellery = () => {
        setIsAddJewelleryOpen(false)
        fetchProducts()
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
    const handleEditClick = (productId) => {
        setIsEditMode(true)
        setSelectedProductId(productId)
    }

    const filteredProducts = products.filter((product) =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const indexStart = useMemo(() => {
        const pageSize = 10 // Adjust this to your desired page size
        return (currentPage - 1) * pageSize
    }, [currentPage])

    const columns = [
        {
            title: '#',
            dataIndex: 'product_id',
            key: 'product_id',
            sorter: (a, b) => a.product_id - b.product_id,
            render: (text, record, index) => indexStart + index + 1,
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
        },
        {
            title: 'Category',
            dataIndex: 'category_id',
            key: 'category_id',
            render: (categoryId) => categories[categoryId],
            sorter: (a, b) =>
                categories[a.category_id].localeCompare(
                    categories[b.category_id]
                ),
        },
        {
            title: 'Purity',
            dataIndex: 'purity',
            key: 'purity',
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
            title: 'Stock Quantity',
            dataIndex: 'stock_quantity',
            key: 'stock_quantity',
            sorter: (a, b) => a.stock_quantity - b.stock_quantity,
            render: (value) => (
                <span
                    style={{
                        color: value <= 3 ? 'red' : 'green',
                        fontWeight: '600',
                    }}
                >
                    {value}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex' }}>
                    <Tooltip title="Detailed view">
                        <InfoCircleTwoTone
                            onClick={() => handleDetailView(record)}
                            style={{ marginRight: '20px' }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit product">
                        <EditOutlined
                            style={{
                                marginRight: '20px',
                                color: '#022B4E',
                                // color: '#1890ff',
                                fontSize: '18px',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                setAllData(record)
                                handleEditClick(record.product_id)
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete product">
                        <HiOutlineTrash
                            style={{
                                color: 'red',
                                fontSize: '18px',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ]
    return (
        <>
            {isAddJewelleryOpen ? (
                <AddJewellery handleClose={handleCloseAddJewellery} />
            ) : isEditMode ? (
                <EditJewellery
                    productId={selectedProductId}
                    allData={allData}
                    handleCancelEdit={() =>
                        setIsEditMode(false) + fetchProducts()
                    }
                />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h3 style={{ color: '#022B4E' }}>Manage Products</h3>
                        <div className="flex items-center">
                            <Input.Search
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ marginRight: '1rem' }}
                                size="large"
                            />
                            <Button
                                onClick={() => setIsAddJewelleryOpen(true)}
                                block
                                variant="solid"
                                size="sm"
                                style={{ width: '150px' }}
                                icon={<HiPlusCircle />}
                            >
                                Add Jewellery
                            </Button>
                        </div>
                    </div>
                    {isLoading ? (
                        <Spin
                            indicator={
                                <LoadingOutlined
                                    style={{ fontSize: 24 }}
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
                        <Empty description="">
                            Searched product not found!
                        </Empty>
                    )}
                    <Modal
                        title={<h4>Confirm Deletion</h4>}
                        open={showConfirmModal}
                        onOk={handleConfirmDelete}
                        onCancel={() => setShowConfirmModal(false)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{
                            loading: isDeleting,
                            style: {
                                backgroundColor: 'red',
                                borderColor: 'red',
                                color: 'white',
                            },
                        }}
                        cancelButtonProps={{
                            style: { borderColor: '#1890ff' },
                        }}
                    >
                        <p>Are you sure you want to delete this product?</p>
                    </Modal>
                    <Modal
                        title={
                            <h4 style={{ color: '#022B4E' }}>
                                Product Details
                            </h4>
                        }
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
                                    {/* <p>
                                <span style={{ fontWeight: '600' }}>
                                    Description :{' '}
                                </span>
                                {selectedProduct.basic_description}
                            </p> */}
                                    <p>
                                        <span style={{ fontWeight: '600' }}>
                                            Category :
                                        </span>{' '}
                                        {
                                            categories[
                                                selectedProduct.category_id
                                            ]
                                        }
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
                                    <p>
                                        <span style={{ fontWeight: '600' }}>
                                            Stock Quantity :{' '}
                                        </span>
                                        {selectedProduct.stock_quantity}
                                    </p>
                                </Col>
                            </Row>
                        )}
                    </Modal>
                </>
            )}
        </>
    )
}
export default ListJewellery
