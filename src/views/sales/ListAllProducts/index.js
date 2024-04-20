// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import './ListAllProducts.css'
// import appConfig from 'configs/app.config'

// const ListAllProducts = () => {
//     const [products, setProducts] = useState([])
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const { data: productsData } = await axios.get(
//                     `${appConfig.apiPrefix}/view-products-cloudinary`
//                 )
//                 const categoryIds = [
//                     ...new Set(
//                         productsData.map((product) => product.categoryID)
//                     ),
//                 ]
//                 const vendorIds = [
//                     ...new Set(productsData.map((product) => product.vendorID)),
//                 ]

//                 // const categories = await Promise.all(
//                 //     categoryIds.map((categoryID) =>
//                 //         axios.get(
//                 //             `${appConfig.apiPrefix}/view-category-cloudinary/${categoryID}`
//                 //         )
//                 //     )
//                 // )
//                 // const vendors = await Promise.all(
//                 //     vendorIds.map((vendorID) =>
//                 //         axios.get(
//                 //             `${appConfig.apiPrefix}/active-vendors/${vendorID}`
//                 //         )
//                 //     )
//                 // )

//                 // const categoryMap = categories.reduce(
//                 //     (acc, category) => ({
//                 //         ...acc,
//                 //         [category.data.categoryID]: category.data.categoryName,
//                 //     }),
//                 //     {}
//                 // )

//                 // const vendorMap = vendors.reduce(
//                 //     (acc, vendor) => ({
//                 //         ...acc,
//                 //         [vendor.data.vendorID]: vendor.data.name,
//                 //     }),
//                 //     {}
//                 // )

//                 // const enrichedProducts = productsData.map((product) => ({
//                 //     ...product,
//                 //     // categoryName: categoryMap[product.categoryID],
//                 //     // vendorName: vendorMap[product.vendorID],
//                 // }))

//                 setProducts(productsData)
//             } catch (error) {
//                 console.error('Error loading products:', error)
//             }
//             setLoading(false)
//         }

//         fetchData()
//     }, [])

//     const handleDelete = async (productId) => {
//         try {
//             await axios.delete(`/products/${productId}`)
//             setProducts((prevProducts) =>
//                 prevProducts.filter((product) => product.id !== productId)
//             )
//         } catch (error) {
//             console.error('Failed to delete product:', error)
//         }
//     }

//     if (loading) return <p>Loading...</p>

//     return (
//         <div className="product-dashboard">
//             {products.map((product) => (
//                 <div
//                     key={product.id}
//                     className="product-card"
//                     style={{ backgroundColor: '#022B4E', color: 'white' }}
//                 >
//                     <h3>{product.Product_name}</h3>
//                     <p>{product.description}</p>
//                     {/* <p>Category: {product.categoryName}</p> */}
//                     {/* <p>Vendor: {product.vendorName}</p> */}
//                     <p>MRP: {product.MRP}</p>
//                     <p>Selling Price: {product.Selling_Price}</p>
//                     {/* <div>
//                         {product.imageURLs.map((url) => (
//                             <img key={url} src={url} alt="Product" />
//                         ))}
//                     </div> */}
//                     <button onClick={() => handleDelete(product.id)}>
//                         Delete Product
//                     </button>
//                 </div>
//             ))}
//         </div>
//     )
// }

// export default ListAllProducts

import React, { useState, useEffect } from 'react'
import { Table, Button, Popconfirm, message } from 'antd'
import axios from 'axios'
import appConfig from 'configs/app.config'

const ProductList = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/view-products-cloudinary`
            )
            setProducts(response.data)
        } catch (error) {
            console.error('Error fetching products:', error.message)
        }
    }

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`/api/products/${productId}`)
            message.success('Product deleted successfully')
            fetchProducts() // Refresh product list after deletion
        } catch (error) {
            console.error('Error deleting product:', error.message)
            message.error('Failed to delete product')
        }
    }

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'Product_name',
            key: 'Product_name',
        },
        // {
        //     title: 'Description',
        //     dataIndex: 'description',
        //     key: 'description',
        // },
        {
            title: 'Category',
            // dataIndex: 'categoryName',
            // key: 'categoryName',
        },
        {
            title: 'Vendor',
            // dataIndex: 'vendorName',
            // key: 'vendorName',
        },
        {
            title: 'MRP',
            dataIndex: 'MRP',
            key: 'MRP',
        },
        {
            title: 'Selling Price',
            dataIndex: 'Selling_Price',
            key: 'Selling_Price',
        },
        {
            title: 'Vendor Price',
            dataIndex: 'Vendor_Price',
            key: 'Vendor_Price',
        },
        {
            title: 'Stock Quantity',
            dataIndex: 'Stock_quantity',
            key: 'Stock_quantity',
        },
        {
            title: 'Material Type',
            dataIndex: 'Material_type',
            key: 'Material_type',
        },
        {
            title: 'Metal Type',
            dataIndex: 'Metal_type',
            key: 'Metal_type',
        },
        {
            title: 'Chain Type',
            dataIndex: 'Chain_type',
            key: 'Chain_type',
        },
        {
            title: ' Gem Type',
            dataIndex: ' Gem_type',
            key: ' Gem_type',
        },
        {
            title: 'Gem Color',
            dataIndex: 'Gem_Color',
            key: 'Gem_Color',
        },
        {
            title: ' Occasion Type',
            dataIndex: ' Occasion_type',
            key: ' Occasion_type',
        },
        {
            title: 'Size',
            dataIndex: 'Size',
            key: 'Size',
        },
        {
            title: 'Metal Stamp',
            dataIndex: 'Metal_Stamp',
            key: 'Metal_Stamp',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this product?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="danger">Delete</Button>
                </Popconfirm>
            ),
        },
    ]

    return (
        <Table
            dataSource={products}
            columns={columns}
            size="small"
            rowKey="id"
            pagination={true}
            // style={{ background: '#022B4E', color: 'white' }} // Apply color palette
        />
    )
}

export default ProductList
