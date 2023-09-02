import axios from "axios"
import Loader from '../components/Loader'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Alert } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { adminListRequest, adminListSuccess, adminListError } from "../store"

function OrderListPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { orders, loading, error} = useSelector((state) => state.order.adminOrders)
    const { userInfo } = useSelector((state) => state.user)

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) navigate('/login')

        dispatch(adminListRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        axios.get(`/api/orders`, config).then((res) => {   
            dispatch(adminListSuccess(res.data))
        }).catch((err) => {
            const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message
            dispatch(adminListError(payload))
        })
    }, [dispatch, navigate])

    return (
        <div>
            <h1 className="mt-4">ORDERS</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Table striped bordered hover responsive className="table-sm my-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, key) => {
                            return (<tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>{order.isPaid ? <CheckCircleIcon className="text-green-600"/> : <CancelIcon className="text-red-600"/>}</td>
                                <td>{order.isDelivered ? <CheckCircleIcon className="text-green-600"/> : <CancelIcon className="text-red-600"/>}</td>
                                <td>
                                    <LinkContainer to={`/orders/${order._id}`}>
                                        <Button className="btn-sm">DETAILS</Button>
                                    </LinkContainer>
                                </td>
                            </tr>)
                        })}
                    </tbody>
                </Table>
            )}
        </div>
    )
}

export default OrderListPage
