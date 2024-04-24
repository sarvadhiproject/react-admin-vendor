import React, { useEffect, useState } from 'react'
import { Table, Button } from 'antd'
import axios from 'axios'
import appConfig from 'configs/app.config'

const DeactivatedVendors = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/deactive-vendors`
            )
            setData(response.data.deactiveVendors)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone No',
            dataIndex: 'phoneno',
        },
        {
            title: 'Company Name',
            dataIndex: 'company_name',
        },
        {
            title: 'GST No',
            dataIndex: 'gstno',
        },
        {
            title: 'Deactivation Date',
            dataIndex: 'updatedAt',
            render: (text, record) => new Date(text).toLocaleString(),
        },
    ]

    return (
        <>
            <h3 style={{ marginBottom: '30px', marginTop: '10px' }}>
                Deactivated Vendors
            </h3>
            <Table
                style={{ backgroundColor: 'transparent' }}
                columns={columns}
                size="small"
                dataSource={data}
            />
        </>
    )
}

export default DeactivatedVendors
