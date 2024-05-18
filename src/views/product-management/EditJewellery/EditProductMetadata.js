// import React, { useEffect, useRef, useState } from 'react'
// import { Form, Input, Select, Button } from 'antd'
// import appConfig from 'configs/app.config'

// const { Option } = Select

// const EditProductMetadata = ({ onNext, formData, setFormData }) => {
//     const [categories, setCategories] = useState([])
//     const [initialValues, setInitialValues] = useState({
//         product_name: '',
//         basic_description: '',
//         main_description: '',
//         category_id: undefined,
//     })

//     useEffect(() => {
//         fetchCategories()
//         setInitialValues({
//             product_name: formData.product_name || '',
//             basic_description: formData.basic_description || '',
//             main_description: formData.main_description || '',
//             category_id: formData.category_id || undefined,
//         })
//     }, [formData])

//     useEffect(() => {
//         // fetchProductData()
//         fetchCategories()
//     }, [])

//     const fetchCategories = async () => {
//         try {
//             const response = await fetch(
//                 `${appConfig.apiPrefix}/all-categories`
//             )
//             const data = await response.json()
//             setCategories(data)
//         } catch (error) {
//             console.error('Error fetching categories:', error)
//         }
//     }
//     // const fetchProductData = async () => {
//     //     try {
//     //         const response = await fetch(
//     //             `${appConfig.apiPrefix}/product-details/${productId}`
//     //         )
//     //         const data = await response.json()
//     //         console.log('response :', data)
//     //         setFormData(data)
//     //         console.log(formData)
//     //     } catch (error) {
//     //         console.error('Error fetching product data:', error)
//     //     }
//     // }

//     const handleSubmit = (values) => {
//         setFormData({ ...formData, ...values })
//         onNext()
//     }

//     const handleCategoryChange = (category_id) => {
//         setFormData({ ...formData, category_id })
//     }

//     console.log(initialValues)
//     return (
//         <Form onFinish={handleSubmit} initialValues={initialValues}>
//             <Form.Item
//                 name="product_name"
//                 label="Title"
//                 rules={[{ required: true }]}
//             >
//                 <Input style={{ width: '300px', height: '35px' }} />
//             </Form.Item>
//             <Form.Item
//                 name="basic_description"
//                 label="Basic Description"
//                 rules={[{ required: true }]}
//             >
//                 <Input.TextArea style={{ width: '350px', height: '101px' }} />
//             </Form.Item>
//             <Form.Item
//                 name="main_description"
//                 label="Main Description"
//                 rules={[{ required: true }]}
//             >
//                 <Input.TextArea style={{ width: '500px', height: '101px' }} />
//             </Form.Item>
//             <Form.Item
//                 label="Category"
//                 name="category_id"
//                 rules={[{ required: true, message: 'Please select category' }]}
//             >
//                 <Select
//                     style={{ width: '300px', height: '35px' }}
//                     onChange={handleCategoryChange}
//                     placeholder="Select a category"
//                     value={formData.category_id || undefined}
//                 >
//                     {categories.map((category) => (
//                         <Option
//                             key={category.category_id}
//                             value={category.category_id}
//                         >
//                             {category.category_name}
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

// export default EditProductMetadata

import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Button } from 'antd'
import appConfig from 'configs/app.config'

const { Option } = Select

const EditProductMetadata = ({ onNext, formData, setFormData }) => {
    const [categories, setCategories] = useState([])
    const [initialValues, setInitialValues] = useState({
        product_name: formData?.product_name ? formData?.product_name : '',
        basic_description: formData?.basic_description
            ? formData?.basic_description
            : '',
        main_description: formData?.main_description
            ? formData?.main_description
            : '',
        category_id: formData?.category_id ? formData?.category_id : '',
    })
    console.log(initialValues, 'initialValues')
    console.log('setFormData', formData)
    useEffect(() => {
        fetchCategories()
    }, [])

    console.log(formData, 'formData')

    // useEffect(() => {
    //     if (formData) {
    //         setInitialValues({
    //             product_name: formData.product_name || '',
    //             basic_description: formData.basic_description || '',
    //             main_description: formData.main_description || '',
    //             category_id: formData.category_id || '',
    //         })
    //     }
    // }, [formData])

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${appConfig.apiPrefix}/categories/get-categories`
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

    const handleCategoryChange = (category_id) => {
        setFormData({ ...formData, category_id })
    }
    console.log(formData, 'formData')

    return (
        <Form onFinish={handleSubmit} initialValues={initialValues}>
            {console.log(initialValues, '=======')}
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
            <Form.Item
                label="Category"
                name="category_id"
                rules={[{ required: true, message: 'Please select category' }]}
            >
                <Select
                    style={{ width: '300px', height: '35px' }}
                    onChange={handleCategoryChange}
                    placeholder="Select a category"
                    value={formData.category_id || undefined}
                >
                    {categories.map((category) => (
                        <Option
                            key={category.category_id}
                            value={category.category_id}
                        >
                            {category.category_name}
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
                >
                    Next
                </Button>
            </Form.Item>
        </Form>
    )
}

export default EditProductMetadata
