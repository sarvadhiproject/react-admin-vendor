import React, { useState, useEffect } from 'react'
import { Table, Modal, Popconfirm, message, Row, Col } from 'antd'
import {
    InfoCircleTwoTone,
    LeftOutlined,
    RightOutlined,
} from '@ant-design/icons'
import appConfig from 'configs/app.config'
import { HiOutlineTrash } from 'react-icons/hi'
import { Spin } from 'antd'
import { Notification, toast } from 'components/ui'
const ProductList = () => {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState({})
    const [vendors, setVendors] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    useEffect(() => {
        // Fetch product data
        fetch(`${appConfig.apiPrefix}/view-products-cloudinary`)
            .then((res) => res.json())
            .then((data) => setProducts(data))

        // Fetch category data
        fetch(`${appConfig.apiPrefix}/all-categories`)
            .then((res) => res.json())
            .then((data) => {
                const categoriesMap = {}
                data.forEach((category) => {
                    categoriesMap[category.category_id] = category.category_name
                })
                setCategories(categoriesMap)
            })

        // Fetch vendor data
        fetch(`${appConfig.apiPrefix}/view-users`)
            .then((res) => res.json())
            .then((data) => {
                const vendorsMap = {}
                data.forEach((vendor) => {
                    vendorsMap[vendor.id] =
                        vendor.first_name + ' ' + vendor.last_name
                })
                setVendors(vendorsMap)
            })
    }, [])

    const handleDetailView = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }
    const fetchProducts = () => {
        fetch(`${appConfig.apiPrefix}/view-products-cloudinary`)
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
        fetch(`${appConfig.apiPrefix}/soft-delete-product/${productToDelete}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (res.ok) {
                    setIsDeleting(false)
                    setShowConfirmModal(false)
                    fetchProducts() // Call the function to fetch the updated products list
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

    const columns = [
        {
            title: '#',
            dataIndex: 'product_id',
            key: 'product_id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Category',
            dataIndex: 'category_id',
            key: 'category_id',
            render: (categoryId) => categories[categoryId],
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor_id',
            key: 'vendor_id',
            render: (vendorId) => vendors[vendorId],
        },
        {
            title: 'Purity',
            dataIndex: 'purity',
            key: 'purity',
        },
        {
            title: 'MRP (Rs.)',
            dataIndex: 'mrp',
            key: 'mrp',
        },
        {
            title: 'Selling Price (Rs.)',
            dataIndex: 'selling_price',
            key: 'selling_price',
        },
        {
            title: 'Vendor Price (Rs.)',
            dataIndex: 'vendor_price',
            key: 'vendor_price',
        },
        {
            title: 'Stock Quantity',
            dataIndex: 'stock_quantity',
            key: 'stock_quantity',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex' }}>
                    <InfoCircleTwoTone
                        onClick={() => handleDetailView(record)}
                        style={{ marginRight: '20px' }}
                    />
                    {/* <Popconfirm
                        title="Are you sure you want to delete this product?"
                        onConfirm={() => handleDelete(record.product_id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <HiOutlineTrash
                            style={{ color: 'red', fontSize: '18px' }}
                        />
                    </Popconfirm> */}
                    <HiOutlineTrash
                        style={{
                            color: 'red',
                            fontSize: '18px',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleDelete(record)}
                    />
                </div>
            ),
        },
    ]

    return (
        <>
            <h3 style={{ marginBottom: '20px' }}>Manage products</h3>
            <Table
                dataSource={products}
                columns={columns}
                rowKey="product_id"
                size="small"
                // bordered={true}
            />
            <Modal
                title="Confirm Deletion"
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
                cancelButtonProps={{ style: { borderColor: '#1890ff' } }}
            >
                <p>Are you sure you want to delete this product?</p>
            </Modal>
            <Modal
                title={<h4>Product Details</h4>}
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
    )
}
export default ProductList
