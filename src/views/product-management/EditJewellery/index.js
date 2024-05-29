import React, { useState, useEffect } from 'react'
import { Steps } from 'antd'
import EditProductMetadata from './EditProductMetadata'
import EditInDepthDetails from './EditInDepthDetails'
import EditProductPrice from './EditProductPrice'
import EditProductImages from './EditProductImages'
import appConfig from 'configs/app.config'
import { useNavigate } from 'react-router-dom'
import { Button } from 'components/ui'
import { jwtDecode } from 'jwt-decode'

const { Step } = Steps
const token = localStorage.getItem('admin')
const decodedToken = jwtDecode(token)
var vendorID = decodedToken.id
const EditJewellery = ({ productId, allData, handleCancelEdit }) => {
    const navigate = useNavigate()
    const [current, setCurrent] = useState(0)
    console.log(allData, 'allData')
    const [formData, setFormData] = useState({
        product_name: allData?.product_name ? allData?.product_name : '',
        category_id: allData?.category_id ? allData?.category_id : '',
        basic_description: allData?.basic_description
            ? allData?.basic_description
            : '',
        main_description: allData?.main_description
            ? allData?.main_description
            : '',
        mrp: allData?.mrp ? allData?.mrp : '',
        selling_price: allData?.selling_price ? allData?.selling_price : '',
        vendor_price: allData?.vendor_price ? allData?.vendor_price : '',
        // stock_quantity: allData?.stock_quantity ? allData?.stock_quantity : '',
        weight: allData?.weight ? allData?.weight : '',
        clasp_type: allData?.clasp_type ? allData?.clasp_type : '',
        gold_type: allData?.gold_type ? allData?.gold_type : '',
        gem_type: allData?.gem_type ? allData?.gem_type : [],
        no_of_gems: allData?.no_of_gems ? allData?.no_of_gems : 0,
        gem_color: allData?.gem_color ? allData?.gem_color : '',
        occasion_type: allData?.occasion_type ? allData?.occasion_type : [],
        size: allData?.size ? allData?.size : '',
        purity: allData?.purity ? allData?.purity : '',
        vendor_id: vendorID,
    })

    // const fetchProductData = async (productId) => {
    //     try {
    //         const response = await fetch(
    //             `${appConfig.apiPrefix}/product-details/${productId}`
    //         )
    //         const data = await response.json()

    //         // Update formData with fetched product data
    //         setFormData({
    //             ...data,
    //             gem_type: data.gem_type ? data.gem_type.split(',') : [],
    //             occasion_type: data.occasion_type
    //                 ? data.occasion_type.split(',')
    //                 : [],
    //         })
    //     } catch (error) {
    //         console.error('Error fetching product data:', error)
    //     }
    // }

    // useEffect(() => {
    //     if (productId) fetchProductData(productId)
    // }, [productId])

    const handleCancel = () => {
        handleCancelEdit()
    }

    // const fetchProductData = async (productId) => {
    //     try {
    //         const response = await fetch(
    //             `${appConfig.apiPrefix}/product-details/${productId}`
    //         )
    //         const data = await response.json()
    //         setFormData(data)
    //     } catch (error) {
    //         console.error('Error fetching product data:', error)
    //     }
    // }

    const handleNext = () => {
        setCurrent(current + 1)
    }

    const handlePrev = () => {
        setCurrent(current - 1)
    }

    const handleSubmit = () => {
        // Reset form data and current step
        setFormData({})
        setCurrent(0)
        handleCancelEdit()
    }

    const steps = [
        {
            title: 'Product Metadata',
            content: (
                <EditProductMetadata
                    onNext={handleNext}
                    formData={formData}
                    setFormData={setFormData}
                    // productId={productId}
                />
            ),
        },
        {
            title: 'Indepth Details',
            content: (
                <EditInDepthDetails
                    onNext={handleNext}
                    onPrev={handlePrev}
                    formData={formData}
                    setFormData={setFormData}
                />
            ),
        },
        {
            title: 'Price',
            content: (
                <EditProductPrice
                    onNext={handleNext}
                    onPrev={handlePrev}
                    formData={formData}
                    setFormData={setFormData}
                />
            ),
        },
        {
            title: 'Upload Images',
            content: (
                <EditProductImages
                    onPrev={handlePrev}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    productId={productId}
                />
            ),
        },
    ]

    return (
        <div>
            <h3 style={{ color: '#022B4E' }}>Edit Jewellery</h3>
            <Steps style={{ marginTop: '20px' }} current={current}>
                {steps.map((step, index) => (
                    <Step key={index} title={step.title} />
                ))}
            </Steps>
            <div style={{ marginTop: '30px' }} className="steps-content">
                {steps[current].content}
            </div>
            <Button onClick={handleCancel}>Cancel</Button>
        </div>
    )
}

export default EditJewellery
