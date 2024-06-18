import React from 'react'
import { Form, Input, Select, Button, Row, Col } from 'antd'

const { Option } = Select

const EditInDepthDetails = ({ onNext, onPrev, formData, setFormData }) => {
    const handleSubmit = (values) => {
        setFormData({ ...formData, ...values })
        onNext()
    }
    const { category_id } = formData
    const necklaceChainBraceletCategoryIds = [60, 62, 63]

    return (
        <Form onFinish={handleSubmit} initialValues={formData}>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="gold_type"
                        label="Gold Type"
                        rules={[{ required: true }]}
                        style={{ width: '300px', height: '35px' }}
                    >
                        <Select placeholder="Select gold type">
                            <Option value="Yellow Gold">Yellow Gold</Option>
                            <Option value="White Gold">White Gold</Option>
                            <Option value="Rose Gold">Rose Gold</Option>
                            <Option value="Green Gold">Green Gold</Option>
                            <Option value="Black Hills Gold">
                                Black Hills Gold
                            </Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="purity"
                        label="Purity Value"
                        rules={[{ required: true }]}
                        style={{ width: '220px', height: '35px' }}
                    >
                        <Select placeholder="Select purity value">
                            <Option value="24k">24k</Option>
                            <Option value="22k">22k</Option>
                            <Option value="18k">18k</Option>
                            <Option value="14k">14k</Option>
                            <Option value="10k">10k</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                {necklaceChainBraceletCategoryIds.includes(category_id) && (
                    <Col span={12}>
                        <Form.Item
                            name="clasp_type"
                            label="Clasp Type"
                            style={{ width: '300px', height: '35px' }}
                        >
                            <Select placeholder="Select a clasp type">
                                <Option value="Lobster Clasp">
                                    Lobster Clasp
                                </Option>
                                <Option value="Spring Ring">Spring Ring</Option>
                                <Option value="Toggle Clasp">
                                    Toggle Clasp
                                </Option>
                                <Option value="Box Clasp">Box Clasp</Option>
                                <Option value="Barrel Clasp">
                                    Barrel Clasp
                                </Option>
                                <Option value="S Hook Clasp">
                                    S Hook Clasp
                                </Option>
                                <Option value="Slide Lock Clasp">
                                    Slide Lock Clasp
                                </Option>
                                <Option value="Hook and Eye Clasp">
                                    Hook and Eye Clasp
                                </Option>
                                <Option value="Magnetic Clasp">
                                    Magnetic Clasp
                                </Option>
                                <Option value="Fishhook Clasp">
                                    Fishhook Clasp
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>
                )}
                <Col span={12}>
                    {/* <Form.Item
                        name="Chain_type"
                        label="Chain Type"
                        // rules={[{ required: true }]}
                        style={{ width: '300px', height: '35px' }}
                    >
                        <Select placeholder="Select a chain type">
                            <Option value="Cable Chain">Cable Chain</Option>
                            <Option value="Figaro Chain">Figaro Chain</Option>
                            <Option value="Box Chain">Box Chain</Option>
                            <Option value="Rope Chain">Rope Chain</Option>
                            <Option value="Other">Other</Option>
                        </Select>
                    </Form.Item> */}
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="weight"
                        label="Weight"
                        // rules={[{ required: true }]}
                        style={{ width: '300px', height: '35px' }}
                    >
                        <Input placeholder="Enter weight (in grams)" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    {category_id === 58 && (
                        <Form.Item
                            name="size"
                            label="Ring Size"
                            rules={[{ required: true }]}
                            style={{ width: '300px', height: '35px' }}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select available sizes"
                            >
                                <Option value="6">6</Option>
                                <Option value="7">7</Option>
                                <Option value="8">8</Option>
                                <Option value="9">9</Option>
                                <Option value="10">10</Option>
                                <Option value="11">11</Option>
                                <Option value="12">12</Option>
                                <Option value="13">12</Option>
                                <Option value="14">14</Option>
                                <Option value="15">15</Option>
                                <Option value="16">16</Option>
                                <Option value="17">17</Option>
                                <Option value="18">18</Option>
                                <Option value="19">19</Option>
                                <Option value="20">20</Option>
                                <Option value="21">21</Option>
                                <Option value="22">22</Option>
                                <Option value="23">23</Option>
                                <Option value="24">24</Option>
                                <Option value="25">25</Option>
                                <Option value="26">26</Option>
                                <Option value="27">27</Option>
                                <Option value="28">28</Option>
                                <Option value="29">29</Option>
                                <Option value="30">30</Option>
                            </Select>
                        </Form.Item>
                    )}
                    {category_id === 64 && (
                        <Form.Item
                            name="size"
                            label="Bangle Size"
                            rules={[{ required: true }]}
                            style={{ width: '350px', height: '35px' }}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select available sizes"
                            >
                                <Option value='2-2(2 2/16")'>
                                    2-2(2 2/16")
                                </Option>
                                <Option value='2-4(2 4/16")'>
                                    2-4(2 4/16")
                                </Option>
                                <Option value='2-6(2 6/16")'>
                                    2-6(2 6/16")
                                </Option>
                                <Option value='2-8(2 8/16")'>
                                    2-8(2 8/16")
                                </Option>
                                <Option value='2-10(2 10/16")'>
                                    2-10(2 10/16")
                                </Option>
                                <Option value='2-12(2 12/16")'>
                                    2-12(2 12/16")
                                </Option>
                                <Option value='2-14(2 14/16")'>
                                    2-14(2 14/16")
                                </Option>
                                <Option value='2-16(2 16/16")'>
                                    2-16(2 16/16")
                                </Option>
                            </Select>
                        </Form.Item>
                    )}
                    {category_id !== 58 && category_id !== 64 && (
                        <Form.Item
                            name="size"
                            label="Size"
                            style={{ width: '300px', height: '35px' }}
                        >
                            <Input placeholder="Enter size (e.g. Height, Width)" />
                        </Form.Item>
                    )}
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="no_of_gems"
                        label="No Of Gems"
                        rules={[{ required: true }]}
                        style={{ width: '200px', height: '35px' }}
                    >
                        <Input
                            placeholder="Enter no of gems"
                            type="number"
                            min={0}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="gem_type"
                        label="Gem Type"
                        style={{ width: '330px', height: '35px' }}
                    >
                        <Select placeholder="Select gem types" mode="multiple">
                            <Option value="Diamond">Diamond</Option>
                            <Option value="Ruby">Ruby</Option>
                            <Option value="Sapphire">Sapphire</Option>
                            <Option value="Emerald">Emerald</Option>
                            <Option value="Pearl">Pearl</Option>
                            <Option value="Amethyst">Amethyst</Option>
                            <Option value="Cubic Zirconia">
                                Cubic Zirconia
                            </Option>
                            <Option value="Topaz">Topaz</Option>
                            <Option value="Peridot">Peridot</Option>
                            <Option value="Garnet">Garnet</Option>
                            <Option value="Opal">Opal</Option>
                            <Option value="Aquamarine">Aquamarine</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Col span={12}>
                <Form.Item
                    style={{ width: '330px', height: '35px' }}
                    name="gem_color"
                    label="Gem Color"
                >
                    <Input placeholder="Enter gem colors (green, blue, red..)" />
                </Form.Item>
            </Col>
            <Row gutter={16}>
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
                            <Option value="Gift Giving">Gift Giving</Option>
                            <Option value="Ethnic wear">Ethnic wear</Option>
                            <Option value="Casual Wear">Casual Wear</Option>
                        </Select>
                    </Form.Item>
                </Col>
                {/* <Col>
                    <Form.Item
                        name="stock_quantity"
                        label="Stock Quantity"
                        rules={[{ required: true }]}
                        style={{
                            width: '320px',
                            height: '35px',
                            marginTop: '10px',
                        }}
                    >
                        <Input
                            placeholder="Enter stock quantity"
                            type="number"
                            min={0}
                        />
                    </Form.Item>
                </Col> */}
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
                            // background: '#1890ff',
                            // borderColor: '#1890ff',
                            background: '#832729',
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

export default EditInDepthDetails
