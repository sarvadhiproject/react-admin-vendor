// import React, { useState, useEffect } from 'react'
// import { Form, Input, Select, Button } from 'antd'
// import appConfig from 'configs/app.config'
// const { Option } = Select

// const AddProductMetadata = ({ onNext, formData, setFormData }) => {
//     const [categories, setCategories] = useState([])

//     useEffect(() => {
//         fetchCategories()
//     }, [])

//     const fetchCategories = async () => {
//         try {
//             const response = await fetch(
//                 `${appConfig.apiPrefix}/view-category-cloudinary`
//             )
//             const data = await response.json()
//             setCategories(data)
//         } catch (error) {
//             console.error('Error fetching categories:', error)
//         }
//     }

//     const handleSubmit = (values) => {
//         setFormData({ ...formData, ...values })
//         onNext()
//     }
//     const handleCategoryChange = (categoryID) => {
//         setFormData({ ...formData, categoryID })
//     }

//     return (
//         <Form onFinish={handleSubmit} initialValues={formData}>
//             <Form.Item
//                 name="Product_name"
//                 label="Title"
//                 rules={[{ required: true }]}
//             >
//                 <Input style={{ width: '300px', height: '35px' }} />
//             </Form.Item>
//             <Form.Item
//                 name="description"
//                 label="Description"
//                 rules={[{ required: true }]}
//             >
//                 <Input.TextArea style={{ width: '500px', height: '101px' }} />
//             </Form.Item>

//             <Form.Item
//                 label="Category"
//                 name="CategoryID"
//                 rules={[{ required: true, message: 'Please select category' }]}
//             >
//                 <Select
//                     style={{ width: '300px', height: '35px' }}
//                     onChange={handleCategoryChange}
//                     placeholder="Select a category"
//                     value={formData.categoryID}
//                 >
//                     {categories.map((category) => (
//                         <Option
//                             key={category.categoryID}
//                             value={category.categoryID}
//                         >
//                             {category.categoryName}
//                         </Option>
//                     ))}
//                 </Select>
//             </Form.Item>
//             <Form.Item>
//                 <Button
//                     type="primary"
//                     htmlType="submit"
//                     style={{
//                         background: '#1890ff',
//                         borderColor: '#1890ff',
//                         borderRadius: '4px',
//                         marginTop: '10px',
//                         width: '80px',
//                     }}
//                     // style={{
//                     //     // background: '#1890ff',
//                     //     background: 'white',
//                     //     fontWeight: '650',
//                     //     color: '#022b4e',
//                     //     border: '1px solid #022b4e',
//                     //     // borderColor: '',
//                     //     borderRadius: '4px',
//                     //     width: '80px',
//                     // }}
//                 >
//                     Next
//                 </Button>
//             </Form.Item>
//         </Form>
//     )
// }

// export default AddProductMetadata
import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button } from 'antd'
import appConfig from 'configs/app.config'
const { Option } = Select

const AddProductMetadata = ({ onNext, formData, setFormData }) => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${appConfig.apiPrefix}/view-category-cloudinary`
            )
            const data = await response.json()
            setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleSubmit = (values) => {
        setFormData({ ...formData, ...values })
        onNext()
    }
    const handleCategoryChange = (categoryID) => {
        setFormData({ ...formData, categoryID })
    }

    return (
        <Form onFinish={handleSubmit} initialValues={formData}>
            <Form.Item
                name="product_name"
                label="Title"
                rules={[{ required: true }]}
            >
                <Input style={{ width: '300px', height: '35px' }} />
            </Form.Item>
            <Form.Item
                name="basic_description"
                label="Basic Description"
                rules={[{ required: true }]}
            >
                <Input.TextArea style={{ width: '350px', height: '101px' }} />
            </Form.Item>
            <Form.Item
                name="main_description"
                label="Main Description"
                rules={[{ required: true }]}
            >
                <Input.TextArea style={{ width: '500px', height: '101px' }} />
            </Form.Item>
            {/* for review */}
            <Form.Item
                label="Category"
                name="category_id"
                rules={[{ required: true, message: 'Please select category' }]}
            >
                <Select
                    style={{ width: '300px', height: '35px' }}
                    onChange={handleCategoryChange}
                    placeholder="Select a category"
                    value={formData.categoryID}
                >
                    {categories.map((category) => (
                        <Option
                            key={category.categoryID}
                            value={category.categoryID}
                        >
                            {category.categoryName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                        background: '#1890ff',
                        borderColor: '#1890ff',
                        borderRadius: '4px',
                        marginTop: '10px',
                        width: '80px',
                    }}
                    // style={{
                    //     // background: '#1890ff',
                    //     background: 'white',
                    //     fontWeight: '650',
                    //     color: '#022b4e',
                    //     border: '1px solid #022b4e',
                    //     // borderColor: '',
                    //     borderRadius: '4px',
                    //     width: '80px',
                    // }}
                >
                    Next
                </Button>
            </Form.Item>
        </Form>
    )
}

export default AddProductMetadata
