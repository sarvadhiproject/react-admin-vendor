import React, { useState } from 'react'
import { Steps } from 'antd'
import AddProductMetadata from './AddProductMetadata'
import AddProductPrice from './AddProductPrice'
import AddProductImages from './AddProductImages'
import InDepthDetails from './InDepthDetails'
import { jwtDecode } from 'jwt-decode'

const { Step } = Steps

const token = localStorage.getItem('admin')

const AddJewellery = () => {
    if (token) {
        try {
            const decodedToken = jwtDecode(token)
            // console.log('Decoded token:', decodedToken)
            var vendorID = decodedToken.id
            // console.log('Vendor ID:', vendorID)
        } catch (error) {
            console.error('Error decoding JWT token:', error)
        }
    } else {
        console.error('JWT token not found in local storage')
    }

    const [current, setCurrent] = useState(0)
    const [formData, setFormData] = useState({
        // Initial form data
        Product_name: '',
        description: '',
        categoryID: '',
        vendorID: vendorID,
        MRP: '',
        Selling_Price: '',
        Vendor_Price: '',
        Stock_quantity: '',
        Clasp_type: '',
        Material_type: '',
        Metal_type: '',
        Chain_type: '',
        Gem_type: '',
        Gem_Color: '',
        Occasion_type: [],
        Size: '',
        Metal_Stamp: '',
        productImages: [],
        // ratings: 4.5,
    })
    const [gemColor, setGemColor] = useState('#FFFFFF') // State for color value
    const handleGemColorChange = (color) => {
        setGemColor(color.hex)
    }
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
    }

    const steps = [
        {
            title: 'Product Metadata',
            content: (
                <AddProductMetadata
                    onNext={handleNext}
                    formData={formData}
                    setFormData={setFormData}
                />
            ),
        },
        {
            title: 'Indepth Details',
            content: (
                <InDepthDetails
                    onNext={handleNext}
                    onPrev={handlePrev}
                    formData={formData}
                    gemColor={gemColor}
                    setGemColor={setGemColor}
                    y
                    setFormData={setFormData}
                />
            ),
        },
        {
            title: 'Price',
            content: (
                <AddProductPrice
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
                <AddProductImages
                    onPrev={handlePrev}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                />
            ),
        },
    ]

    return (
        <div>
            <h3>Add Jewellery</h3>
            <Steps style={{ marginTop: '20px' }} current={current}>
                {steps.map((step, index) => (
                    <Step key={index} title={step.title} />
                ))}
            </Steps>
            <div style={{ marginTop: '30px' }} className="steps-content">
                {steps[current].content}
            </div>
        </div>
    )
}

export default AddJewellery
