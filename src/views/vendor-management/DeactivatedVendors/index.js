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

    // const handleActivate = (record) => {
    //     // Implement your logic to approve vendor request here
    //     console.log('Activating vendor account:', record)
    // }

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone No',
            dataIndex: 'phoneNo',
        },
        {
            title: 'Company Name',
            dataIndex: 'CompanyName',
        },
        {
            title: 'GST No',
            dataIndex: 'GSTNo',
        },
        {
            title: 'Deactivation Date',
            dataIndex: 'updatedAt',
            render: (text, record) => new Date(text).toLocaleString(),
        },
        // {
        //     title: 'Action',
        //     dataIndex: 'action',
        //     render: (_, record) => (
        //         <Button
        //             type="primary"
        //             onClick={() => handleActivate(record)}
        //             // size="small"
        //             style={{
        //                 background: '#1890ff',
        //                 borderColor: '#1890ff',
        //                 borderRadius: '4px',
        //                 transition: 'background-color 0.3s',
        //                 '&:hover': {
        //                     background: '#40a9ff',
        //                     borderColor: '#40a9ff',
        //                 },
        //             }}
        //         >
        //             Activate
        //         </Button>
        //     ),
        // },
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
