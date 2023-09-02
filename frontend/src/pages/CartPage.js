import axios from 'axios'

import { Link } from 'react-router-dom'
import React, { useEffect } from 'react'
import { addCart, removeCart } from "../store"
import { LinkContainer} from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card, Alert} from 'react-bootstrap'

function CartPage() {
    const { id } = useParams()
    const qty = window.location.search ? Number(window.location.search.split('=')[1]) : 1
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cartItems = useSelector((state) =>  state.cart.cartItems)   

    useEffect(() => {
        if (id) {
            axios.get(`/api/products/${id}`).then((res) => {
                dispatch(addCart({
                    product: res.data._id,
                    name: res.data.name,
                    image: res.data.image, 
                    price: res.data.price, 
                    countInStock: res.data.countInStock,
                    qty: qty,
                }))
            })
        }
    }, [dispatch, id, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeCart({product: id}))
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={8}>
                <h1 className="mt-4">SHOPPING CART</h1>
                {cartItems.length === 0 ? (
                    <Alert variant='info' className="flex justify-between items-center">
                        Your Cart is Currently Empty!
                        <Link to="/" className="btn border-2 border-black hover:bg-black hover:text-white px-[24px] py-[12px]">RETURN TO HOME</Link>
                    </Alert>) : (
                    <ListGroup className="mt-4">
                        {cartItems.map((item) => {
                            return (
                                <ListGroup.Item key={item.product}>
                                    <Row>
                                        <Col md={2}>
                                            <Image src={item.image} alt={item.name} fluid rounded/>
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/products/${item.product}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={2}>
                                            ${item.price}
                                        </Col>
                                        <Col md={3}>
                                            <Form.Select as="select" value={item.qty} onChange={(event) => dispatch(addCart({
                                                product: item.product, name: item.name, image: item.image, price: item.price, 
                                                countInStock: item.countInStock, qty: Number(event.target.value)}))}>
                                            { [...Array(item.countInStock).keys()].map((value, key) => {
                                                    return <option key={key + 1} value={value + 1}>{value + 1}</option>
                                                })
                                            }
                                            </Form.Select>
                                        </Col>
                                        <Col md={2}>
                                            <Button type='button' variant='light' onClick={() => removeFromCartHandler(item.product)}>
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card className="mt-4">
                    <ListGroup>
                        <ListGroup.Item>
                            <h2 className="mb-4">SUBTOTAL ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) ITEMS</h2>
                            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroup.Item>
                        <ListGroup.Item className="flex">
                            <Button type='button' className='inline-block basis-0 flex-grow' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                                Proceed to Checkout
                            </Button>
                            <LinkContainer to="/">
                                <Button type='button' className='inline-block basis-0 flex-grow ml-2'>
                                    Continue Shopping
                                </Button>
                            </LinkContainer>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartPage
