import React from 'react'
import { Form, Input, Button } from 'antd'

const AddProductPrice = ({ onNext, onPrev, formData, setFormData }) => {
    const handleSubmit = (values) => {
        setFormData({ ...formData, ...values })
        onNext()
    }

    return (
        <Form onFinish={handleSubmit} initialValues={formData}>
            <Form.Item name="MRP" label="MRP" rules={[{ required: true }]}>
                <Input
                    type="number"
                    style={{ width: '220px', height: '35px' }}
                />
            </Form.Item>
            <Form.Item
                name="Selling_Price"
                label="Selling Price"
                rules={[{ required: true }]}
            >
                <Input
                    type="number"
                    style={{ width: '220px', height: '35px' }}
                />
            </Form.Item>
            <Form.Item
                name="Vendor_Price"
                label="Vendor Price"
                rules={[{ required: true }]}
            >
                <Input
                    type="number"
                    style={{ width: '220px', height: '35px' }}
                />
            </Form.Item>
            <Form.Item>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '20px',
                        justifyContent: 'space-between',
                    }}
                >
                    <Button onClick={onPrev}>Previous</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            background: '#1890ff',
                            borderColor: '#1890ff',
                            borderRadius: '4px',
                            width: '80px',
                        }}
                    >
                        Next
                    </Button>
                </div>
            </Form.Item>
        </Form>
    )
}

export default AddProductPrice
