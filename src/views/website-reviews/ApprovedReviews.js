// import React, { useEffect, useState, useMemo } from 'react'
// import { Table, Button, Input, Spin, Empty, Rate } from 'antd'
// import axios from 'axios'
// import { Notification, toast } from 'components/ui'
// import { LoadingOutlined } from '@ant-design/icons'
// import appConfig from 'configs/app.config'

// const ApprovedReviews = ({ refreshTabs, onRejected }) => {
//     const [reviews, setReviews] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [currentPage, setCurrentPage] = useState(1)
//     const [searchQuery, setSearchQuery] = useState('')

//     useEffect(() => {
//         fetchReviews()
//     }, [refreshTabs])

//     const fetchReviews = async () => {
//         setLoading(true)
//         try {
//             const response = await axios.get(
//                 `${appConfig.apiPrefix}/website-reviews/approved`
//             )
//             setReviews(response?.data || [])
//         } catch (error) {
//             toast.push(
//                 <Notification
//                     title={'Failed to fetch reviews'}
//                     type="danger"
//                     duration={2500}
//                 >
//                     {error.message} - Please try again later
//                 </Notification>,
//                 {
//                     placement: 'top-center',
//                 }
//             )
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleReject = async (record) => {
//         try {
//             await axios.put(
//                 `${appConfig.apiPrefix}/website-reviews/${record.review_id}`,
//                 { status: 'reject' }
//             )
//             toast.push(
//                 <Notification
//                     title={'Successfully rejected'}
//                     type="success"
//                     duration={2500}
//                 >
//                     Review rejected successfully
//                 </Notification>,
//                 {
//                     placement: 'top-center',
//                 }
//             )
//             onRejected()
//             fetchReviews()
//         } catch (error) {
//             toast.push(
//                 <Notification
//                     title={'Failed to reject review'}
//                     type="danger"
//                     duration={2500}
//                 >
//                     {error.message} - Please try again later
//                 </Notification>,
//                 {
//                     placement: 'top-center',
//                 }
//             )
//         }
//     }

//     const filteredReviews = useMemo(() => {
//         return reviews.filter((review) => {
//             const fullName =
//                 `${review?.user?.first_name} ${review?.user?.last_name}`.toLowerCase()
//             const reviewText = review?.review_text?.toLowerCase()
//             const search = searchQuery.toLowerCase()
//             return fullName.includes(search) || reviewText.includes(search)
//         })
//     }, [reviews, searchQuery])

//     const indexStart = useMemo(() => {
//         const pageSize = 10 // Adjust this to your desired page size
//         return (currentPage - 1) * pageSize
//     }, [currentPage])

//     const columns = [
//         {
//             title: '#',
//             dataIndex: 'review_id',
//             key: 'review_id',
//             render: (text, record, index) => (
//                 <span style={{ color: '#666' }}>{indexStart + index + 1}</span>
//             ),
//         },
//         {
//             title: 'User Name',
//             dataIndex: 'user',
//             key: 'user_name',
//             sorter: (a, b) =>
//                 a.user.first_name.localeCompare(b.user.first_name),
//             render: (user) => (
//                 <span style={{ color: '#666' }}>
//                     {`${user?.first_name} ${user?.last_name}`}
//                 </span>
//             ),
//         },
//         {
//             title: 'Ratings',
//             dataIndex: 'ratings',
//             key: 'ratings',
//             sorter: (a, b) => a.ratings - b.ratings,
//             render: (rating) => <Rate disabled value={rating} />,
//         },
//         {
//             title: 'Review Text',
//             dataIndex: 'review_text',
//             key: 'review_text',
//             render: (text) => <span style={{ color: '#666' }}>{text}</span>,
//         },
//         {
//             title: 'Action',
//             key: 'action',
//             render: (text, record) => (
//                 <Button
//                     type="danger"
//                     style={{
//                         backgroundColor: '#dc3545',
//                         color: 'white',
//                         borderColor: '#dc3545',
//                     }}
//                     onClick={() => handleReject(record)}
//                 >
//                     Reject
//                 </Button>
//             ),
//         },
//     ]

//     return (
//         <>
//             <div
//                 style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: '20px',
//                 }}
//             >
//                 <h5>Customer Reviews</h5>
//                 <Input.Search
//                     placeholder="Search reviews..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     style={{ width: 270 }}
//                     size="large"
//                 />
//             </div>

//             {loading ? (
//                 <center>
//                     <Spin
//                         indicator={
//                             <LoadingOutlined
//                                 style={{ fontSize: 28, color: '#832729' }}
//                                 spin
//                             />
//                         }
//                     />
//                 </center>
//             ) : filteredReviews.length > 0 ? (
//                 <Table
//                     dataSource={filteredReviews}
//                     columns={columns}
//                     rowKey="review_id"
//                     pagination={{
//                         current: currentPage,
//                         onChange: (page) => setCurrentPage(page),
//                     }}
//                 />
//             ) : reviews.length === 0 ? (
//                 <Empty description="No reviews found!" />
//             ) : (
//                 <Empty description={`No reviews found for '${searchQuery}'`} />
//             )}
//         </>
//     )
// }

// export default ApprovedReviews

import React, { useEffect, useState, useMemo } from 'react'
import { Table, Button, Input, Spin, Empty, Rate } from 'antd'
import axios from 'axios'
import { Notification, toast } from 'components/ui'
import { LoadingOutlined } from '@ant-design/icons'
import appConfig from 'configs/app.config'

const ApprovedReviews = ({ refreshTabs, onRejected }) => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchReviews()
    }, [refreshTabs])

    const fetchReviews = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `${appConfig.apiPrefix}/website-reviews/approved`
            )
            setReviews(response?.data || [])
        } catch (error) {
            toast.push(
                <Notification
                    title={'Failed to fetch reviews'}
                    type="danger"
                    duration={2500}
                >
                    {error.message} - Please try again later
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setLoading(false)
        }
    }

    const handleReject = async (record) => {
        try {
            await axios.put(
                `${appConfig.apiPrefix}/website-reviews/${record.review_id}`,
                { status: 'reject' }
            )
            toast.push(
                <Notification
                    title={'Successfully rejected'}
                    type="success"
                    duration={2500}
                >
                    Review rejected successfully
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            onRejected()
            fetchReviews()
        } catch (error) {
            toast.push(
                <Notification
                    title={'Failed to reject review'}
                    type="danger"
                    duration={2500}
                >
                    {error.message} - Please try again later
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    const filteredReviews = useMemo(() => {
        return reviews.filter((review) => {
            const fullName =
                `${review?.first_name} ${review?.last_name}`.toLowerCase()
            const reviewText = review?.review_text?.toLowerCase()
            const search = searchQuery.toLowerCase()
            return fullName.includes(search) || reviewText.includes(search)
        })
    }, [reviews, searchQuery])

    const indexStart = useMemo(() => {
        const pageSize = 10 // Adjust this to your desired page size
        return (currentPage - 1) * pageSize
    }, [currentPage])

    const columns = [
        {
            title: '#',
            dataIndex: 'review_id',
            key: 'review_id',
            render: (text, record, index) => (
                <span style={{ color: '#666' }}>{indexStart + index + 1}</span>
            ),
        },
        {
            title: 'User Name',
            dataIndex: 'user',
            key: 'user_name',
            sorter: (a, b) =>
                a.first_name.localeCompare(b.first_name),
            render: (text, record) => (
                <span style={{ color: '#666' }}>
                    {`${record?.first_name} ${record?.last_name}`}
                </span>
            ),
        },
        {
            title: 'Ratings',
            dataIndex: 'ratings',
            key: 'ratings',
            sorter: (a, b) => a.ratings - b.ratings,
            render: (rating) => <Rate disabled value={rating} />,
        },
        {
            title: 'Review Text',
            dataIndex: 'review_text',
            key: 'review_text',
            render: (text) => <span style={{ color: '#666' }}>{text}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button
                    type="danger"
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        borderColor: '#dc3545',
                    }}
                    onClick={() => handleReject(record)}
                >
                    Reject
                </Button>
            ),
        },
    ]

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                }}
            >
                <h5>Customer Reviews</h5>
                <Input.Search
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: 270 }}
                    size="large"
                />
            </div>

            {loading ? (
                <center>
                    <Spin
                        indicator={
                            <LoadingOutlined
                                style={{ fontSize: 28, color: '#832729' }}
                                spin
                            />
                        }
                    />
                </center>
            ) : filteredReviews.length > 0 ? (
                <Table
                    dataSource={filteredReviews}
                    columns={columns}
                    rowKey="review_id"
                    pagination={{
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                    }}
                />
            ) : reviews.length === 0 ? (
                <Empty description="No reviews found!" />
            ) : (
                <Empty description={`No reviews found for '${searchQuery}'`} />
            )}
        </>
    )
}

export default ApprovedReviews