import axios from 'axios'
import Loader from '../components/Loader'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import React, { useState, useEffect } from 'react'
import { PayPalButton } from 'react-paypal-button-v2'
import { useSelector, useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { getOrder, payOrder, deliverOrder } from '../store'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, Alert } from 'react-bootstrap'


function OrderPage() {
    const { id } = useParams()
    const { userInfo } = useSelector((state) => state.user)
    const { getOrderDetails, loading } = useSelector((state) => state.order)
    const { successPay, loadingPay } = useSelector((state) => state.order.orderPay)
    const { loading:loadingDeliver, success:successDeliver } = useSelector((state) => state.order.orderDeliver)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [sdkReady, setSdkReady] = useState(false)

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    }

    const paypalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AfmvwIWNvUHM1kGVvS-s3Vrwf75AAE-4zRUMP54tQKDs22177BV-Lw8ExiGKQMTO0MvF_nhtAav1vrax'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    useEffect(() => {
        if (!userInfo) navigate('/login')

        if (!getOrderDetails || successPay || getOrderDetails._id !== Number(id) || successDeliver) {
            axios.get(`/api/orders/${id}/`, config).then((res) => {
                dispatch(getOrder(res.data))
            })
        } 
        
        if (!getOrderDetails.isPaid) {
            if (!window.paypal) {
                paypalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, id, getOrderDetails, successPay, successDeliver])

    const successPaymentHandler = (paymentResult) => {
        axios.put(`/api/orders/${id}/pay/`, {}, config).then((res) => {
            dispatch(payOrder())
        })
    }

    const deliverHandler = () => {
        axios.put(`/api/orders/${id}/deliver/`, {}, config).then((res) => {
            dispatch(deliverOrder())
        })
    }

    return loading ? (
        <Loader />
    ) : (
        <div>
            <h1 className="my-4 border-b-2 border-black ml-[16px]">ORDER NO: #{getOrderDetails._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2 className="mb-3">SHIPPING</h2>
                            <p><strong>Name: </strong>{getOrderDetails.user.name}</p>
                            <p><strong>Email Address: </strong>{getOrderDetails.user.email}</p>
                            <p>
                                <strong>Shipping Address: </strong> {getOrderDetails.shippingAddress.address}, {getOrderDetails.shippingAddress.city}
                                {'   '}
                                {getOrderDetails.shippingAddress.postalCode},
                                {'   '}
                                {getOrderDetails.shippingAddress.country}
                            </p>
                            <p className="flex items-center text-center">
                                <strong className='mr-1'>Status: </strong> {getOrderDetails.isDelivered ? (
                                    <span className="flex items-center text-center">
                                       <CheckCircleIcon className='mr-1 text-green-600'/> Delivered On {getOrderDetails.deliveredAt}
                                    </span>
                                ) : (
                                    <span className="flex items-center text-center">
                                       <CancelIcon className='mr-1 text-red-600'/> Not Delivered 
                                    </span>
                                )}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2 className="my-3">PAYMENT METHOD</h2>

                            <p>
                                <strong>Method: </strong> {getOrderDetails.paymentMethod}
                            </p>
                            <p className="flex items-center text-center">
                                <strong className='mr-1'>Status: </strong> {getOrderDetails.isPaid ? (
                                    <span className="flex items-center text-center">
                                       <CheckCircleIcon className='mr-1 text-green-600'/> Paid On {getOrderDetails.paidAt}
                                    </span>
                                ) : (
                                    <span className="flex items-center text-center">
                                       <CancelIcon className='mr-1 text-red-600'/> Not Paid 
                                    </span>
                                )}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2 className="my-3">ORDER ITEMS</h2>
                            {getOrderDetails.orderItems.length === 0 ? (
                                <Alert variant='info' className="flex justify-between items-center">
                                    Your Order is Empty!   
                                    <Link to="/" className="btn border-2 border-black hover:bg-black hover:text-white px-[24px] py-[12px]">RETURN TO HOME</Link>
                                </Alert>) : (
                                    <ListGroup variant='flush'>
                                        {getOrderDetails.orderItems.map((item, index) => {
                                            return (<ListGroup.Item key={index}>
                                                <Row className="flex items-center">
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded/>
                                                    </Col>
                                                    <Col>
                                                        <Link className="hover:underline" to={`/product/${item.product}`}>{item.name}</Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>)
                                        })}
                                    </ListGroup>
                                )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2 className="my-2">ORDER SUMMARY</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Subtotal: 
                                    </Col>
                                    <Col>
                                        ${getOrderDetails.subTotal}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Shipping: 
                                    </Col>
                                    <Col>
                                        ${getOrderDetails.shippingPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Tax: 
                                    </Col>
                                    <Col>
                                        ${getOrderDetails.taxPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Total: 
                                    </Col>
                                    <Col>
                                        ${getOrderDetails.totalPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            
                            {!getOrderDetails.isPaid && (
                                <ListGroup.Item>
                                    {!sdkReady ? (
                                        <Loader /> 
                                    ) : (
                                        <PayPalButton amount={getOrderDetails.totalPrice} onSuccess={successPaymentHandler} />
                                    )}
                                </ListGroup.Item>
                            )}

                            {userInfo && userInfo.isAdmin && getOrderDetails.isPaid && !getOrderDetails.isDelivered && (
                                <ListGroup.Item className="flex">
                                    <Button type='button' className='btn basis-0 flex flex-grow mr-1' onClick={deliverHandler}>
                                        MARK AS DELIVERED
                                    </Button>
                                    <LinkContainer to="/admin/orderlist">
                                        <Button type='button' className='btn basis-0 flex flex-grow'>
                                            GO BACK TO ORDERS
                                        </Button>
                                    </LinkContainer>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderPage
