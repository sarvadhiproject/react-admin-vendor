import React, { useState } from 'react'
import { Steps } from 'antd'
import AddProductMetadata from './AddProductMetadata'
import AddProductPrice from './AddProductPrice'
import AddProductImages from './AddProductImages'
import InDepthDetails from './InDepthDetails'
import { jwtDecode } from 'jwt-decode'
import { Button } from 'components/ui'

const { Step } = Steps

const token = localStorage.getItem('admin')

const AddJewellery = ({ handleClose }) => {
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
        product_name: '',
        category_id: '',
        vendor_id: vendorID,
        basic_description: '',
        main_description: '',
        mrp: '',
        selling_price: '',
        vendor_price: '',
        // stock_quantity: '',
        weight: '',
        clasp_type: '',
        gold_type: '',
        gem_type: [],
        no_of_gems: 0,
        gem_color: '',
        occasion_type: [],
        size: '',
        purity: '',
        p_images: [],
    })
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
        handleClose()
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
            <h3 style={{ color: '#022B4E' }}>Add Jewellery</h3>
            <Steps style={{ marginTop: '20px' }} current={current}>
                {steps.map((step, index) => (
                    <Step key={index} title={step.title} />
                ))}
            </Steps>
            <div style={{ marginTop: '30px' }} className="steps-content">
                {steps[current].content}
            </div>
            <Button onClick={handleClose}>Cancel</Button>
        </div>
    )
}

export default AddJewellery
