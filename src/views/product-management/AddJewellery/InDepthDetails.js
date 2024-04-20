import React, { useState } from 'react'
import { Form, Input, Select, Button, Row, Col } from 'antd'

const { Option } = Select

const InDepthDetails = ({ onNext, onPrev, formData, setFormData }) => {
    const [customValues, setCustomValues] = useState({
        clasp_type: '',
        purity: '',
        gold_type: '',
        chain_type: '',
        gem_color: '',
        gem_type: '',
    })

    const handleSubmit = (values) => {
        setFormData({ ...formData, ...values, ...customValues })
        onNext()
    }

    const handleCustomValueChange = (field, value) => {
        setCustomValues({ ...customValues, [field]: value })
    }

    const renderCustomInput = (field, label) => {
        return (
            <Form.Item
                name={field}
                label={`Custom ${label}`}
                style={{ width: '320px', height: '35px' }}
            >
                <Input
                    placeholder={`Enter custom ${label.toLowerCase()}`}
                    value={customValues[field]}
                    onChange={(e) =>
                        handleCustomValueChange(field, e.target.value)
                    }
                />
            </Form.Item>
        )
    }

    const renderSelectWithCustom = (field, label, options) => {
        const fieldValue = formData[field]
        return (
            <Form.Item
                name={field}
                label={label}
                style={{ width: '320px', height: '35px' }}
            >
                <Select
                    placeholder={`Select ${label}`}
                    onChange={(value) => {
                        if (value === 'Other') {
                            handleCustomValueChange(field, '')
                        } else {
                            handleCustomValueChange(field, value)
                        }
                    }}
                >
                    {options.map((option) => (
                        <Option key={option} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        )
    }

    return (
        <Form onFinish={handleSubmit} initialValues={{ ...formData }}>
            <Row gutter={16}>
                <Col span={12}>
                    {renderSelectWithCustom('gold_type', 'Gold Type', [
                        'Yellow Gold',
                        'White Gold',
                        'Rose Gold',
                        'Green Gold',
                        'Black Hills Gold',
                    ])}
                </Col>
                <Col span={12}>
                    {renderSelectWithCustom('purity', 'Purity Value', [
                        '24k',
                        '22k',
                        '18k',
                        '14k',
                        '10k',
                    ])}
                </Col>

                <Col span={12}>
                    {renderSelectWithCustom('chain_type', 'Chain Type', [
                        'Cable Chain',
                        'Figaro Chain',
                        'Box Chain',
                        'Rope Chain',
                        'Curb Chain',
                        'Snake Chain',
                        'Wheat Chain',
                        'Singapore Chain',
                        'Bead Chain',
                        'Rolo Chain',
                        'Franco Chain',
                        'Herringbone Chain',
                        'Spiga Chain',
                        'Venetian Chain',
                        'Mariner Chain',
                    ])}
                </Col>
                <Col span={12}>
                    {renderSelectWithCustom('clasp_type', 'Clasp Type', [
                        'Lobster Clasp',
                        'Spring Ring Clasp',
                        'Toggle Clasp',
                        'Box Clasp',
                        'Fishhook Clasp',
                        'Magnetic Clasp',
                        'Hook and Eye Clasp',
                        'Barrel Clasp',
                        'S Hook Clasp',
                        'Slide Lock Clasp',
                    ])}
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    {renderSelectWithCustom('gem_type', 'Gem Type', [
                        'Diamond',
                        'Ruby',
                        'Sapphire',
                        'Emerald',
                        'Pearl',
                        'Amethyst',
                        'Tourmaline',
                        'Cubic Zirconia',
                        'Topaz',
                        'Peridot',
                        'Garnet',
                        'Opal',
                        'Aquamarine',
                    ])}
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="gem_color"
                        label="Gem Color"
                        // rules={[{ required: true }]}
                        style={{ width: '350px', height: '35px' }}
                    >
                        {/* <Select placeholder="Select gem colors" mode="multiple">
                            <Option value="Red">Red</Option>
                            <Option value="Orange">Orange</Option>
                            <Option value="Yellow">Yellow</Option>
                            <Option value="Green">Green</Option>
                            <Option value="Blue">Blue</Option>
                            <Option value="Gray">Gray</Option>
                            <Option value="Brown">Brown</Option>
                            <Option value="Navy">Navy</Option>
                            <Option value="Silver">Silver</Option>
                        </Select> */}
                        <Input placeholder="Enter gem colors (comma separated)" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="Size"
                        label="Size"
                        style={{ width: '300px', height: '35px' }}
                    >
                        <Input placeholder="Enter size" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="stock_quantity"
                        label="Stock Quantity"
                        rules={[{ required: true }]}
                        style={{ width: '320px', height: '35px' }}
                    >
                        <Input
                            placeholder="Enter stock quantity"
                            type="number"
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="occasion_type"
                        label="Occasion Type"
                        rules={[{ required: true }]}
                        style={{ width: '450px', height: '35px' }}
                    >
                        <Select
                            placeholder="Select an occasion type"
                            mode="multiple"
                        >
                            <Option value="Wedding">Wedding</Option>
                            <Option value="Engagement">Engagement</Option>
                            <Option value="Office wear">Office wear</Option>
                            <Option value="Daily wear">Daily wear</Option>
                            <Option value="Ethnic wear">Ethnic wear</Option>
                            <Option value="Casual Wear">Casual Wear</Option>
                            <Option value="Gift Giving">Gift Giving</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
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

export default InDepthDetails

// import React, { useState } from 'react'
// import { Form, Input, Select, Button, Popover, Row, Col } from 'antd'
// import { SketchPicker } from 'react-color'

// const { Option } = Select

// const InDepthDetails = ({
//     onNext,
//     onPrev,
//     formData,
//     setFormData,
//     gemColor,
//     setGemColor,
// }) => {
//     // const [gemColor, setGemColor] = useState(formData.Gem_Color)

//     const handleSubmit = (values) => {
//         setFormData({ ...formData, ...values, Gem_Color: gemColor })
//         onNext()
//     }

//     const handleGemColorChange = (color) => {
//         setGemColor(color.hex)
//     }
//     const initialOccasionType = Array.isArray(formData.Occasion_type)
//         ? formData.Occasion_type
//         : [formData.Occasion_type]

//     return (
//         <Form
//             onFinish={handleSubmit}
//             initialValues={{ ...formData, Occasion_type: initialOccasionType }}
//         >
//             <Row gutter={16}>
//                 <Col span={12}>
//                     <Form.Item
//                         name="Clasp_type"
//                         label="Clasp Type"
//                         // rules={[{ required: true }]}
//                         style={{ width: '300px', height: '35px' }}
//                     >
//                         <Select placeholder="Select a clasp type">
//                             <Option value="Lobster Clasp">Lobster Clasp</Option>
//                             <Option value="Spring Ring">Spring Ring</Option>
//                             <Option value="Toggle Clasp">Toggle Clasp</Option>
//                             <Option value="Box Clasp">Box Clasp</Option>
//                             <Option value="Other">Other</Option>
//                         </Select>
//                     </Form.Item>
//                 </Col>
//                 <Col span={12}>
//                     <Form.Item
//                         name="Material_type"
//                         label="Material Type"
//                         rules={[{ required: true }]}
//                         style={{ width: '270px', height: '35px' }}
//                     >
//                         <Select placeholder="Select a material type">
//                             <Option value="Gold">Gold</Option>
//                             <Option value="Silver">Silver</Option>
//                             <Option value="Platinum">Platinum</Option>
//                             <Option value="Titanium">Titanium</Option>
//                             <Option value="Other">Other</Option>
//                         </Select>
//                     </Form.Item>
//                 </Col>
//             </Row>
//             <Row gutter={16}>
//                 <Col span={12}>
//                     <Form.Item
//                         name="Metal_type"
//                         label="Metal Type"
//                         rules={[{ required: true }]}
//                         style={{ width: '320px', height: '35px' }}
//                     >
//                         <Select placeholder="Select a metal type">
//                             <Option value="Yellow Gold">Yellow Gold</Option>
//                             <Option value="White Gold">White Gold</Option>
//                             <Option value="Rose Gold">Rose Gold</Option>
//                             <Option value="Sterling Silver">
//                                 Sterling Silver
//                             </Option>
//                             <Option value="Other">Other</Option>
//                         </Select>
//                     </Form.Item>
//                 </Col>
//                 <Col span={12}>
//                     <Form.Item
//                         name="Chain_type"
//                         label="Chain Type"
//                         // rules={[{ required: true }]}
//                         style={{ width: '300px', height: '35px' }}
//                     >
//                         <Select placeholder="Select a chain type">
//                             <Option value="Cable Chain">Cable Chain</Option>
//                             <Option value="Figaro Chain">Figaro Chain</Option>
//                             <Option value="Box Chain">Box Chain</Option>
//                             <Option value="Rope Chain">Rope Chain</Option>
//                             <Option value="Other">Other</Option>
//                         </Select>
//                     </Form.Item>
//                 </Col>
//             </Row>
//             <Row gutter={16}>
//                 <Col span={12}>
//                     <Form.Item
//                         name="Size"
//                         label="Size"
//                         // rules={[{ required: true }]}
//                         style={{ width: '300px', height: '35px' }}
//                     >
//                         <Input placeholder="Enter size" />
//                     </Form.Item>
//                 </Col>
//                 <Col span={12}>
//                     <Form.Item
//                         name="Gem_type"
//                         label="Gem Type"
//                         // rules={[{ required: true }]}
//                         style={{ width: '300px', height: '35px' }}
//                     >
//                         <Select placeholder="Select a gem type">
//                             <Option value="Diamond">Diamond</Option>
//                             <Option value="Ruby">Ruby</Option>
//                             <Option value="Sapphire">Sapphire</Option>
//                             <Option value="Emerald">Emerald</Option>
//                             <Option value="Other">Other</Option>
//                         </Select>
//                     </Form.Item>
//                 </Col>
//             </Row>

//             <Col span={12}>
//                 <Form.Item
//                     name="Gem_Color"
//                     label="Gem Color"
//                     // rules={[
//                     //     {
//                     //         required: false,
//                     //         message: 'Please select a gem color',
//                     //         validator: (_, value) => {
//                     //             if (value) {
//                     //                 return Promise.resolve()
//                     //             }
//                     //             return Promise.reject(
//                     //                 new Error('Please select a gem color')
//                     //             )
//                     //         },
//                     //     },
//                     // ]}
//                 >
//                     <Popover
//                         trigger="click"
//                         content={
//                             <SketchPicker
//                                 color={gemColor}
//                                 onChange={handleGemColorChange}
//                             />
//                         }
//                     >
//                         <div
//                             style={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                             }}
//                         >
//                             <div
//                                 style={{
//                                     width: '25px',
//                                     height: '25px',
//                                     backgroundColor: gemColor,
//                                     border: '1px solid #d9d9d9',
//                                     marginRight: '10px',
//                                 }}
//                             />
//                             <Button>Select Color</Button>
//                         </div>
//                     </Popover>
//                 </Form.Item>
//             </Col>
//             <Row gutter={16}>
//                 <Col span={12}>
//                     <Form.Item
//                         name="Metal_Stamp"
//                         label="Metal Stamp"
//                         rules={[{ required: true }]}
//                         style={{ width: '320px', height: '35px' }}
//                     >
//                         <Input placeholder="Enter metal stamp" />
//                     </Form.Item>
//                 </Col>
//                 <Col span={12}>
//                     <Form.Item
//                         name="Occasion_type"
//                         label="Occasion Type"
//                         rules={[{ required: true }]}
//                         style={{ width: '450px', height: '35px' }}
//                     >
//                         <Select
//                             placeholder="Select an occasion type"
//                             mode="multiple"
//                         >
//                             <Option value="Wedding">Wedding</Option>
//                             <Option value="Anniversary">Anniversary</Option>
//                             <Option value="Birthday">Birthday</Option>
//                             <Option value="Casual">Casual</Option>
//                             <Option value="Other">Other</Option>
//                         </Select>
//                     </Form.Item>
//                 </Col>
//             </Row>
//             <Form.Item
//                 name="Stock_quantity"
//                 label="Stock Quantity"
//                 rules={[{ required: true }]}
//                 style={{ width: '320px', height: '35px' }}
//             >
//                 <Input placeholder="Enter stock quantity" type="number" />
//             </Form.Item>
//             <Form.Item>
//                 <div
//                     style={{
//                         display: 'flex',
//                         marginTop: '20px',
//                         justifyContent: 'space-between',
//                     }}
//                 >
//                     <Button onClick={onPrev}>Previous</Button>
//                     <Button
//                         type="primary"
//                         htmlType="submit"
//                         style={{
//                             background: '#1890ff',
//                             borderColor: '#1890ff',
//                             borderRadius: '4px',
//                             width: '80px',
//                         }}
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </Form.Item>
//         </Form>
//     )
// }

// export default InDepthDetails
