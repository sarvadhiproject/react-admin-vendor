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
                    style={{ backgroundColor: '#832729' }}
                    icon={<HiPlusCircle />}
                >
                    Add Category
                </Button>
            </div>
            <Modal
                title={<h5 style={{ color: '#832729' }}>Add New Category</h5>}
                open={showModal}
                onCancel={closeModal}
                footer={null}
            >
                <CategoryNew onClose={closeModal} />
            </Modal>
        </div>
    )
}

export default ProductTableTools
