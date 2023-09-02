import axios from 'axios'
import FormContainer from '../components/FormContainer'
import CheckoutProgress from '../components/CheckoutProgress'

import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createNewOrder, resetNewOrder, clearCart } from '../store'
import { Button, Row, Col, ListGroup, Image, Card, Alert } from 'react-bootstrap'

function SummaryPage() {
    const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart)
    const { userInfo } = useSelector((state) => state.user)
    const { newOrderInfo, success } = useSelector((state) => state.order)

    const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    const shippingPrice = (subTotal > 100 ? 0 : 10).toFixed(2)
    const taxPrice = ((0.13) * subTotal).toFixed(2)
    const totalPrice = (Number(subTotal) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (success) {
            navigate(`/orders/${newOrderInfo._id}`)
            dispatch(clearCart())
            dispatch(resetNewOrder())
        } 
    }, [success, navigate])
    
    const placeOrder = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const order = {
            orderItems: cartItems,
            shippingAddress: shippingAddress, 
            paymentMethod: paymentMethod,
            subTotal: subTotal,
            taxPrice: taxPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice,
        }

        axios.post("/api/orders/add/", order, config).then((res) => {
            dispatch(createNewOrder(res.data))
        })
    }

    return (
        <div>
            <FormContainer>
                <CheckoutProgress stage1 stage2 stage3 stage4 />
            </FormContainer>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2 className="mb-3">SHIPPING</h2>

                            <p>
                                <strong>Shipping Address: </strong> {shippingAddress.address}, {shippingAddress.city}
                                {'   '}
                                {shippingAddress.postalCode},
                                {'   '}
                                {shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2 className="my-3">PAYMENT METHOD</h2>

                            <p>
                                <strong>Method: </strong> {paymentMethod}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2 className="my-3">ORDER ITEMS</h2>
                            {cartItems.length === 0 ? (
                                <Alert variant='info' className="flex justify-between items-center">
                                    Your Cart is Currently Empty!   
                                    <Link to="/" className="btn border-2 border-black hover:bg-black hover:text-white px-[24px] py-[12px]">RETURN TO HOME</Link>
                                </Alert>) : (
                                    <ListGroup variant='flush'>
                                        {cartItems.map((item, index) => {
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
                        <ListGroup varian='flush'>
                            <ListGroup.Item>
                                <h2 className="my-2">ORDER SUMMARY</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Subtotal: 
                                    </Col>
                                    <Col>
                                        ${subTotal}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Shipping: 
                                    </Col>
                                    <Col>
                                        ${shippingPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Tax: 
                                    </Col>
                                    <Col>
                                        ${taxPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Total: 
                                    </Col>
                                    <Col>
                                        ${totalPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item className="flex">
                                <Button onClick={placeOrder} disabled={cartItems.length === 0} className="border-b-gray-400 flex-grow" type='button' variant='primary'>PLACE ORDER</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default SummaryPage
