import React, { useState } from 'react'
import { Button } from 'components/ui'
import { HiPlusCircle } from 'react-icons/hi'
import ProductTableSearch from './ProductTableSearch'
import { Modal } from 'antd'
import CategoryNew from 'views/sales/CategoryNew'

const ProductTableTools = () => {
    const [showModal, setShowModal] = useState(false)

    const openModal = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            {/* <ProductTableSearch /> */}
            <div className="block lg:inline-block ml-2 md:mb-0 mb-4">
                <Button
                    onClick={openModal}
                    block
                    variant="solid"
                    size="sm"
                    //  style={{ backgroundColor: '#022B4E' }}
                    icon={<HiPlusCircle />}
                >
                    Add Category
                </Button>
            </div>
            <Modal
                title={<h3>Add new category</h3>} // Set modal title if needed
                open={showModal} // Use "visible" instead of "isOpen"
                onCancel={closeModal} // Use "onCancel" instead of "onRequestClose"
                footer={null} // If you don't want a footer in your modal
            >
                <CategoryNew onClose={closeModal} />
            </Modal>
        </div>
    )
}

export default ProductTableTools
